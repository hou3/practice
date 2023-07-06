declare namespace HttpPayLoad { //发ajax
    interface Teacher{
        stf_id: number;
        stf_name: string;
        stf_category: number;
        stf_remark: string;
        stf_invalid: 0 | 1;
    }
}