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
import {Intercept, Unregister} from "./typing";

let interceptors: Array<Intercept> = [];

function interceptor(fetch: any, ...args: any[]) {
	// @ts-ignore
	const reversedInterceptors: Array<Intercept> = interceptors.reduce((array, interceptor) => [interceptor].concat(array), []);
	let promise = Promise.resolve(args);
	
	// Register request interceptors
	reversedInterceptors.forEach(({request, requestError}) => {
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
			return fetch(request).then((response: any) => {
				response.request = request;
				// 绑定options参数
				response.request.options = args[1];
				return response;
			}).catch((error: any) => {
				error.request = request;
				return Promise.reject(error);
			});
		} else {
			console.error('The response function requires a return value')
		}
	});
	
	// Register response interceptors
	reversedInterceptors.forEach(({response, responseError}) => {
		if (response || responseError) {
			// @ts-ignore
			promise = promise.then(response, responseError);
		}
	});
	
	return promise;
}


const attach = (env: any) => {
	// Make sure fetch is available in the given environment
	if (!env.fetch) {
		try {
			require('node-fetch');
		} catch (err) {
			throw Error('No fetch available. Unable to register fetch-intercept');
		}
	}
	env.fetch = (function (fetch) {
		return function (...args: any[]) {
			return interceptor(fetch, ...args);
		};
	})(env.fetch);
	
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

const fetchIntercept = attach(ENVIRONMENT_IS_WORKER ? self : window);

const register = (intercept: Intercept): Unregister => {
	// @ts-ignore
	return fetchIntercept.register(intercept);
};

export default register
