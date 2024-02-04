import {get, register} from '../packages/fetch/src';

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
		return get('https://api.apishop.net/common/postcode/getPostCodeByAddr', {responseType: 'text'}).then((res: any) => {
			console.log(res)
		});
	});
});
