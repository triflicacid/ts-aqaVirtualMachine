import { CPUModel, ICPUConfiguration, IExecuteRecord } from "../../types/CPU";
import { NumberType } from "../../types/general";
import CPU from "./CPU";
import { instructionSet } from '../../instruction-set/rs';

export class RSProcessor extends CPU {
    public static readonly defaultRegisters: string[] = ["r1", "r2", "r3", "r4", "r5", "r6", "r7", "r8", "r9", "r10", "r11", "r12"];
    public static readonly defaultNumType: NumberType = 'float32';
    public static readonly requiredRegisters: string[] = ["ip", "acc"];
    public readonly model: CPUModel = CPUModel.RS;

    protected readonly _acc: number; // Index of accumulator register

    public constructor(config: ICPUConfiguration) {
        super(instructionSet, config, RSProcessor.defaultRegisters, RSProcessor.defaultNumType, RSProcessor.requiredRegisters);
        this._acc = this.registerMap.indexOf('acc');
    }

    /** @override */
    public execute(opcode: number, info: IExecuteRecord): boolean {
        let continueExec = true, comment = this.executionConfig.commentary;

        switch (opcode) {
            case this.instructionSet.NOP:
                // NOP
                if (comment) info.text = this.executionConfig.haltOnNull ? 'NOP: halted programme execution' : 'Skip NOP instruction';
                continueExec = !this.executionConfig.haltOnNull;
                break;
            case this.instructionSet.HALT:
                // HALT
                if (comment) info.text = `Halt execution`;
                continueExec = false;
                break;
            case this.instructionSet.MOV_REG_REG: {
                // MOV register1 register2
                const register1 = this.fetch(), register2 = this.fetch();
                info.args = [register1, register2];
                const register2value = this.readRegister(register2);
                if (comment) info.text = `Copy value in register ${this.registerMap[register2]} (0x${this.toHex(register2value)}) to register ${this.registerMap[register1]}`;
                this.writeRegister(register1, register2value);
                break;
            }
            case this.instructionSet.MOV_CONST_REG: {
                // MOV register constant
                const register = this.fetch(), constant = this.fetch();
                info.args = [register, constant];
                if (comment) info.text = `Move 0x${this.toHex(constant)} to register ${this.registerMap[register]}`;
                this.writeRegister(register, constant);
                break;
            }
            case this.instructionSet.MOV_ADDR_REG: {
                // MOV register address
                const register = this.fetch(), address = this.fetch();
                info.args = [register, address];
                const value = this.readMemory(address);
                if (comment) info.text = `Copy value at address 0x${this.toHex(address)} (0x${this.toHex(value)}) to register ${this.registerMap[register]}`;
                this.writeRegister(register, value);
                break;
            }
            case this.instructionSet.MOV_REG_ADDR: {
                // MOV address register
                const address = this.fetch(), register = this.fetch();
                info.args = [address, register];
                const value = this.readRegister(register);
                if (comment) info.text = `Copy value at  register ${this.registerMap[register]} (0x${this.toHex(value)}) to address 0x${this.toHex(address)}`;
                this.writeMemory(address, value);
                break;
            }
            case this.instructionSet.MOV_REGPTR_REG: {
                // MOV registerPtr register
                const registerPtr = this.fetch(), register = this.fetch();
                info.args = [registerPtr, register];
                const address = this.readRegister(registerPtr), registerValue = this.readRegister(register);
                if (comment) info.text = `Copy value at register ${this.registerMap[register]} (0x${this.toHex(registerValue)}) to address in register ${this.registerMap[registerPtr]} (address 0x${this.toHex(address)})`;
                this.writeMemory(address, registerValue);
                break;
            }
            case this.instructionSet.MOV_REG_REGPTR: {
                // MOV register registerPtr
                const register = this.fetch(), registerPtr = this.fetch();
                info.args = [register, registerPtr];
                const address = this.readRegister(registerPtr), value = this.readMemory(address);
                if (comment) info.text = `Copy value stored at address in register ${this.registerMap[register]} (address 0x${this.toHex(address)} : 0x${this.toHex(value)}) to register ${this.registerMap[registerPtr]}`;
                this.writeRegister(register, value);
                break;
            }
            case this.instructionSet.ADD_REG: {
                // ADD register
                const register = this.fetch(), value = this.readRegister(register);
                info.args = [register];
                const acc = this.readRegister(this._acc), result = acc + value;
                if (comment) info.text = `accumulator = accumulator + ${this.registerMap[register]}\n0x${this.toHex(acc)} + 0x${this.toHex(value)} = 0x${this.toHex(result)}`;
                this.writeRegister(this._acc, result);
                break;
            }
            case this.instructionSet.ADD_CONST: {
                // ADD constant
                const constant = this.fetch();
                info.args = [constant];
                const acc = this.readRegister(this._acc), result = acc + constant;
                if (comment) {
                    const hex = this.toHex(constant);
                    info.text = `accumulator =  accumulator + 0x${hex}\n0x${this.toHex(acc)} + 0x${hex} = 0x${this.toHex(result)}`;
                }
                this.writeRegister(this._acc, result);
                break;
            }
            case this.instructionSet.SUB_REG: {
                // SUB register
                const register = this.fetch(), value = this.readRegister(register);
                info.args = [register];
                const acc = this.readRegister(this._acc), result = acc - value;
                if (comment) info.text = `accumulator = accumulator - ${this.registerMap[register]}\n0x${this.toHex(acc)} - 0x${this.toHex(value)} = 0x${this.toHex(result)}`;
                this.writeRegister(this._acc, result);
                break;
            }
            case this.instructionSet.SUB_CONST: {
                // SUB constant
                const constant = this.fetch();
                info.args = [constant];
                const acc = this.readRegister(this._acc), result = acc - constant;
                if (comment) {
                    const hex = this.toHex(constant);
                    info.text = `accumulator = accumulator - 0x${hex}\n0x${this.toHex(acc)} - 0x${hex} = 0x${this.toHex(result)}`;
                }
                this.writeRegister(this._acc, result);
                break;
            }
            case this.instructionSet.MUL_REG: {
                // MUL register
                const register = this.fetch(), value = this.readRegister(register);
                info.args = [register];
                const acc = this.readRegister(this._acc), result = acc * value;
                if (comment) info.text = `accumulator = accumulator * ${this.registerMap[register]}\n0x${this.toHex(acc)} * 0x${this.toHex(value)} = 0x${this.toHex(result)}`;
                this.writeRegister(this._acc, result);
                break;
            }
            case this.instructionSet.MUL_CONST: {
                // MUL constant
                const constant = this.fetch();
                info.args = [constant];
                const acc = this.readRegister(this._acc), result = acc * constant;
                if (comment) {
                    const hex = this.toHex(constant);
                    info.text = `accumulator = accumulator * 0x${hex}\n0x${this.toHex(acc)} * 0x${hex} = 0x${this.toHex(result)}`;
                }
                this.writeRegister(this._acc, result);
                break;
            }
            case this.instructionSet.DIV_REG: {
                // DIV register
                const register = this.fetch(), value = this.readRegister(register);
                info.args = [register];
                const acc = this.readRegister(this._acc), result = acc / value;
                if (comment) info.text = `accumulator = accumulator / ${this.registerMap[register]}\n0x${this.toHex(acc)} / 0x${this.toHex(value)} = 0x${this.toHex(result)}`;
                this.writeRegister(this._acc, result);
                break;
            }
            case this.instructionSet.DIV_CONST: {
                // DIV constant
                const constant = this.fetch();
                info.args = [constant];
                const acc = this.readRegister(this._acc), result = acc / constant;
                if (comment) {
                    const hex = this.toHex(constant);
                    info.text = `accumulator = accumulator / 0x${hex}\n0x${this.toHex(acc)} / 0x${hex} = 0x${this.toHex(result)}`;
                }
                this.writeRegister(this._acc, result);
                break;
            }
            case this.instructionSet.EXP_REG: {
                // EXP register
                const register = this.fetch(), value = this.readRegister(register);
                info.args = [register];
                const acc = this.readRegister(this._acc), result = Math.pow(acc, value);
                if (comment) info.text = `accumulator = accumulator ** ${this.registerMap[register]}\n0x${this.toHex(acc)} ** 0x${this.toHex(value)} = 0x${this.toHex(result)}`;
                this.writeRegister(this._acc, result);
                break;
            }
            case this.instructionSet.EXP_CONST: {
                // EXP constant
                const constant = this.fetch();
                info.args = [constant];
                const acc = this.readRegister(this._acc), result = Math.pow(acc, constant);
                if (comment) {
                    const hex = this.toHex(constant);
                    info.text = `accumulator = accumulator ** 0x${hex}\n0x${this.toHex(acc)} ** 0x${hex} = 0x${this.toHex(result)}`;
                }
                this.writeRegister(this._acc, result);
                break;
            }
            case this.instructionSet.SQRT: {
                // SQRT
                const acc = this.readRegister(this._acc), result = Math.sqrt(acc);
                if (comment) info.text = `accumulator = sqrt(accumulator)\nsqrt(0x${this.toHex(acc)}) = 0x${this.toHex(result)}`;
                this.writeRegister(this._acc, result);
                break;
            }
            case this.instructionSet.INC: {
                // INC register
                const register = this.fetch(), value = this.readRegister(register), result = value + 1;
                if (comment) {
                    const name = this.registerMap[register];
                    info.text = `${name} = ${name} + 1\n0x${this.toHex(value)} + 0x${this.toHex(1)} = 0x${this.toHex(result)}`;
                }
                this.writeRegister(this._acc, result);
                break;
            }
            case this.instructionSet.DEC: {
                // DEC register
                const register = this.fetch(), value = this.readRegister(register), result = value - 1;
                if (comment) {
                    const name = this.registerMap[register];
                    info.text = `${name} = ${name} - 1\n0x${this.toHex(value)} - 0x${this.toHex(1)} = 0x${this.toHex(result)}`;
                }
                this.writeRegister(this._acc, result);
                break;
            }
            default: 
                info.termination = true;
                throw new Error(`execute: unknown opcode 0x${opcode.toString(16)}`);
        }
        info.termination = !continueExec;
        return continueExec;
    }
}

export default RSProcessor;