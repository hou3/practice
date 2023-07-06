import http from "@/utils/http";

export default {
    getAll: (): Promise<Array<Vm.ClassRoom>> => http<null, Array<Vm.ClassRoom>>({ url: "/classroom/all" }),
    remove: (clsr_id: number): Promise<null> => http({ url: "/classroom/remove/"+clsr_id, method: "get" }),
    add: (data: HttpPayload.GetClassRoom): Promise<number> => http<HttpPayload.GetClassRoom, number>({ url: "/classroom/add", method: "post", data }),
    update: (data: HttpPayload.GetClassRoom): Promise<null> => http<HttpPayload.GetClassRoom,null>({ url: "/classroom/update", method: "post", data })
}