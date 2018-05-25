import React, { PureComponent } from 'react';
import { connect } from 'dva'
import { Flex } from 'antd-mobile'
import globalStyles from '../index.less'
import menu from './DrawContMenu'

@connect(state=>({
  client_name: state.client_login.client_name,
  client_id: state.client_login.client_id
}))
export default class DrawCont extends PureComponent {
  render () {
    return <div onTouchMove={ (e)=> { e.preventDefault() }}
                style={{ position: 'absolute', width: '100%',
                         top: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)'
    }} >
      <Flex justify='center'
            style={{height: 70, backgroundColor: '#4f4f4f'}} >
        <span style={{fontSize: '1.3em', color: '#fff'}} >
          {this.props.client_name}
        </span>
      </Flex>
      <div style={{
        paddingTop: 30,
        paddingLeft: '20%'
      }} >
        {menu.map( (item,i)=>(
          <div style={{
            margin: '10px 0',
            display: 'flex', flexDirection: 'row', alignItems:'center'
          }} key={i} onClick={ ()=>this.props.history.push(item.linkTo) } >
            <div>
              <img style={{width:25,height:25}} src={item.iconPath} alt=""/>
            </div>
            <div style={{marginLeft: 10}} ><span style={{color: '#fff', fontSize: '1.2em'}} >{item.title}</span></div>
          </div>
        ) )}
      </div>
      <Flex align='center' style={{
        position: 'absolute',
        height: 50, bottom:0, left: 0, width: '100%'
      }} >
        <div style={{flex: 2}} ></div>
        <div style={{flex: 3}} >
          <a style={{color: '#fff'}} >退出登录</a>
          <a href='/#/cont/upDatePsw' style={{marginLeft: 20, color: '#fff'}} >修改密码</a>
        </div>
      </Flex>
    </div>
  }
}
