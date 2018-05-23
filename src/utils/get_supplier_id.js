
export function get_supplier_id (text, arr) {
  let id
  for ( var i=0; i<arr.length; i++ ) {
    if ( arr[i].gong_name === text ) {
      id = arr[i].id
    }
  }
   return id
}

export function get_driver_id (text, arr) {
  let id
  for ( var i=0; i<arr.length; i++ ) {
    if ( arr[i].driver_name === text ) {
      id = arr[i].id
    }
  }
  return id
}
/*
*  根据司机id取司机姓名
* */
export function get_driver_name (id, arr) {
  let name
  for ( var i=0; i<arr.length; i++ ) {
    if (arr[i].id === id ) {
      name = arr[i].driver_name
    }
  }
  return name
}
