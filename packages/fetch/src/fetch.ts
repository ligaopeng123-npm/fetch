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
import { CreateFetch, DownloadFile, Fetch, MethodEnum, ResponseType } from "./typing";
import { isArray, isEmptyObject, isObject, isFormData, isEmpty } from "@gaopeng123/utils.types";
import { download, urlJoinParmas } from "@gaopeng123/utils.file";
import { errorCode, isAbortError } from "./errorCode";
import { __fetch__ } from "./intercept";

/**
 * 创建fetch函数
 * @param url
 * @param options
 */
export const createFetch: CreateFetch = (url, options) => {
    // 配置默认的responseType
    const opt = Object.assign({ responseType: 'json' }, options);
    /**
     * 控制器
     */
    if (opt.abortController && opt.abortController.signal) {
        opt.signal = opt.abortController.signal;
        delete opt.abortController;
    }
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
        // 支持重试
        let { times, delay } = Object.assign({ times: 0, delay: 0 }, opt.retry);
        const fetchLoop = () => {
            const fetchHandleError = (error: string | Error) => {
                // 如果是AbortError 则不再抛出
                if (isAbortError(<Error>error)) {
                    console.error(error);
                } else {
                    if (times) {
                        times--;
                        setTimeout(fetchLoop, delay);
                    } else {
                        console.error(`${url}请求出错，`, error);
                        // 抛出报错信息 让模块接收到响应
                        reject(error);
                    }
                }
            }
            // "Content-Type", "text/plain"
            __fetch__(url, Object.assign({}, opt, { headers })).then((res: Response) => {
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
                    } else {
                        fetchHandleError(errorCode(data.status))
                    }
                } else {
                    if (res !== undefined) {
                        resolve(res);
                    }
                }
            }).catch(fetchHandleError);
        }
        fetchLoop();
    });
};

export const get: Fetch = (url, options) => {
    return createFetch(url, Object.assign({ method: MethodEnum.get }, options));
};

export const post: Fetch = (url, options) => {
    return createFetch(url, Object.assign({ method: MethodEnum.post }, options));
};

export const put: Fetch = (url, options) => {
    return createFetch(url, Object.assign({ method: MethodEnum.put }, options));
};

export const del: Fetch = (url, options) => {
    return createFetch(url, Object.assign({ method: MethodEnum.del }, options));
};

export const patch: Fetch = (url, options) => {
    return createFetch(url, Object.assign({ method: MethodEnum.patch }, options));
};
/**
 * 文件下载
 * @param url
 * @param options
 */
export const downLoadFile: DownloadFile = (url, options) => {
    return new Promise((resolve, reject) => {
        createFetch(url, Object.assign({
            method: MethodEnum.post,
            noModification: true,
            responseType: 'blob'
        }, options))
            .then((res) => {
                if (res.headers.get('content-type') === 'application/json') {
                    res.clone().json().then((data: any) => {
                        resolve(data);
                    });
                } else {
                    res.clone().blob().then((blob: Blob) => {
                        const fileName = res?.headers?.get('content-disposition')?.replace('attachment;filename=', '');
                        download({ blob: blob, fileName: options.fileName || (fileName ? decodeURI(fileName) : '') });
                        resolve({
                            progress: 'start download'
                        });
                    });
                }
            })
            .catch((err) => {
                reject(err)
            });
    })
};

/**
 * 表单数据处理
 * @param url
 * @param options
 */
export const createFormFetch: Fetch = (url, options) => {
    if (options && options.body && !isFormData(options.body) && !isEmptyObject(options.body)) {
        const formData = new FormData();
        for (const key in options.body) {
            formData.append(key, isEmpty(options.body[key]) ? '' : options.body[key])
        }
        options.body = formData;
    }
    return createFetch(url, Object.assign({ method: MethodEnum.post, headers: {} }, options));
}

/**
 * 表单上传
 * @param url
 * @param options
 */
export const uploadFormData: Fetch = (url, options) => {
    return createFormFetch(url, Object.assign({ method: MethodEnum.post, headers: {} }, options));
}

/**
 * 表单数据下发
 */
export const postFormData = uploadFormData;