declare namespace Vm {
    interface ClassRoom {
        clsr_id: number;
        clsr_name: string;
        clsr_occupy?: 0 | 1;
    }
}
declare namespace HttpPayload {
    interface GetClassRoom {
        clsr_id: number;
        clsr_name: string;
        clsr_occupy?: 0 | 1;
    }
}