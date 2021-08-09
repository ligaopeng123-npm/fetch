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
import fetchIntercept from "fetch-intercept";
import {Intercept, Unregister} from "./typing";

const register = (intercept: Intercept): Unregister => {
	// @ts-ignore
	return fetchIntercept.register(intercept);
};

export default register
