import React, { Component } from 'react'
import { Picker, List } from 'antd-mobile'
import { cusGetAllProvince, cusGetCity } from '../../services/api'
import { promise_ } from '../../services/utils'

const ListItem = List.Item
export default class Ceshi extends Component {

  constructor(props){
    super(props)
    this.state = {
      data: []
    }
  }

  componentDidMount(){
    this.getList([])
  }
  // 获取区域数组
  getList = async (value)=> {
    if ( value.length===0 ) {
      const res = await cusGetAllProvince()
      const data = this.toAddressArr(res.data)
      console.log(data)
      this.setState({
        data
      })
    }
  }

  // 设置返回的地址列表为期望的格式
  toAddressArr = e=> {
    let value = {}
    let arr = e.map( (item, i)=> {
      value = {
            adminId: item['adminId'],
            code: item['code'],
            name: item['name'],
            index: i
          }
      return {
        value: JSON.stringify(value),
        name: item['name']
      }
    } )
    return arr
  }

  render () {
    return <div>
      <List renderHeader={ ()=> '选择区域' } >
        <Picker
          onPickerChange={this.onPickerChange}
          data={this.state.data}
          cascade={true}
        >
          <ListItem>选择区域</ListItem>
        </Picker>
      </List>
    </div>
  }
}
