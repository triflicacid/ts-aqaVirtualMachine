import { AssemblerType, IInstructionSet } from "../types/Assembler";

export const instructionSet: IInstructionSet = {
    NOP: {
        mnemonic: 'NOP',
        opcode: 0x00,
        args: [],
        desc: 'No operation - skip or halt',
        typeSuffix: false,
    },

    // #region Move commands (0x1-)
    MOV_REG_REG: {
        mnemonic: 'MOV',
        opcode: 0x10,
        args: [AssemblerType.Register, AssemblerType.Register],
        desc: 'Copy contents of [register2] to [register1]',
        typeSuffix: false,
    },
    MOV_REGPTR_REG: {
        mnemonic: "MOV",
        opcode: 0x11,
        args: [AssemblerType.RegisterPtr, AssemblerType.Register],
        desc: "Move value stored in register [register] to the address stored in [registerPtr]",
        typeSuffix: false,
    },
    MOV_REG_REGPTR: {
        mnemonic: "MOV",
        opcode: 0x12,
        args: [AssemblerType.Register, AssemblerType.RegisterPtr],
        desc: "Move value stored at address in register [registerPtr] to register [register]",
        typeSuffix: true,
    },
    MOV_CONST_REG: {
        mnemonic: 'MOV',
        opcode: 0x13,
        args: [AssemblerType.Register, AssemblerType.Constant],
        desc: 'Move constant [constant] to [register]',
        typeSuffix: true,
    },
    MOV_ADDR_REG: {
        mnemonic: 'MOV',
        opcode: 0x14,
        args: [AssemblerType.Register, AssemblerType.Address],
        desc: 'Move value at address [address] to [register]',
        typeSuffix: true,
    },
    MOV_REG_ADDR: {
        mnemonic: 'MOV',
        opcode: 0x15,
        args: [AssemblerType.Address, AssemblerType.Register],
        desc: 'Move value in register [register] to [address]',
        typeSuffix: false,
    },
    //#endregion

    // #region Maths (0x3-)
    ADD_REG_REG: {
        mnemonic: 'ADD',
        opcode: 0x30,
        args: [AssemblerType.Register, AssemblerType.Register],
        desc: 'Store register1 + register2 in acc',
        typeSuffix: false,
    },
    ADD_REG_CONST: {
        mnemonic: 'ADD',
        opcode: 0x31,
        args: [AssemblerType.Register, AssemblerType.Constant],
        desc: 'Store register + constant in acc',
        typeSuffix: true,
    },
    SUB_REG_REG: {
        mnemonic: 'SUB',
        opcode: 0x32,
        args: [AssemblerType.Register, AssemblerType.Register],
        desc: 'Store register1 - register2 in acc',
        typeSuffix: false,
    },
    SUB_REG_CONST: {
        mnemonic: 'SUB',
        opcode: 0x33,
        args: [AssemblerType.Register, AssemblerType.Constant],
        desc: 'Store register - constant in acc',
        typeSuffix: true,
    },
    MUL_REG_REG: {
        mnemonic: 'MUL',
        opcode: 0x34,
        args: [AssemblerType.Register, AssemblerType.Register],
        desc: 'Store register1 * register2 in acc',
        typeSuffix: false,
    },
    MUL_REG_CONST: {
        mnemonic: 'MUL',
        opcode: 0x35,
        args: [AssemblerType.Register, AssemblerType.Constant],
        desc: 'Store register * constant in acc',
        typeSuffix: true,
    },
    DIV_REG_REG: {
        mnemonic: 'DIV',
        opcode: 0x36,
        args: [AssemblerType.Register, AssemblerType.Register],
        desc: 'Store register1 / register2 in acc',
        typeSuffix: false,
    },
    DIV_REG_CONST: {
        mnemonic: 'DIV',
        opcode: 0x37,
        args: [AssemblerType.Register, AssemblerType.Constant],
        desc: 'Store register1 / constant in acc',
        typeSuffix: true,
    },
    IDIV_REG_REG: {
        mnemonic: 'IDIV',
        opcode: 0x38,
        args: [AssemblerType.Register, AssemblerType.Register],
        desc: 'Store integer (register1 / register2) in acc',
        typeSuffix: false,
    },
    IDIV_REG_CONST: {
        mnemonic: 'IDIV',
        opcode: 0x39,
        args: [AssemblerType.Register, AssemblerType.Constant],
        desc: 'Store integer (register1 / constant) in acc',
        typeSuffix: true,
    },
    POW_REG_REG: {
        mnemonic: 'POW',
        opcode: 0x3A,
        args: [AssemblerType.Register, AssemblerType.Register],
        desc: 'Store pow(register1, register2) in acc',
        typeSuffix: false,
    },
    POW_REG_CONST: {
        mnemonic: 'POW',
        opcode: 0x3B,
        args: [AssemblerType.Register, AssemblerType.Constant],
        desc: 'Store pow(register, constant) in acc',
        typeSuffix: true,
    },
    SQRT_REG: {
        mnemonic: 'SQRT',
        opcode: 0x3C,
        args: [AssemblerType.Register],
        desc: 'Calculate square root of contents of [register]',
        typeSuffix: false,
    },
    SQRT_CONST: {
        mnemonic: 'SQRT',
        opcode: 0x3D,
        args: [AssemblerType.Constant],
        desc: 'Calculate square root of contents of [constant]',
        typeSuffix: true,
    },
    INC: {
        mnemonic: 'INC',
        opcode: 0x3E,
        args: [AssemblerType.Register],
        desc: 'Increment (+1) register [register]',
        typeSuffix: false,
    },
    DEC: {
        mnemonic: 'DEC',
        opcode: 0x3F,
        args: [AssemblerType.Register],
        desc: 'Decrement (-1) register [register]',
        typeSuffix: false,
    },
    // #endregion

    //#region Bitwise
    AND_REG_REG: {
        mnemonic: 'AND',
        opcode: 0x40,
        args: [AssemblerType.Register, AssemblerType.Register],
        desc: 'Bitwise and between two registers and move to acc',
        typeSuffix: false,
    },
    AND_REG_CONST: {
        mnemonic: 'AND',
        opcode: 0x41,
        args: [AssemblerType.Register, AssemblerType.Constant],
        desc: 'Bitwise and [register] and [constant] and move to acc',
        typeSuffix: true,
    },
    OR_REG_REG: {
        mnemonic: 'OR',
        opcode: 0x42,
        args: [AssemblerType.Register, AssemblerType.Register],
        desc: 'Bitwise or between two registers and move to acc',
        typeSuffix: false,
    },
    OR_REG_CONST: {
        mnemonic: 'OR',
        opcode: 0x43,
        args: [AssemblerType.Register, AssemblerType.Constant],
        desc: 'Bitwise or [register] and [constant] and move to acc',
        typeSuffix: true,
    },
    XOR_REG_REG: {
        mnemonic: 'XOR',
        opcode: 0x44,
        args: [AssemblerType.Register, AssemblerType.Register],
        desc: 'Bitwise xor between two registers and move to acc',
        typeSuffix: false,
    },
    XOR_REG_CONST: {
        mnemonic: 'XOR',
        opcode: 0x45,
        args: [AssemblerType.Register, AssemblerType.Constant],
        desc: 'Bitwise xor [register] and [constant] and move to acc',
        typeSuffix: true,
    },
    NOT: {
        mnemonic: 'NOT',
        opcode: 0x46,
        args: [AssemblerType.Register],
        desc: 'Bitwise not register [register] and move to acc',
        typeSuffix: false,
    },
    SHL_REG_REG: {
        mnemonic: 'SHL',
        opcode: 0x47,
        args: [AssemblerType.Register, AssemblerType.Register],
        desc: 'Left shift [register1] by [register2]',
        typeSuffix: false,
    },
    SHL_REG_CONST: {
        mnemonic: 'SHL',
        opcode: 0x48,
        args: [AssemblerType.Register, AssemblerType.Constant],
        desc: 'Left shift [register1] by [constant]',
        typeSuffix: true,
    },
    SHR_REG_REG: {
        mnemonic: 'SHR',
        opcode: 0x49,
        args: [AssemblerType.Register, AssemblerType.Register],
        desc: 'Right shift [register1] by [register2]',
        typeSuffix: false,
    },
    SHR_REG_CONST: {
        mnemonic: 'SHR',
        opcode: 0x4A,
        args: [AssemblerType.Register, AssemblerType.Constant],
        desc: 'Right shift [register1] by [constant]',
        typeSuffix: true,
    },
    //#endregion

    //#region Conditions
    CMP_REG_REG: {
        mnemonic: "CMP",
        opcode: 0x50,
        args: [AssemblerType.Register, AssemblerType.Register],
        desc: "Compare register [register1] to [register2]. Set flag in cmp register.",
        typeSuffix: true,
    },
    CMP_REG_CONST: {
        mnemonic: "CMP",
        opcode: 0x51,
        args: [AssemblerType.Register, AssemblerType.Constant],
        desc: "Compare register [register1] to [constant]. Set flag in cmp register.",
        typeSuffix: true,
    },
    JMP_CONST: {
        mnemonic: "JMP",
        opcode: 0x52,
        args: [AssemblerType.Constant],
        desc: "Set instruction pointer to constant [constant]",
        typeSuffix: true,
    },
    JMP_REG: {
        mnemonic: "JMP",
        opcode: 0x53,
        args: [AssemblerType.Register],
        desc: "Set instruction pointer to register [register]",
        typeSuffix: true,
    },
    JEQ_CONST: {
        mnemonic: "JEQ",
        opcode: 0x54,
        args: [AssemblerType.Constant],
        desc: "Set instruction pointer to constant [constant] if comparison is 'Equal To'",
        typeSuffix: true,
    },
    JEQ_REG: {
        mnemonic: "JEQ",
        opcode: 0x55,
        args: [AssemblerType.Register],
        desc: "Set instruction pointer to register [register] if comparison is 'Equal To'",
        typeSuffix: true,
    },
    JNE_CONST: {
        mnemonic: "JNE",
        opcode: 0x56,
        args: [AssemblerType.Constant],
        desc: "Set instruction pointer to constant [constant] if comparison is 'Not Equal To'",
        typeSuffix: true,
    },
    JNE_REG: {
        mnemonic: "JNE",
        opcode: 0x57,
        args: [AssemblerType.Register],
        desc: "Set instruction pointer to register [register] if comparison is 'Not Equal To'",
        typeSuffix: true,
    },
    JLT_REG: {
        mnemonic: "JLT",
        opcode: 0x58,
        args: [AssemblerType.Register],
        desc: "Set instruction pointer to register [register] if comparison is 'Less Than'",
        typeSuffix: true,
    },
    JLT_CONST: {
        mnemonic: "JLT",
        opcode: 0x59,
        args: [AssemblerType.Constant],
        desc: "Set instruction pointer to constant [constant] if comparison is 'Less Than'",
        typeSuffix: true,
    },
    JGT_REG: {
        mnemonic: "JGT",
        opcode: 0x5A,
        args: [AssemblerType.Register],
        desc: "Set instruction pointer to register [register] if comparison is 'Greater Than'",
        typeSuffix: true,
    },
    JGT_CONST: {
        mnemonic: "JGT",
        opcode: 0x5B,
        args: [AssemblerType.Constant],
        desc: "Set instruction pointer to constant [constant] if comparison is 'Greater Than'",
        typeSuffix: true,
    },
    //#endregion

    //#region Stack
    PUSH_CONST: {
        mnemonic: "PUSH",
        opcode: 0x60,
        args: [AssemblerType.Constant],
        desc: "Push [constant] to stack",
        typeSuffix: true,
    },
    PUSH_REG: {
        mnemonic: "PUSH",
        opcode: 0x61,
        args: [AssemblerType.Register],
        desc: "Push register [register] to stack",
        typeSuffix: true,
    },
    POP: {
        mnemonic: "POP",
        opcode: 0x62,
        args: [AssemblerType.Register],
        desc: "Pop value from stack and store in [register]",
        typeSuffix: true,
    },
    CALL_CONST: {
        mnemonic: "CALL",
        opcode: 0x63,
        args: [AssemblerType.Constant],
        desc: "Call subroutine at memory address [constant] (NB number of arguments MUST be pushed before CAL)",
        typeSuffix: true,
    },
    CALL_REG: {
        mnemonic: "CALL",
        opcode: 0x64,
        args: [AssemblerType.Register],
        desc: "Call subroutine at register [register] (NB number of arguments MUST be pushed before CAL)",
        typeSuffix: true,
    },
    RET: {
        mnemonic: "RET",
        opcode: 0x65,
        args: [],
        desc: "Return from subroutine (used after CAL)",
    },
    //#endregion

    BRK: {
        mnemonic: 'BRK',
        opcode: 0x7e,
        args: [],
        desc: 'Pause execution',
        typeSuffix: false,
    },
    HALT: {
        mnemonic: 'HLT',
        opcode: 0x7f,
        args: [],
        desc: 'Stop execution',
        typeSuffix: false,
    },
};