### Option

```typescript
body?: any; // post请求 参数放在body上
params?: any; // get请求 参数拼接在url上
responseType?: 'text' | 'json' | 'blob' | 'formData' | 'arrayBuffer';
```

### function

#### get

```typescript
get(url:string, option: Option):Promise<any>;
```

#### post

```typescript
post(url:string, option: Option):Promise<any>;
```

#### put

```typescript
put(url:string, option: Option):Promise<any>;
```

#### del

```typescript
put(url:string, option: Option):Promise<any>;
```

#### register

```typescript
(intercept: Intercept): Unregister;
// unregisterFetch 卸载拦截器
export const unregisterFetch = register(Intercept);
```

##### Intercept

```typescript
request?(url: string, config: any): Promise<any[]> | any[];
requestError?(error: any): Promise<any>;
response?(response: FetchInterceptorResponse): FetchInterceptorResponse;
responseError?(error: any): Promise<any>;
```

```typescript
const Intercept: any = {
	request: function (url: string, config: Option) {
		// Modify the url or config here
		console.log('request', config)
		// config.headers.token = 'tttt';
		return [url, config];
	},
	
	requestError: function (error: Error) {
		console.log('requestError');
		return Promise.reject(error);
	},
	
	response: async function (response: Response) {
		// Modify the reponse object
        // resolve(response);
        // or
		return new Promise((resolve, reject) => {
			resolve(response);
		});
	},
	
	responseError: function (error: Error) {
		// Handle an fetch error
		console.log('responseError');
		return Promise.reject(error);
	}
};
```

