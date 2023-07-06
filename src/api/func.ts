import http from "@/utils/http";

export default {
    getAll: (): Promise<Array<Vm.Func>> => http<null, Array<Vm.Func>>({ url: "/function/all" }),
    remove: (func_id: number): Promise<null> => http({ url: "/function/remove/" + func_id, method: "post" }),
    add: (data: HttpPayload.Func): Promise<number> => http<HttpPayload.Func, number>({ url: "/function/add", method: "post", data }),
    updata: (data: HttpPayload.Func): Promise<null> => http<HttpPayload.Func>({ url: "/function/updata", method: "post", data })
}