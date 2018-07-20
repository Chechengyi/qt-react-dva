import React, { PureComponent } from 'react';
import { connect } from 'dva'
import { Flex, Modal, List, Badge, Accordion } from 'antd-mobile'
import globalStyles from '../index.less'
import menu from './DrawContMenu'

const ListItem = List.Item

@connect(state=>({
  client_name: state.client_login.client_name,
  client_id: state.client_login.client_id,
  client_status: state.client_login.client_status,

}))
export default class DrawCont extends PureComponent {
  link=(path)=>{
    if(this.props.client_status==='OK'){
      this.props.history.push(path)
    }else{
      Modal.alert('还没有登录','先去登录',[{
        text: '取消', onPress: ()=>{}
      }, {
        text: '确定', onPress: ()=>this.props.history.push('/clientUser/login')
      }])
    }
  }

  handleToNoPay =e=> {
    if (this.props.client_status !='OK') {
      Modal.alert('还没有登录','先去登录',[{
        text: '取消', onPress: ()=>{}
      }, {
        text: '确定', onPress: ()=>this.props.history.push('/clientUser/login')
      }])
    } else {
      this.props.history.push('/cont/nopay')
    }
  }

  handle_logout =()=> {
    Modal.alert('确认退出登录？', '', [{
      text: '取消', onPress: ()=>{}
    }, {
      text: '确认', onPress: ()=>{
        this.props.dispatch({
          type: 'client_login/logout',
          payload: {
            sign: 'cus'
          }
        })
      }
    }])
  }

  render () {
    return <div onTouchMove={ (e)=> { e.preventDefault() }}
                style={{ position: 'absolute', width: '100%',
                         top: 0, bottom: 0, backgroundColor: '#fff'
    }} >
      <Flex justify='center'
            style={{height: 70, backgroundColor: '#4f4f4f'}} >
        <span style={{fontSize: '1.3em', color: '#fff'}} >
          {this.props.client_status==='OK'?<span>{this.props.client_name}</span>:
            <span onClick={ ()=>this.props.history.push('/clientUser/login') } >未登录，去登录</span>
          }
        </span>
      </Flex>
      {/*<List>*/}
        <a>
          <ListItem
            arrow='horizontal'
            onClick={ ()=>this.link('/cont/noConfirm') }
            //onClick={ e=>this.props.history.push('/cont/noConfirm') }
          >待确认订单</ListItem>
        </a>
        <a
          // href="https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxe75752031ce1c286&redirect_uri=http://www.laikexin.cc/weixin/auth&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect"
          >
          <ListItem
            arrow='horizontal'
            onClick={this.handleToNoPay}
            extra={<Badge text={this.props.count} ></Badge>}
          >
            未付款订单
          </ListItem>
        </a>
        <a>
          <ListItem
            arrow='horizontal'
            //onClick={ e=>this.props.history.push('/cont/ongoing') }
            onClick={ ()=>this.link('/cont/ongoing') }
          >配送中订单</ListItem>
        </a>
        {menu.map( (item, i)=>(
          <a key={i} >
            <ListItem
              // thumb={item.iconPath}
              arrow='horizontal'
              onClick={ ()=>this.link(item.linkTo) }
               >
              {item.title}
            </ListItem>
          </a>
        ) )}
      <a href="/#/cont/zhinan">
        <ListItem arrow='horizontal' >用户指南</ListItem>
      </a>
      <Flex align='center' style={{
        position: 'absolute',
        height: 50, bottom:0, left: 0, width: '100%'
      }} >
        <div style={{flex: 2}} ></div>
        <div style={{flex: 3}} >
          <a onClick={this.handle_logout}>退出登录</a>
          <a style={{marginLeft: 5}} href='/#/cont/upDatePsw'>修改密码</a>
        </div>
      </Flex>
    </div>
  }
}
