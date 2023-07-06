// 我要怎么写，才能保证首先最基本是正确的 60
// 我要怎么写，才能让api里面的文件用起来舒服一些 80
// 我要怎么写，才能让api里面的代码写出来更具有可读性，就像一篇文章一样 100(加泛型)
import axios, {AxiosRequestConfig, AxiosResponse} from 'axios';

// 带默认值的泛型类型
interface HttpResult<T = null> {
    status: 200 | 199 | 401 | 404 | 500;
    data: T;
    message: string;
}
// T表示本次axios时data要携带传递的数据的"类型"，没有就是null, 这样TS会自动帮我们去查传递得对不对
// R表示本次axios服务器返回的数据的类型，没有返回就是null
function http<T = null, R = null>(options: AxiosRequestConfig<T>): Promise<R> {
    const defaultHeaders = {Authorization: sessionStorage.getItem("token")};
    options.headers = Object.assign({}, defaultHeaders, options.headers || {});
    return axios(options)
        // 第一个then的response是axios返回的请求结果
        .then((response: AxiosResponse<HttpResult<R>>) => {
            const {status, data, statusText} = response;
            if(status === 200) return data;
            else throw new Error(statusText);
        })
        // 第二个then的response是后台java写得服务器返回的结果
        .then((response: HttpResult<R>) => {
            // 你怎么知道这里的resopnse有code, data, msg属性呢？
            const {status, data, message} = response;
            switch(status) {
                case 200: return data;
                case 199:
                case 404:
                case 401:
                case 500:
                    throw new Error(message);
                default:
                    let a: never = status;
                    throw new Error('Can not reach here..')
            }
        })
        .catch(e => {
            console.log(e.message);
            throw e;
        });

}

export default http;