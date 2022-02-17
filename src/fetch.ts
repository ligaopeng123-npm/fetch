/**********************************************************************
 *
 * @模块名称: fetch
 *
 * @模块用途: fetch 模块
 *
 * @date: 2021年8月9日09:56:46
 *
 * @版权所有: pgli
 *
 **********************************************************************/
import {CreateFetch, Fetch, MethodEnum, ResponseType} from "./typing";
import {isArray, isEmptyObject, isObject} from "@gaopeng123/utils.types";
import {urlJoinParmas} from "@gaopeng123/utils.file";
import errorCode from "./errorCode";

export const createFetch: CreateFetch = (url, options) => {
    // 配置默认的responseType
    const opt = Object.assign({responseType: 'json'}, options);
    /**
     * 处理post请求
     */
    if (options?.body && (isObject(options.body) || isArray(options.body))) {
        opt.body = JSON.stringify(options.body);
    }
    /**
     * 处理get请求
     */
    else if (options?.params && (isObject(options.params) || isArray(options.params))) {
        url += urlJoinParmas(options?.params);
    }

    /**
     * 覆盖headers 设置默认值
     * 如果是直接覆盖操作 此处影响其他组件对headers的操作
     * 因此 此处如果header配置的是 {} 空对象 此处不做其他处理
     */
    const headers = isEmptyObject(opt.headers) ? opt.headers : Object.assign({
        'Content-Type': 'application/json',
    }, opt.headers);

    return new Promise((resolve, reject) => {
            // "Content-Type", "text/plain"
            fetch(url, Object.assign({}, opt, {headers})).then((res: Response) => {
                if (res?.clone) {
                    const data: any = res.clone();
                    if (data.status >= 200 && data.status < 300) {
                        if (opt.noModification) {
                            resolve(res);
                        } else {
                            const responseType: ResponseType = opt.responseType || 'json';
                            // @ts-nocheck 动态检测responseType类型
                            resolve(data[responseType] ? data[responseType]() : res);
                        }
                    }
                    reject(errorCode(data.status));
                } else {
                    resolve(res);
                }
            }).catch((error: Error) => {
                console.error(`${url}请求出错，`, error);
                // 抛出报错信息 让模块接收到响应
                reject(`${url}请求出错，${error}`);
            });
        }
    )
};

export const get: Fetch = (url, options) => {
    return createFetch(url, Object.assign({method: MethodEnum.get}, options));
};

export const post: Fetch = (url, options) => {
    return createFetch(url, Object.assign({method: MethodEnum.post}, options));
};

export const put: Fetch = (url, options) => {
    return createFetch(url, Object.assign({method: MethodEnum.put}, options));
};

export const del: Fetch = (url, options) => {
    return createFetch(url, Object.assign({method: MethodEnum.del}, options));
};

export const patch: Fetch = (url, options) => {
    return createFetch(url, Object.assign({method: MethodEnum.patch}, options));
};

export default {
    get,
    post,
    put,
    del,
    patch,
}
