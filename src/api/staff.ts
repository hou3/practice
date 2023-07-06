import http from '@/utils/http';

export default {
    getList:(data: HttpPayLoad.GetStaff): Promise<Vm.InitialData> => http<HttpPayLoad.GetStaff,Vm.InitialData>({url:"/Staff/list",method:"post",data}),
    update:(data: Vm.Staff): Promise<null> => http<Vm.Staff,null>({url:"/Staff/update",method:"post",data}),
    add:(data:Vm.Staff): Promise<number> => http<Vm.Staff,number>({url:"/Staff/add",method:"post",data}),
    dimission:(id:number) => http({url:"/Staff/dimission/" + id}),
    reinstate:(id:number) => http({url:"/Staff/reinstate/" + id}),
    listbycategory:(category:number): Promise<Array<Vm.Staff>> => http<null,Array<Vm.Staff>>({url:"/Staff/listbycategory" + category})
}