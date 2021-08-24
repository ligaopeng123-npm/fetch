import {post, register} from '../src';

const Intercept: any = {
	request(url: string, config: any) {
		console.log(url, config)
	},
	
	requestError(error: any) {
		console.log(error)
	},
	
	response(response: any) {
		console.log(response)
	},
	
	responseError(error: any) {
		console.log(error)
	},
}

describe('blah', () => {
	it('works', () => {
		register(Intercept);
		return post('http://data.cma.cn/kbweb/home/live').then((res: any) => {
			console.log(res)
		});
	});
});
