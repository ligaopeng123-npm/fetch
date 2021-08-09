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
import {FetchInterceptorResponse} from "fetch-intercept";

export type ResponseType = 'text' | 'json' | 'blob' | 'formData' | 'arrayBuffer';

export type Option = {
	body?: any; // post请求 参数放在body上
	params?: any; // get请求 参数拼接在url上
	responseType?: 'text' | 'json' | 'blob' | 'formData' | 'arrayBuffer';
}

export type Method = 'GET' | 'POST' | 'PUT' | 'DELETE';

export enum MethodEnum {
	get = 'GET',
	post = 'POST',
	put = 'PUT',
	del = 'DELETE',
}

export type OptionBase = {
	method: Method,
	[propName: string]: any;
} & Option;

export type Fetch = (url: string, option?: Option) => Promise<any>;

export type CreateFetch = (url: string, option: OptionBase) => Promise<any>;

export interface Intercept {
	request?(url: string, config: any): Promise<any[]> | any[];
	
	requestError?(error: any): Promise<any>;
	
	response?(response: FetchInterceptorResponse): Promise<any> | FetchInterceptorResponse;
	
	responseError?(error: any): Promise<any>;
}

export type Unregister = () => void;
