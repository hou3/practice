import http from "@/utils/http";

export default {
    login: (data: HttpPayload.Login): Promise<string> => http<HttpPayload.Login, string>({
        url: "/user/login",
        method: "post",
        data
    }),
    getCategory: ():Promise<Array<Vm.Category>> => http<null,Array<Vm.Category>>({url:"dictionary/all"}),
    getMenu: (): Promise<Array<Vm.Func>> => http<null, Array<Vm.Func>>({
        url: "/user/getmenu",
        method: "post"
    }),
    getList: (data: HttpPayload.UserSearch): Promise<{ total: number; list: Array<Vm.User> }> => http<HttpPayload.UserSearch, { total: number; list: Array<Vm.User> }>({
        url: "/user/list",
        method: "post",
        data
    }),
    resetPwd: (data: HttpPayload.UserEdit): Promise<null> => http<HttpPayload.UserEdit>({
        url: "/user/change_pwd",
        method: "post",
        data
    }),
    remove: (user_name: string): Promise<null> => http({
        url: "/user/remove/" + user_name,
        method: "post"
    }),
    add: (data: HttpPayload.UserEdit): Promise<null> => http<HttpPayload.UserEdit>({
        url: "/user/add",
        method: "post",
        data
    }),
    validName: (data: { user_name: string }): Promise<0 | 1> => http<{ user_name: string }, 0 | 1>({
        url: "/user/valid_name",
        method: "post",
        data
    }),
    roleConfig:(data:HttpPayload.UserRole):Promise<null>=>http<HttpPayload.UserRole>({
        url:"/user/config_role",
        method:"post",
        data
    })
}