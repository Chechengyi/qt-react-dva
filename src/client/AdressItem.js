import React, { PureComponent } from 'react'
import { Checkbox, Flex, Modal, Toast } from 'antd-mobile'
import { Icon } from 'antd'
import { deleteAddress } from '../services/api'
import { connect } from 'dva'

@connect(state=>({
  client_id: state.client_login.client_id
}))
export default class AdressItem extends PureComponent {

  constructor(props){
    super(props)
    this.state = {
      display: 'block',
      checked: false
    }
  }

  handleDelete=(id)=>{
    // console.log(id)
    // console.log(this.props.client_id)
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

  render () {
    const {data} = this.props
    return <div style={{backgroundColor: '#fff', marginBottom: 7,
      padding: '4px 5px', minHeight: 85, display: this.state.display}} >
      <div style={{minHeight: 50}} >
        {data.address}
      </div>
      <Flex align='center' style={{}} >
        <div style={{flex:6, paddingLeft: 10}}>
          <a onClick={e=>{this.setState({checked:true})}}  >
            <Checkbox checked={this.state.checked} /> 设为默认</a>
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
