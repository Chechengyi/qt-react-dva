import { cusGetAllProvince, cusGetCity,
  cusGetDistrict, cusGetStreet } from '../services/api'
import clonedeep from 'lodash.clonedeep'

let code

export default {
  namespace: 'pickerAddress',
  state: {
    provinceData: [],
    value: ['520000']
  },
  effects: {
    *setProvinceData( {payload}, {call, put} ){
      console.log('获取省级列表')
      const res = yield call( cusGetAllProvince )
      yield put({
        type: 'saveProvinceData',
        payload: res.data
      })
    },
    *setCityData( {payload}, {call, put} ){
      console.log('获取市级列表')
      code = payload.split(',')[0]
      const res = yield call( cusGetCity, {code} )
      if (res.data) {
        yield put({
          type: 'saveCityData',
          payload: {
            value: payload,
            data: res.data
          }
        })
      } else {
        yield put({
          type: 'saveCityData',
          payload: {
            value: payload,
            data: []
          }
        })
      }
    },
    *setDistrictData( {payload}, {call, put} ){
      console.log('获取区县列表')
      // 取出选中的市的code
      let code  = payload[1].split(',')[0]
      const res = yield call( cusGetDistrict, {code} )
      yield put({
        type: 'saveDistrictData',
        payload: {
          provinceValue: payload[0],
          cityValue: payload[1],
          data: res.data || []
        }
      })
    },
    *setStreetData( {payload}, {call, put} ) {
      console.log('获取街道列表')
      let code  = payload[2].split(',')[0]
      // 发送获取street经销商请求
      const res = yield call( cusGetStreet, {code} )
      yield put({
        type: 'saveStreetData',
        payload: {
          provinceValue: payload[0],
          cityValue: payload[1],
          districtValue: payload[2],
          data: res.data || []
        }
      })
    }
  },
  reducers: {
    saveStreetData( state, {payload} ){
      const {provinceValue, cityValue, districtValue, data} = payload
      let provinceData = [...state.provinceData]  // 复制地址列表
      let provinceParentNode = null //  设置省级父节点
      let cityParentNode = null // 设置市级父节点
      let districtParentNode = null // 设置区县父节点
      provinceData.forEach( provinceItem=>{
        if ( provinceItem.value == provinceValue ) {
          provinceParentNode = provinceItem
          provinceItem.children.forEach( cityItem=>{
            if ( cityItem.value==cityValue ) {
              cityParentNode = cityItem
              cityItem.children.forEach( districtItem=>{
                if (districtItem.value==districtValue) {
                  districtParentNode = districtItem
                }
              } )
            }
          } )
        }
      } )

      let adminId = null
      let arr = []

      for ( var i=0; i<data.length; i++ ) {
        adminId = data[i].adminId || cityParentNode.adminId || provinceParentNode.adminId || districtParentNode.adminId || 1
        arr.push({
          value: `${data[i].code},${adminId}`,
          label: data[i].name,
          id: data[i].id,
          adminId
        })
      }
      districtParentNode.children = arr
      return {
        ...state,
        provincedData: provinceData
      }
    },
    saveDistrictData( state, {payload} ){
      const {provinceValue, cityValue, data} = payload
      let provinceData = [...state.provinceData]
      let provinceParentNode = null //  设置省级父节点
      let cityParentNode = null // 设置市级父节点

      provinceData.forEach( provinceItem=>{
        if ( provinceItem.value == provinceValue ) {
          provinceParentNode = provinceItem
          provinceItem.children.forEach( cityItem=> {
            if ( cityItem.value==cityValue ) {
              cityParentNode = cityItem
            }
          } )
        }
      } )
      let adminId = null
      let arr = []
      for ( var i=0; i<data.length; i++ ) {
        adminId = data[i].adminId || cityParentNode.adminId || provinceParentNode.adminId || 1
        arr.push({
          value: `${data[i].code},${adminId}`,
          label: data[i].name,
          id: data[i].id,
          adminId
        })
      }
      cityParentNode.children = arr
      return {
        ...state,
        provincedData: provinceData
      }
    },
    saveCityData( state, {payload} ){  // provinceData的 child
      const {data, value} = payload
      let provinceArr = clonedeep(state.provinceData)
      let parentNode = null  // 父节点  当前city列表所属的省
      provinceArr.forEach( item=>{
        if ( item.value==value ) {
          parentNode = item  // 给父节点附上值，
        }
      } )
      let adminId = null  // adminId
      let arr = []
      for ( var i=0; i<data.length; i++ ) {
        // adminId如果在市级信息中不存在则为父节点的adminId，都不存在则为超管id
        adminId = data[i].adminId || parentNode.adminId || 1
        arr.push({
          value: `${data[i].code},${adminId}`,
          label: data[i].name,
          id: data[i].id,
          adminId
        })
      }
      parentNode.children = arr
      return {
        ...state,
        provinceData: provinceArr,
      }
    },
    saveProvinceData( state, {payload} ){
      let arr = []
      let adminId = ''
      let value = [...state.value]
      for ( var i=0; i<payload.length; i++ ) {
        adminId = payload[i].adminId || 1
        arr.push({
          value: `${payload[i].code},${adminId}`,
          label: payload[i].name,
          id: payload[i].id,
          adminId
        })
      }
      return {
        ...state,
        provinceData: arr,
        value: value
      }
    }
  }
}
