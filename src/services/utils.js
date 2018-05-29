
export async function socket(url) {
  return new Promise( (reslove,reject)=>{
    let socket = new WebSocket(url)
    socket.onopen = function (e) {
      reslove(socket)
    }
    socket.onerror = function (err) {
      reject(err)
    }
  } )
}
//  节流函数
export function throttle(func, wait, context) {
  context = context || this
  let args
  let previous = 0;

  return function() {
    var now = +new Date();
    // context = this;
    args = arguments;
    if (now - previous > wait) {
      func.apply(context, args);
      previous = now;
    }
  }
}
//  数字动画改变， 跳动函数
export function AnimateNumber(num,add=3) {
  return num + add
}

// 去抖函数
export function debouce(wait, func, ctx) {
  ctx = ctx || this
  let timeout
  let value
  return function (e) {
    clearTimeout(timeout)
    console.log(timeout)
    // console.log(e.target.value)
    value = e.target.value
    timeout = setTimeout( ()=>{
      func.call(this, value)
    }, wait )
  }
}
