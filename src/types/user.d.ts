declare namespace Vm {
    interface User {
        user_name: string;
        user_pwd: string;
        role_id: number | null;
    }
    interface userData {
        list: Vm.user[];
        total: number;
    }
}
declare namespace HttpPayload {
    interface Login {
        user_name: string;
        user_pwd: string;
    }
    // 用户新增和重置密码
    type UserEdit = Login;
    // 用户分页查询
    interface UserSearch {
        user_name: string;
        role_id: number;
        begin: number;
        pageSize: number;
    }
    // 用户角色分配
    interface UserRole {
        user_name: string;
        role_id: number;
    }
}

