/**********************************************************************
 *
 * @模块名称: typing
 *
 * @模块用途: typing
 *
 * @date: 2021/8/9 10:06
 *
 * @版权所有: pgli
 *
 **********************************************************************/

export type ResponseType = 'text' | 'json' | 'blob' | 'formData' | 'arrayBuffer';

export type Options = {
    body?: any; // post请求 参数放在body上
    params?: any; // get请求 参数拼接在url上
    responseType?: 'text' | 'json' | 'blob' | 'formData' | 'arrayBuffer';
    noModification?: boolean, // 是否要根据responseType做数据获取
    abortController?: AbortController, // 控制fetch abort
    headers?: {
        token?: string;
        [propName: string]: any;
    };
}

export type ResponseOptions = {
    options: Options
}

export interface FetchInterceptorResponse extends Response {
    request: Request & ResponseOptions;
}

export type Method = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

// 请求类型映射
export enum MethodEnum {
    get = 'GET',
    post = 'POST',
    put = 'PUT',
    del = 'DELETE',
    patch = 'PATCH',
}


export type OptionAbort = {
    abortController?: AbortController;
    signal?: AbortSignal;
}

export type OptionBase = {
    method: Method;
} & Options & OptionAbort;

export type Fetch = (url: string, options?: Options) => Promise<any>;

export type CreateFetch = (url: string, options: OptionBase) => Promise<any>;

export type DownloadFile = (url: string, options: { fileName?: string, method?: Method } & Options & OptionAbort) => Promise<{ progress: string }> | any;

export interface Intercept {
    request?(url: string, config: any): Promise<any[]> | any[];

    requestError?(error: any): Promise<any>;

    response?(response: FetchInterceptorResponse): Promise<any> | FetchInterceptorResponse;

    responseError?(error: any): Promise<any>;
}

export type Unregister = () => void;
