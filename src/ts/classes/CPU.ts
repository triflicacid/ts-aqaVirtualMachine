import { createCPUExecutionConfigObject, ICPUExecutionConfig, ICPUInstructionSet, IExecuteRecord, MemoryWriteCallback, RegisterWriteCallback } from "../types/CPU";
import { INumberType, NumberType } from "../types/general";
import { getNumTypeInfo, hex, numberToString } from "../utils/general";

export class CPUError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class CPU {
  public readonly instructionSet: ICPUInstructionSet;
  public readonly registerMap: string[]; // Map register names to index positions
  private __registers: ArrayBuffer;
  private _registers: DataView;
  private _ip: number; // As the Instruction Pointer is needed so often, this stord the index of IP in the register ArrayBuffer
  public readonly memorySize: number;
  private __memory: ArrayBuffer;
  private _memory: DataView;
  public readonly numType: INumberType;
  private _callbackMemoryWrite: MemoryWriteCallback;
  private _callbackRegisterWrite: RegisterWriteCallback;
  public executionConfig: ICPUExecutionConfig;


  constructor(instructionSet: ICPUInstructionSet, memorySize: number = 0xfff, numType: NumberType = "float64") {
    this.instructionSet = instructionSet;

    this.numType = getNumTypeInfo(numType);

    this.registerMap = ["r1", "r2", "r3", "r4", "r5", "r6", "r7", "r8", "ip"];
    this._ip = this.registerMap.indexOf("ip");
    this.__registers = new ArrayBuffer(this.registerMap.length * this.numType.bytes);
    this._registers = new DataView(this.__registers);

    this.memorySize = memorySize;
    this.__memory = new ArrayBuffer(this.memorySize * this.numType.bytes);
    this._memory = new DataView(this.__memory);

    this.executionConfig = createCPUExecutionConfigObject();
  }

  /** Get index of register in register array. Return NaN is does not exist. */
  public getRegisterIndexFromName(name: string): number {
    const index = this.registerMap.indexOf(name);
    return index == -1 ? NaN : index;
  }

  /** Read value of register at said index */
  public readRegister(register: number | string): number {
    let index = typeof register === 'string' ? this.registerMap.indexOf(register) : Math.floor(register);
    if (isNaN(index) || index === -1) throw new Error(`readRegister: invalid argument provided '${register}'`);
    return this._registers[this.numType.getMethod](index * this.numType.bytes);
  }

  /** Write value to register at said index */
  public writeRegister(register: number | string, value: number): void {
    let index = typeof register === 'string' ? this.registerMap.indexOf(register) : Math.floor(register);
    if (isNaN(index) || index === -1) throw new Error(`writeRegister: invalid argument provided '${register}'`);
    this._registers[this.numType.setMethod](index * this.numType.bytes, value);
    if (typeof this._callbackRegisterWrite === 'function') this._callbackRegisterWrite(index, value, this);
  }

  /** Is this a valid memory address? */
  public isValidAddress(address: number): boolean { return address >= 0 && address < this.memorySize; }

  /** Read from memory */
  public readMemory(address: number): number {
    // As the offset is in bytes, we need to jump a whole <bytes> bytes to jump over the data pieces
    try {
      return this._memory[this.numType.getMethod](address * this.numType.bytes);
    } catch (e) {
      throw new Error(`readMemory: unable to read from address 0x${address.toString(16)}:\n${e}`);
    }
  }

  /** Write value to memory */
  public writeMemory(address: number, value: number): void {
    try {
      this._memory[this.numType.setMethod](address * this.numType.bytes, value);
    } catch (e) {
      throw new Error(`writeMemory: unable to write to address 0x${address.toString(16)} (value: 0x${value.toString(16)}):\n${e}`);
    }
    if (typeof this._callbackMemoryWrite === 'function') this._callbackMemoryWrite(address, address, this);
  }

  /** Write bytes to a single memory address. Return number this represents. */
  public writeMemoryBytes(address: number, bytes: ArrayBuffer): number {
    try {
      if (bytes.byteLength !== this.numType.bytes) throw new RangeError(`writeMemoryBytes: CPU type is ${this.numType.type} which requires ${this.numType.bytes} bytes; got ${bytes.byteLength} bytes`);
      const view = new DataView(bytes);
      let actualAddress = address * this.numType.bytes;
      for (let i = 0; i < view.byteLength; i++) {
        this._memory.setUint8(actualAddress + i, view.getUint8(i));
      }
      if (typeof this._callbackMemoryWrite === 'function') this._callbackMemoryWrite(address, address, this);
      return this._memory[this.numType.getMethod](actualAddress);
    } catch (e) {
      throw new Error(`writeMemoryBytes: unable to write ${bytes.byteLength} bytes to address 0x${address.toString(16)}:\n${e}`);
    }
  }

  /** Write ArrayBuffer of any length into memory, starting at said address. */
  public loadMemoryBytes(startAddress: number, bytes: ArrayBuffer): number {
    try {
      const view = new DataView(bytes);
      for (let i = 0; i < view.byteLength; i++) {
        this._memory.setUint8(startAddress + i, view.getUint8(i));
      }
      let endAddress = startAddress + (view.byteLength / this.numType.bytes);
      if (typeof this._callbackMemoryWrite === 'function') this._callbackMemoryWrite(startAddress, endAddress, this);
      return endAddress;
    } catch (e) {
      throw new Error(`loadMemoryBytes: unable to write ${bytes.byteLength} bytes to memory starting at address 0x${startAddress.toString(16)}:\n${e}`);
    }
  }

  /** Set every memory address in range to specified value. */
  public writeMemoryBulk(start: number, end: number, value: number): void {
    try {
      for (let address = start; address < end; address++) {
        this._memory[this.numType.setMethod](address * this.numType.bytes, value);
      }
      if (typeof this._callbackMemoryWrite === 'function') this._callbackMemoryWrite(start, end, this);
    } catch (e) {
      throw new Error(`writeMemoryBulk: unable to write value 0x${value.toString(16)} to addresses ranging 0x${start.toString(16)} to 0x${end.toString(16)}:\n${e}`);
    }
  }

  public onMemoryWrite(cb: MemoryWriteCallback): void {
    this._callbackMemoryWrite = cb;
  }

  public onRegisterWrite(cb: RegisterWriteCallback): void {
    this._callbackRegisterWrite = cb;
  }

  /** Transform number to hexadecimal in out numbering format */
  public toHex(n: number): string {
    return numberToString(this.numType, n, 16);
  }


  /** Get next word in memory, and increment IP */
  public fetch(): number {
    const ip = this.readRegister(this._ip);
    const word = this.readMemory(ip);
    this.writeRegister(this._ip, ip + 1);
    return word;
  }

  /** Execute command associated with <opcode>. Return continue execution? */
  public execute(opcode: number, info: IExecuteRecord): boolean {
    let continueExec = true;

    switch (opcode) {
      case this.instructionSet.NULL:
        if (this.executionConfig.commentary) info.text = this.executionConfig.haltOnNull ? 'NULL: halted programme execution' : 'Skip NULL instruction';
        if (this.executionConfig.detail) info.opcodeMnemonic = "NULL";
        continueExec = !this.executionConfig.haltOnNull;
        break;
      case this.instructionSet.HALT:
        if (this.executionConfig.commentary) info.text = 'Halt programme execution';
        if (this.executionConfig.detail) info.opcodeMnemonic = "HALT";
        continueExec = false;
        break;
      case this.instructionSet.LDR: {
        const register = this.fetch(), address = this.fetch();
        const addressValue = this.readMemory(address);
        info.args = [register, address];
        if (this.executionConfig.commentary) {
          info.text = `Load memory address 0x${this.toHex(address)} (0x${this.toHex(addressValue)}) to register ${this.registerMap[register]}`;
        }
        if (this.executionConfig.detail) {
          info.opcodeMnemonic = "LDR";
          info.argStrs = ["register: " + this.registerMap[register], "address: 0x" + hex(address)];
        }
        this.writeRegister(register, this.readMemory(address));
        break;
      }
      default:
        info.termination = true;
        throw new Error(`execute: unknown opcode 0x${opcode.toString(16)}`);
    }
    info.termination = !continueExec;
    return continueExec;
  }

  /** One fetch-execute cycle. Return whether to continue or not. */
  public cycle(info: IExecuteRecord): boolean {
    const ip = this.readRegister(this._ip);
    info.ip = ip;
    try {
      let opcode: number;
      try {
        opcode = this.fetch();
        info.opcode = opcode;
      } catch (e) {
        const error = new Error(`cycle: cannot fetch next word in memory:\n${e}`);
        info.error = error;
        throw error;
      }

      let cont: boolean;
      try {
        cont = this.execute(opcode, info);
      } catch (e) {
        const error = new Error(`cycle: failed to execute opcode 0x${opcode.toString(16)}:\n${e}`);
        info.error = error;
        throw error;
      }
      return cont;
    } catch (e) {
      // this.writeRegister(this._ip, ip); // Reset instruction pointer
      info.termination = true;
      throw new Error(`cycle: failed to complete CPU cycle where ip = 0x${ip}:\n${e}`);
    }
  }
}

export default CPU;
