import React, { Component } from 'react'
import { Flex } from 'antd-mobile'

export default class MoneyRecordItem extends Component{
  render(){
    const {data} = this.props
    console.log(data)
    return (
      <div
        style={{backgroundColor: '#fff', padding: 5, marginBottom: 5}}
      >
        <Flex>
          提现时间：{new Date(data.putTime.substring(0, data.putTime.lastIndexOf('.'))).toLocaleString()}
        </Flex>
        <Flex>
          <div style={{width: '30%'}} >
            <span style={{marginRight: 5}} >提现方式:</span>
            {data.accountSign=='wxpay'?
              <img style={{width: 25, height: 25}} src="wechat.png" alt=""/>:
              <img style={{width: 25, height: 25}} src="apy.png" alt=""/>
            }
          </div>
          <div style={{width: '70%', paddingLeft: 5}} >
            提现账户: {data.putAccount}
          </div>
        </Flex>
        <Flex>
           提款金额：<span style={{fontSize: '1.1em', fontWeight: 500}} >{data.putCash}</span> 元
        </Flex>
        <Flex>
          <span style={{color: '#ccc'}} >{data.isDone==1?'管理员已处理':'等待管理员处理'}</span>
        </Flex>
      </div>
    )
  }
}
