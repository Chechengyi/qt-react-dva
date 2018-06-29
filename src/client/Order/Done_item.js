import React, { Component } from 'react'
import { Flex } from 'antd-mobile'

export default class Done_item extends Component{

  renderOrderType = id => {
    for (var i = 0; i < this.props.orderType.length; i++) {
      if (id == this.props.orderType[i].id) {
        return this.props.orderType[i].type
      }
    }
  }

  render(){
    const {data, orderType} = this.props
    return (
      <div>
        <Flex>
          订单编号：{data.ono}
        </Flex>
        <Flex>
          {!data.isRate&&
          <a onClick={ ()=>this.props.history.replace(`/cont/star/${data.id}`) }>
            评价订单
          </a>
          }
        </Flex>
      </div>
    )
  }
}
