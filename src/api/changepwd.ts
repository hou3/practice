import http from '@/utils/http';

export default {
    // 用户自己修改密码
    changePwd: (data:HttpPayload.changePwd): Promise<null> => http<HttpPayload.changePwd>({url:"/user/pwdchange", method:"post", data})
}