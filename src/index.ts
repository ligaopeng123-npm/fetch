// 增删改查
export { createFetch, get, post, put, del, patch } from './fetch';
export { uploadFormData, downLoadFile, postFormData, createFormFetch } from './fetch';
// 拦截器配置
export { register } from './intercept';
export { Intercept, FetchInterceptorResponse, MethodEnum, Options, Options as Option } from './typing';
export { errorCode, isAbortError } from './errorCode';
