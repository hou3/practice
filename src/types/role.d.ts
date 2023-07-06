declare namespace Vm{
    interface Role {
        role_id:number;
        role_name:string;
    }
}

declare namespace HttpPayload{
    interface Role {
        role_id:number;
        role_name:string;
    }
    interface RoleFunc {
        role_id:number;
        role_func_ids:string;
    }
}