import http from "@/utils/http";

export default {
    avatarUpdate: (data: HttpPayload.StudentAvatarUpdate): Promise<string> => http<HttpPayload.StudentAvatarUpdate, string>({url: "/student/avatarupdate",method: "post", data}),
    getList: (data: HttpPayload.GetStudent): Promise<Vm.StudentData> => http<HttpPayload.GetStudent, Vm.StudentData>({ url: "/student/list", method: "post", data }),
    add: (data: Vm.Student): Promise<number> => http<Vm.Student, number>({ url: "/student/add", method: "post", data }),
    update: (data: Vm.Student): Promise<null> => http<Vm.Student, null>({ url: "/student/update", method: "post", data }),
    assignclass:(data:HttpPayload.StudentAssignclass): Promise<null> => http<HttpPayload.StudentAssignclass,null>({url:"/student/assignclass",method:"post",data})
};