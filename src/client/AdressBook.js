import React, { Component } from 'react'
import { connect } from 'dva'
import { NavBar, Icon, ActivityIndicator } from 'antd-mobile'
import AddressItem from './AdressItem'
import Iscroll from 'iscroll/build/iscroll'
import globalStyles from '../index.less'

@connect(state=>({
  client_id: state.client_login.client_id,
  data: state.client_address.data,
  loading: state.client_address.loading
}))
export default class AdressBook extends Component {

  componentDidMount(){
    this.props.dispatch({
      type: 'client_address/getData',
      payload: {
        cus_id: this.props.client_id
      }
    })
    this.scroll = new Iscroll(this.refs.warp, {
      // scrollbars: true,
      // fadeScrollbars: true
      // click: true，
      preventDefault: false,
    })
  }

  shouldComponentUpdate(nextProps, nextState){
    if ( nextProps.data==this.props.data) {
      this.scroll.refresh();
    }
    // this.scroll.refresh();
    return true
  }

  // deleteAddress=(id)=>{
  //   console.log(id)
  // }

  render(){
    return <div onTouchMove={ e=>e.preventDefault() } style={{touchAction: 'none'}} >
      <div style={{
        position: 'absolute',
        width: '100%', top: 0, left: 0
      }} >
        <NavBar
          // icon={<Icon type='left' ></Icon>}
          leftContent='返回'
          onLeftClick={()=>this.props.history.goBack()}
        >我的地址薄</NavBar>
      </div>
      <div ref='warp' style={{backgroundColor: '#f1f1f1', position: 'absolute',
                    width: '100%', top: 44, bottom: 44, left: 0, overflow: 'hidden'
      }} >
        <div>
          <div style={{display: this.props.loading?'flex':'none',
                        height: 50, justifyContent: 'center', alignItems: 'center',
                        position: 'absolute', top: 0, left: 0
          }} >
            <ActivityIndicator animating={this.props.loading} />
          </div>
          {this.props.data.map( (item,i)=>(
            <AddressItem history={this.props.history} data={item} key={i} />
          ) )}
        </div>
      </div>
      <div className={globalStyles.onePxTop} style={{height: 44, textAlign: 'center', lineHeight: '44px',
                   position: 'absolute', width: '100%', bottom: 0, left: 0
      }}
        onClick={ ()=>this.props.history.push('/cont/addAddress') }
      >
        + 添加新地址
      </div>
    </div>
  }
}
