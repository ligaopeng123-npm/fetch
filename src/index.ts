// 增删改查
export {createFetch as createFetch} from './fetch';
export {get as get} from './fetch';
export {post as post} from './fetch';
export {put as put} from './fetch';
export {del as del} from './fetch';
export {patch as patch} from './fetch';
export {uploadFormData, downLoadFile} from './fetch';
// 拦截器配置
export {default as register} from './intercept';
export {Intercept as Intercept} from './typing';
export {FetchInterceptorResponse as FetchInterceptorResponse} from './typing';
export {Options as Options} from './typing';
export {Options as Option} from './typing';
export {MethodEnum as MethodEnum} from './typing';
export {default as errorCode, isAbortError} from './errorCode';
