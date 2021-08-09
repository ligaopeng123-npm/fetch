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
import {isArray, isObject, urlJoinParmas} from "@gaopeng123/utils";
import ErrorCode from "./ErrorCode";

const cetateFetch: CreateFetch = (url, option) => {
	const opt = Object.assign({}, option);
	/**
	 * 处理post请求
	 */
	if (option?.body && (isObject(option.body) || isArray(option.body))) {
		opt.body = JSON.stringify(option.body);
	}
	/**
	 * 处理get请求
	 */
	else if (option?.params && (isObject(option.params) || isArray(option.params))) {
		url += urlJoinParmas(option?.params);
	}
	return new Promise((resolve, reject) => {
			// "Content-Type", "text/plain"
			fetch(url, Object.assign({
				headers: {
					'Content-Type': 'application/json',
				},
			}, opt)).then((res: Response) => {
				if (res?.clone) {
					const data: any = res.clone();
					if (data.status >= 200 && data.status < 300) {
						const responseType: ResponseType = opt.responseType || 'json';
						// @ts-nocheck 动态检测responseType类型
						resolve(data[responseType] ? data[responseType]() : res);
					}
					reject(ErrorCode(data.status));
				} else {
					resolve(res);
				}
			}).catch((error: Error) => {
				console.error(`${url}请求出错，`, error)
			});
		}
	)
};

export const get: Fetch = (url, option) => {
	return cetateFetch(url, Object.assign({method: MethodEnum.get}, option));
};

export const post: Fetch = (url, option) => {
	return cetateFetch(url, Object.assign({method: MethodEnum.post}, option));
};

export const put: Fetch = (url, option) => {
	return cetateFetch(url, Object.assign({method: MethodEnum.put}, option));
};

export const del: Fetch = (url, option) => {
	return cetateFetch(url, Object.assign({method: MethodEnum.del}, option));
};

export default {
	get,
	post,
	put,
	del,
}
