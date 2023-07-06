declare namespace Vm {
    interface Class {
        cls_id: number;
        cls_name: string;
        cls_dic_id_major: number;
        // cls_clsr_id: number;
        cls_stf_id_teacher: number;
        cls_stf_id_admin: number;
        cls_stf_id_job: number;
        cls_begin: number;
        cls_end: number;
        cls_remark: string;
        cls_status: number;
    }
    interface ClassData {
        list: Array<Class>;
        total: number;
    }

}
declare namespace HttpPayload {
    interface GetClass {
        cls_name: string;
        cls_dic_id_major: number;
        cls_status: 0 | 1 | 2 | 3;
        begin?: number;
        pageSize?: number;
    }
    type ClassEdit = Vm.Class;
}
declare namespace HttpPayload{
    interface ClassStart {
        cls_id: number;
        cls_clsr_id: number | null ;
    }
}