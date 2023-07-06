declare namespace Vm {
    interface Func {
        func_id: number;
        func_name: string;
        func_key: string;
        func_fid: number;
    }
// 合并类型
    type FuncNode = Func & { children?: Array<FuncNode> }
}

declare namespace HttpPayload {
    interface Func {
        func_id: number;
        func_name: string;
        func_key: string;
        func_fid: number;
    }
}

