declare namespace HttpPayload {  //发ajax
    interface GetStudent {
        // stu_id: number;
        stu_name: String;
        stu_cls_id: number | null;
        stu_qualification: number;
        begin?: number;
        pageSize?: number;
    }
    interface StudentAvatarUpdate {
        stu_id: number;
        stu_avatar_old: string | null;
        stu_avatar_new: string | null;
    }
    interface StudentEdit {
        stu_id: number;
        stu_name: string;
        stu_cls_id: number | null;
        stu_sex: 0 | 1;
        stu_phone: '';
        stu_phone2: ''; 
        stu_born: string;
        stu_qualification: number; 
        stu_school: string;
        stu_major: string; 
        stu_address: string;
        stu_remark: string;  
        stu_avatar: string;
    }
    interface StudentAssignclass {  //批量分班
        stu_id: number | null;
        stu_ids: Array<number>;
        stu_cls_id: number;
    }
}

declare namespace Vm {  //展示的数据
    interface Student{
        stu_id: number;
        stu_name: string;
        stu_avatar: string | null;
        stu_cls_id: number | null;
        stu_sex: 0 | 1;
        stu_phone: '';
        stu_phone2: ''; 
        stu_born: string;
        stu_qualification: number; //0 | 1 | 2 | 3
        stu_school: string;
        stu_major: string; 
        stu_address: string;
        stu_remark: string;  
        stu_avatar: string;
    }
    interface StudentData {
        list: Array<Vm.Student>;
        total: number;
    }
}