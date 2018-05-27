import React, { PureComponent } from 'react'
import { NavBar, Button, Toast, Flex, Modal } from 'antd-mobile'
import { updateAddress } from '../services/api'
import { connect } from 'dva'

@connect(state=>({
  client_id: state.client_login.client_id
}))
export default class UpdateAddress extends PureComponent {

  constructor(props){
    super(props)
    this.state = {
      loading: false
    }
  }

  componentWillMount(){
    // react路由传递值过来， 用户刷新值就没了，所以检验如果值没了就跳回地址列表页面
    if (!this.props.location.query) {
      this.props.history.goBack()
    }
  }

  componentDidMount(){
  }
  submit=()=>{
    if ( this.state.loading ) {
      return
    }
    if ( this.refs.text.value.length===0 ) {
      Toast.fail('修改地址不能为空', 1)
      return
    }
    Modal.alert('确定修改？','',[{
      text: '取消', onPress: ()=>{}
    }, {
      text: '确定', onPress: ()=>{
        Toast.loading()
        updateAddress({
          id: this.props.location.query.id,
          address: this.refs.text.value,
          // isDefault: this.state.isDefault,
          cusId: this.props.client_id
        })
          .then( res=>{
            Toast.hide()
            console.log(res.status)
            if(res.status==='OK'){
              Toast.success('修改成功！',1)
              this.refs.text.value=''
            }
          } )
          .catch( err=>{
            Toast.hide()
            Toast.fail('修改失败，请重试')
          } )
      }
    }])
  }

  render(){
    const id = this.props.location.query?this.props.location.query.id:null
    const address = this.props.location.query?this.props.location.query.address:null
    return <div>
      <NavBar
        leftContent='返回'
        onLeftClick={()=>this.props.history.goBack()}
      >
        修改地址
      </NavBar>
      <div style={{marginTop: 20}} >
        <textarea ref='text'
                  style={{width: '100%', height: 100, border: 'none',
                    borderRadius: 0, borderBottom: '1px solid #d9d9d9',
                    borderTop: '1px solid #d9d9d9'
                  }}
                  placeholder='请输入地址...'
                  defaultValue={address}
        >
        </textarea>
        <Flex align='center' style={{padding: '8px 20px'}} >
          {/*<a style={{fontSize: '1.2em'}} >提交</a>*/}
          <Flex.Item>
          </Flex.Item>
          <Flex.Item>
            <Button type='primary' onClick={ this.submit } >提交</Button>
          </Flex.Item>
        </Flex>
      </div>
    </div>
  }
}
