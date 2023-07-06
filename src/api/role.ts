import http from '@/utils/http';

//api里的方法发ajax
export default {
    getAll:():Promise<Array<Vm.Role>> => http<null,Array<Vm.Role>>({url:"/role/all"}),
    add:(data:HttpPayload.Role): Promise<number> => http<HttpPayload.Role,number>({url:"/role/add", method:"post",data}),
    update: (data: HttpPayload.Role): Promise<null> => http<HttpPayload.Role, null>({ url: "/role/update", method: "post", data }),
    remove: (id: number): Promise<null> => http({ url: "/role/remove/" + id, method: "post" }),
    roleFuncConfig:(data:HttpPayload.RoleFunc): Promise<null> => http({url:"/role_function/config", method:"post", data}),
    getRoleFuncs:(role_id: number) : Promise<Array<Vm.Func>> => http<null, Array<Vm.Func>>({url:"/role_function/list/" + role_id})
}