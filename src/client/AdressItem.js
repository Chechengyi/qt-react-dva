import React, { PureComponent } from 'react'
import { Checkbox, Flex, Modal, Toast } from 'antd-mobile'
import { Icon } from 'antd'
import { deleteAddress } from '../services/api'
import { connect } from 'dva'
import { updateAddress } from '../services/api'

@connect(state=>({
  client_id: state.client_login.client_id
}))
export default class AdressItem extends PureComponent {

  constructor(props){
    super(props)
    this.state = {
      display: 'block',
      checked: this.props.defaultId
    }
  }

  componentDidMount(){
    // 如何当前项是默认地址， 则吧页面中默认id状态改为当前项的id
    if (this.props.data.isDefault===1) {
      this.props.setDefaultId(this.props.data.id)
    }
  }

  handleDelete=(id)=>{
    Modal.alert('确认删除该项？', '', [{
      text: '取消', onPress: ()=>{}
    }, {
      text: '确认', onPress: ()=>{
        Toast.loading()
        deleteAddress({
          id,
          cusId: this.props.client_id
        })
          .then( res=>{
            Toast.hide()
            if(res.status==='OK'){
              Toast.success('删除成功！', 1)
              this.setState({
                display: 'none'
              })
            }
          })
          .catch(err=>{
              Toast.hide()
              Toast.fail('删除失败', 1)
          })
      }
    }])
  }

  handleMoren=(type)=>{
    this.setState({
      checked: type
    })
    this.props.setDefaultId(this.props.data.id)
    updateAddress({
      cusId: this.props.client_id,
      id: this.props.data.id,
      isDefault: 1
    })
      .then( res=>{
        console.log(res)
      })
  }

  handleChoose =address=>{
    this.props.dispatch({
      type: 'orderAddress/setChooseAddress',
      payload: address
    })
    this.props.history.goBack()
  }

  render () {
    const {data} = this.props
    return <div style={{backgroundColor: '#fff', marginBottom: 7,
      padding: '4px 5px', minHeight: 85, display: this.state.display}} >
      <div style={{minHeight: 50}} >
        {data.address}
      </div>
      <Flex align='center' style={{}} >
        <div style={{flex:6, paddingLeft: 10}}>
          {/*<a onClick={ e=>{this.handleMoren(true)} }  >*/}
            {/*<Checkbox checked={this.props.defaultId==data.id} />*/}
            {/*设为默认</a>*/}
          {this.props.type==1&&
          <a onClick={()=>{this.handleChoose(data.address)}} style={{color: '#e38466'}} >确认选择</a>
          }
        </div>
        <div style={{flex:4}} >
          <a onClick={e=>this.props.history.push({
            pathname: '/cont/updateAddress',
            query: {
              id: data.id,
              address: data.address
            }
          })} ><Icon type="edit" /> 编辑</a>
          <a onClick={e=>this.handleDelete(data.id)} style={{marginLeft: 10}} ><Icon type="delete" /> 删除</a>
        </div>
      </Flex>
    </div>
  }
}
