// 增删改查
export {get as get} from './fetch';
export {post as post} from './fetch';
export {put as put} from './fetch';
export {del as del} from './fetch';
// 拦截器配置
export {default as register} from './intercept';
export type {Intercept as Intercept} from './typing';
export type {Option as Option} from './typing';
