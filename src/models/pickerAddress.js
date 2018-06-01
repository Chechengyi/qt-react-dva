import { getProvince, getProvinceDealers, getCityDealers } from '../services/api'

let code

export default {
  namespace: 'pickerAddress',
  state: {
    provinceData: [],
  },
  effects: {
    *setProvinceData( {payload}, {call, put} ){
      const res = yield call( getProvince )
      yield put({
        type: 'saveProvinceData',
        payload: res.data
      })
    },
    *setCityData( {payload}, {call, put} ){
      code = payload.split(',')[0]
      const res = yield call( getProvinceDealers, {code} )
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
      // 取出选中的市的code
      let code  = payload[1].split(',')[0]
      const res = yield call( getCityDealers, {code} )
      yield put({
        type: 'saveDistrictData',
        payload: {
          provinceValue: payload[0],
          cityValue: payload[1],
          data: res.data || []
        }
      })
    }
  },
  reducers: {
    saveDistrictData( state, {payload} ){
      const {provinceValue, cityValue, data} = payload
      let arr = []
      for ( var i=0; i<data.length; i++ ) {
        arr.push({
          value: `${data[i].code},${data[i].adminId}`,
          label: data[i].name,
          id: data[i].id
        })
      }
      let provincedData = [...state.provinceData]
      provincedData.forEach( (provinceList)=>{
        if ( provinceList.value==provinceValue ) {
          if (provinceList.children) {
            provinceList.children.forEach( cityList=>{
              if (cityList.value==cityValue) {
                cityList.children = arr
              }
            } )
          }
        }
      } )
      console.log(provincedData)
      return {
        ...state,
        provincedData: provincedData
      }
    },
    saveCityData( state, {payload} ){  // provinceData的 child
      const {data, value} = payload
      let arr = []
      for ( var i=0; i<data.length; i++ ) {
        arr.push({
          value: `${data[i].code},${data[i].adminId}`,
          label: data[i].name,
          id: data[i].id
        })
      }
      let provinceArr = [...state.provinceData]
      provinceArr.forEach( item=>{
        if ( item.value==value ) {
          item.children = arr
        }
      } )
      return {
        ...state,
        provinceData: provinceArr,
      }
    },
    saveProvinceData( state, {payload} ){
      let arr = []
      for ( var i=0; i<payload.length; i++ ) {
        arr.push({
          value: `${payload[i].code},${payload[i].adminId}`,
          label: payload[i].name,
          id: payload[i].id
        })
      }
      return {
        ...state,
        provinceData: arr
      }
    }
  }
}
