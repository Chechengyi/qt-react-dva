
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

export async function promise_( action, payload ) {
  return new Promise( (reslove, reject)=>{
    action({...payload})
      .then( res=>{
        reslove(res)
      } )
      .catch( err=>{
        reject({
          status:'ERROR'
        })
      } )
  } )
}

//  节流函数
export function throttle(func, wait, context) {
  context = context || this
  let args
  let previous = 0;
  return function() {
    var now = +new Date();
    args = arguments;
    if (now - previous > wait) {
      func.apply(context, args);
      previous = now;
    }
  }
}

// 节流函数2
export function throttle2(func, wait) {
  let args
  let previous = 0;
  return function(e) {
    var now = +new Date();
    args = arguments;
    if (now - previous > wait) {
      func.apply(this, e);
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
    value = e.target.value
    timeout = setTimeout( ()=>{
      func.call(this, value)
    }, wait )
  }
}

// 去抖函数2
export function debouce2( wait, func, ctx ) {
  ctx = ctx || this
  let timeout
  let value
  return function (e) {
    clearTimeout(timeout)
    timeout = setTimeout( ()=>{
      func.call(this, e)
    }, wait )
  }
}

// 判断对象是否为空对象
export function objIsNull(){
  return Object.keys(this).length===0
}
