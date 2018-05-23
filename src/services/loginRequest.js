import fetch from 'dva/fetch'

// 需要登录过后才能执行的请求， 用这个封装的函数， 做一次过滤
export default function logRequest(url, options) {
  const defaultOptions = {
    credentials: 'include',
  };
  const newOptions = { ...defaultOptions, ...options };
  if (newOptions.method === 'POST' || newOptions.method === 'PUT') {
    newOptions.headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json; charset=utf-8',
      ...newOptions.headers,
    };
    newOptions.body = JSON.stringify(newOptions.body);
  }

  fetch(url, newOptions)
    .then(checkStatus)
    .then((response) => {
      return response.json();
    })
    .then( res => {
      console.log(res)
    } )

}
