import {get} from '../src';

describe('blah', () => {
	it('works', () => {
		get('https://baidu.com', {body: {name: 1}}).then((res: any)=> {
			console.log(res)
		});
		expect(get('https://baidu.com', {body: {name: 1}})).toEqual(2);
	});
});
