import http from '@/utils/http';

export default {
    // 查询所有班级信息（主要是学生管理页面要用）
    getAll: (): Promise<Array<Vm.Class>> => http<null, Array<Vm.Class>>({ url: "/class/all" }),
    // 分页查询班级信息
    getList: (data: HttpPayload.GetClass): Promise<Vm.ClassData> => http<HttpPayload.GetClass, Vm.ClassData>({ url: "/class/list", method: "post", data }),
    // 新增班级
    add: (data: Vm.Class): Promise<number> => http<Vm.Class, number>({ url: "/class/add", method: "post", data }),
    // 修改班级
    update: (data: Vm.Class): Promise<null> => http<Vm.Class, null>({ url: "/class/update", method: "post", data }),
    // 结课*开课
    end: (data: { cls_id: number }): Promise<number> => http<{ cls_id: number }, number>({ url: '/class/end', method: "post", data }),
    start: (data: HttpPayload.ClassStart): Promise<number> => http<HttpPayload.ClassStart, number>({ url: '/class/begin', method: "post", data })
}