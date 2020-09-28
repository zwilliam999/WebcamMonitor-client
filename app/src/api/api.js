import axios from 'axios';
import qs from 'qs';

export class Api {
    constructor(ctx) {
        this.ctx = ctx;
        if (process.env.NODE_ENV === 'development') {
            this.baseUrl = "http://192.168.1.100:8002";
        } else if (process.env.NODE_ENV === 'production') {
            this.baseUrl = "http://192.168.1.100:8002";
        }
        this.axiosInstance = axios.create({
            baseURL: this.baseUrl,
            //timeout: 5 * 60 * 60 * 1000,//默认5小时
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        });
        this.axiosInstance.interceptors.response.use((response) => {
            // 对响应数据做点什么
            if (response.data.status === 200) {
                return response;
            } else if (response.data.status === 401) {
                this.ctx.tip({
                    msg: response.data.message,
                    duration: 2000,
                    type: "warning"
                });
                return Promise.reject(response);
            } else if (response.data.status === 500) {
                this.ctx.tip({
                    msg: response.data.message,
                    duration: 2000,
                    type: "warning"
                });
                return Promise.reject(response);
            } else if (response.data.status === 502) {
                this.ctx.tip({
                    msg: response.data.message,
                    duration: 2000,
                    type: "warning"
                });
                return Promise.reject(response);
            } else {
                this.ctx.tip({
                    msg: response.data.message,
                    duration: 2000,
                    type: "warning"
                });
                return Promise.reject(response);
            }
        }, (error) => {
            this.ctx.tip({
                msg: error.message,
                duration: 2000,
                type: "warning"
            });
            return Promise.reject(error);
        });
    }


    /**
     * 单例模式
     * ctx为传入的 vue-->this
     * @param ctx
     * @returns {Api}
     */
    static getInstance(ctx) {
        return Api.instance ? Api.instance : Api.instance = new Api(ctx);
    }

    refreshToken() {
        let token = localStorage.getItem("token");
        this.axiosInstance.defaults.headers.token = token ? token : "";
    }

    /**
     * 查询列表
     * @param params
     * @returns {Promise<AxiosResponse<T>>}
     */
    webcamList(params) {
        return this.axiosInstance.get("/v1/webcam/list", {params: params})
    }

    /**
     * add webcam
     * @param params
     */
    webcamAdd(params) {
        return this.axiosInstance.post("/v1/webcam/add", qs.stringify(params))
    }

    /**
     * shot start
     * @param params
     * @returns {Promise<AxiosResponse<T>>}
     */
    shotStart(params) {
        return this.axiosInstance.get("/v1/webcam/shot/start", {params: params})
    }
}



