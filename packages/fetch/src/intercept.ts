/**********************************************************************
 *
 * @模块名称: Intercept
 *
 * @模块用途: Intercept 拦截器
 *
 * @date: 2021/7/26 8:26
 *
 * @版权所有: pgli
 *
 **********************************************************************/
import { Intercept, Unregister } from "./typing";
import { isAbortError } from "./errorCode";

let interceptors: Array<Intercept> = [];
/**
 * 重新覆盖fetch 防止影响其他使用fetch的模块 特别是webpack5的热更新
 */
export let __fetch__: any = null;

export function interceptor(_fetch_: any, ...args: any[]) {
    // @ts-ignore
    const reversedInterceptors: Array<Intercept> = interceptors.reduce((array, interceptor) => [interceptor].concat(array), []);
    let promise = Promise.resolve(args);

    // Register request interceptors
    reversedInterceptors.forEach(({ request, requestError }) => {
        if (request || requestError) {
            // @ts-ignore
            promise = promise.then(args => request(...args), requestError);
        }
    });

    // Register fetch call
    promise = promise.then((args: any[]) => {
        if (args) {
            // @ts-ignore
            const request = new Request(...args);

            return _fetch_(request).then((response: any) => {
                response.request = request;
                // 绑定options参数
                response.request.options = args[1];
                return response;
                // @ts-ignore
            }).catch((error: any) => {
                error.request = request;
                return Promise.reject(error);
            });
        } else {
            console.error('The response function requires a return value')
        }
    })

    // Register response interceptors
    reversedInterceptors.forEach(({ response, responseError }) => {
        if (response || responseError) {
            // @ts-ignore
            promise = promise.then(response, (error) => {
                if (!isAbortError(error)) {
                    if (responseError) {
                        return responseError(error);
                    }
                }
            });
        }
    });

    return promise;
}


const attach = (_fetch: any) => {
    // Make sure fetch is available in the given environment
    if (!_fetch) {
        try {
            // @ts-ignore
            require('node-fetch');
        } catch (err) {
            throw Error('No fetch available. Unable to register fetch-intercept');
        }
    }
    __fetch__ = (function (__fetch) {
        return function (...args: any[]) {
            return interceptor(__fetch, ...args);
        };
    })(_fetch);

    return {
        register: function (interceptor: Intercept) {
            interceptors.push(interceptor);
            return () => {
                const index = interceptors.indexOf(interceptor);
                if (index >= 0) {
                    interceptors.splice(index, 1);
                }
            };
        },
        clear: function () {
            interceptors = [];
        }
    };
};

// @ts-ignore
const ENVIRONMENT_IS_WORKER = typeof importScripts === 'function';

// 兼容node环境
const getAttachProps = () => {
    if (ENVIRONMENT_IS_WORKER) {
        __fetch__ = self.fetch;
    } else {
        // 兼容nextjs
        __fetch__ = fetch;
    }
    return __fetch__;
}

const fetchIntercept = attach(getAttachProps());
// 后续此处定义其他属性 例如可定义下发接口时长监听等
export const register = (intercept: Intercept): Unregister => {
    // @ts-ignore
    return fetchIntercept.register(intercept);
};