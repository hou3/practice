declare namespace Vm {
    interface Staff{
        stf_id: number;
        stf_name: string;
        stf_category: number;
        stf_remark: string;
        stf_invalid: 0 | 1;
    }
    interface InitialData {
        list: Array<Staff>;
        total: number;
    }
    interface Category{
        dic_id: number;
        dic_name: string;
        dic_group_key: string;
        dic_group_name: string;
    }
}
declare namespace HttpPayLoad {
    interface GetStaff{
        stf_category: number;
        stf_name: string;
        begin?: number;
        pageSize?: number;
    }
    type StaffEdit = Vm.Staff
}