import React, { Component } from 'react'
import { Rate } from 'antd'
import { NavBar, Flex, TextareaItem, List,
  WhiteSpace, Button, WingBlank, Modal, Toast
} from 'antd-mobile'
import { createForm } from 'rc-form'
import { cusRate } from '../services/api'

@createForm()
export default class Star extends Component{

  constructor(props){
    super(props)
    this.state = {
      starLevel: 0
    }
  }

  rateChange =e=> {
    this.setState({
      starLevel: e<1?1:e
    })
  }

  submit =e=> {
    const { text } = this.props.form.getFieldsValue()
    //  发送评论的时候必须对司机进行评价
    if ( !this.state.starLevel ) {
      Modal.alert('评价星级不能为空！')
      return
    }
    cusRate({
      orderId: parseInt(this.props.match.params.id),
      starLevel: this.state.starLevel,
      text
    })
      .then( res=>{
        console.log(res)
        Toast.success('评价成功', 1)
        this.props.history.replace('/cont/done')
      })
  }

  render(){
    const { getFieldProps } = this.props.form
    return (
      <div>
        <NavBar
          leftContent={<div onClick={ ()=>this.props.history.goBack() } >返回</div>}
        >评价订单</NavBar>
        <div>
          <Flex style={{marginTop: 20}} justify='center' >
            <Rate
              onChange={this.rateChange}
            />
          </Flex>
          <List style={{marginTop: 20}} renderHeader={ ()=>'想说的话' } >
            <TextareaItem
              {...getFieldProps('text')}
              rows={5}
              count={255}
              // title='评价'
            />
          </List>
          <WhiteSpace />
          <WingBlank>
            <Button type='primary' onClick={this.submit} >提交</Button>
          </WingBlank>
        </div>
      </div>
    )
  }
}
