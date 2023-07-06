import http from '@/utils/http';

export default {
    // 根据员工的类别获取员工
    getMath: (id: number): Promise<Array<HttpPayLoad.Teacher>> => http<number, Array<HttpPayLoad.Teacher>>({url: '/staff/listbycategory/' + id})
}