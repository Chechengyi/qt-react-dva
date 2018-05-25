import React, { PureComponent } from 'react'
import { NavBar, Button, Toast, Flex, Checkbox, Modal } from 'antd-mobile'
import { connect } from 'dva'
import { addAddress } from '../services/api'

@connect(state=>({
  client_id: state.client_login.client_id
}))
export default class AddAddress extends PureComponent {

  constructor(props){
    super(props)
    this.state = {
      isDefault: true,
      loading: false
    }
  }

  submit=()=>{
    if ( this.state.loading ) {
      return
    }
    if ( this.refs.text.value.length===0 ) {
      Toast.fail('请输入地址后在添加', 1)
      return
    }
    Modal.alert('确定添加？','',[{
      text: '取消', onPress: ()=>{}
    }, {
      text: '确定', onPress: ()=>{
        Toast.loading()
        addAddress({
          id: this.props.client_id,
          adress: this.refs.text.value,
          isDefault: this.state.isDefault
        })
          .then( res=>{
            Toast.hide()
            console.log(res.status)
            if(res.status==='OK'){
              Toast.success('添加成功！',1)
              this.refs.text.value=''
            }
          } )
          .catch( err=>{
            Toast.hide()
          } )
      }
    }])
  }

  checkChange=e=>{
    // console.log(e.target.checked)
    this.setState({
      isDefault: e.target.checked
    })
  }

  render(){
    return <div>
      <NavBar
        leftContent='返回'
        onLeftClick={()=>this.props.history.goBack()}
      >
        添加地址
      </NavBar>
      <div style={{marginTop: 20}} >
        <textarea ref='text'
                  style={{width: '100%', height: 100, border: 'none',
                          borderRadius: 0, borderBottom: '1px solid #d9d9d9',
                          borderTop: '1px solid #d9d9d9'
                  }}
                  placeholder='请输入地址...'
        >
        </textarea>
        <Flex align='center' style={{padding: '8px 20px'}} >
          {/*<a style={{fontSize: '1.2em'}} >提交</a>*/}
          <Flex.Item>
            {/*<button onClick={ this.submit } >提交</button>*/}
            <Checkbox
              defaultChecked={this.state.isDefault}
              onChange={ e=>this.checkChange(e) }
            ></Checkbox> 设为默认
          </Flex.Item>
          <Flex.Item>
            <Button type='primary' onClick={ this.submit } >提交</Button>
          </Flex.Item>
        </Flex>
      </div>
    </div>
  }
}
