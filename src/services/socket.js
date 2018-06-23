

export async function openSocket (url) {
  return new Promise( (reslove, reject)=>{
    let websocket = new WebSocket(url)
    websocket.onopen = function (e) {
      console.log('websocket连接成功')
      reslove(websocket)
    }
    websocket.onerror = function (err) {
      console.log('websocket连接失败')
      reject(err)
    }
  } )
}

