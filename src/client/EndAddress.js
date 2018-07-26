import React, { PureComponent } from 'react'
import { connect } from 'dva'
import { NavBar, Icon, List, InputItem, Picker,
  Button, WhiteSpace, WingBlank, Modal, TextareaItem, Flex
} from 'antd-mobile'
import { createForm } from 'rc-form'


const ListItem = List.Item

@createForm()
@connect( state=>({
  endPoint: state.orderAddress.endPoint,
  endMsg: state.orderAddress.endMsg,
  endAddress: state.orderAddress.endAddress,
  provinceList: state.orderAddress.provinceList,
  provinceCode: state.orderAddress.provinceCode,
  chooseAddress: state.orderAddress.chooseAddress
}) )
export default class EndAddress extends PureComponent {

  constructor(props){
    super(props)
    this.typeId = window.sessionStorage.getItem('typeId')
    this.title = this.typeId==2?'完善代购地址信息':'完善收件地址信息'
  }

  renderModal( title='', content='', text='确认', onPress=()=>{} ){
    Modal.alert(title, content, [{
      text, onPress
    }])
  }

  componentDidMount(){
    if ( this.typeId==3&&this.props.provinceList.length===0 ) {
      this.props.dispatch({
        type: 'orderAddress/getProvinceList'
      })
    }
  }

  componentWillUnmount(){
    this.props.dispatch({
      type: 'orderAddress/setChooseAddress',
      payload: null
    })
  }

  submit=()=>{
    let {tel, receiverName, address} = this.props.form.getFieldsValue()
    tel = tel?tel.replace(/\s+/g,""):tel
    if ( this.typeId==1 || this.typeId==3 ) { // 同城急送订单 快递物流订单
      // 物流订单必须选择省code 验证
      if (!this.props.provinceCode &&this.typeId==3 ) {
        this.renderModal('目的地的省归属地不能为空！')
        return
      }
      // 同城寄送参数验证目标地点经纬度不能为空
      if (this.type==1&&Object.keys(this.props.endPoint).length==0) {
        this.renderModal('请将信息完善后在提交')
      }
      // 快递物流与同城急送都适用的参数验证规则
      if ( !tel||!receiverName || !address ) {
        this.renderModal('请将信息完善后在提交')
        return
      }
      if (/^[\s]*$/.test(receiverName)) {
        this.renderModal('姓名信息不能为空白')
        return
      }
      if (/^[\s]*$/.test(address)) {
        this.renderModal('收货地址不能为空白')
        return
      }
      this.props.dispatch({
        type: 'orderAddress/setEndMsg',
        payload: {
          tel,
          receiverName
        }
      })
      this.props.dispatch({
        type: 'orderAddress/endAddress',
        payload: address
      })
    }
    if(this.typeId==2){
      // 代购地点的详细地址也不能为空
      if (!address) {
        this.renderModal('请填写代购商品的详细地址')
        return
      }
      // 代购服务的提交终点信息
      if (Object.keys(this.props.endPoint).length==0) {
        this.renderModal('请选择代购的地点后在提交')
        return
      }
      this.props.dispatch({
        type: 'orderAddress/endAddress',
        payload: address
      })
      this.props.dispatch({
        type: 'orderAddress/setEndMsg',
        payload: {
          tel,
          receiverName
        }
      })
    }
    this.handleBack()
  }

  toTeltype= tel=> {
    let index = 2
    let telArr = tel.split('')
    let endTel = ''
    for ( var i=0; i<telArr.length; i++ ) {
      if ( i==3 || i==7 ) {
        endTel += ' '+telArr[i]
      } else {
        endTel += telArr[i]
      }
    }
    return endTel
  }

  handleBack= e=> {
    if (this.typeId==1) {  // 同城急送
      this.props.history.push('/cont/byOrder/tongcheng')
    } else if (this.typeId==2) {
      this.props.history.push('/cont/byOrder/daigou')
    } else if (this.typeId==3) {
      this.props.history.push('/cont/byOrder/wuliu')
    }
  }

  onPickerChange= e=> {
    this.props.dispatch({
      type: 'orderAddress/setProvinceCode',
      payload: e[0]
    })
  }

  linkChooseAddress =()=> {
    this.props.history.push('/cont/myAdress/1')
    this.saveMsg()
  }

  saveMsg =()=> {
    let {tel, receiverName} = this.props.form.getFieldsValue()
    this.props.dispatch({
      type: 'orderAddress/setEndMsg',
      payload: {
        tel,
        receiverName
      }
    })
  }

  handleGoBack =()=> {
    Modal.alert('是否保存填写的信息？', '', [{
      text: '取消', onPress: ()=>{ this.handleBack() }
    }, {
      text: '保存', onPress: ()=>{ this.submit() }
    }])
  }

  render(){
    const { getFieldProps } = this.props.form
    return <div>
      <NavBar
        icon={ <Icon type='left' /> }
        //onLeftClick={ e=>this.handleBack() }
        onLeftClick={ this.handleGoBack }
      >{this.title}</NavBar>
      <List>
        {this.typeId!=3&&
          <ListItem
            extra='去选择'
            arrow='horizontal'
            onClick={ ()=>this.props.history.push('/cont/chooseEndLocation') }
          >
            <span style={{color: '#e38466'}} >选择地图准确位置</span>
            <List.Item.Brief>{this.props.endPoint.address}
              {this.props.endPoint.name}</List.Item.Brief>
          </ListItem>
        }
        <InputItem
          {...getFieldProps('receiverName', {
            initialValue: this.props.endMsg.receiverName
          })}
          placeholder={this.typeId==2?'选填':''}
        >
          <span style={{color: '#e38466'}} >{this.typeId==2?'商家姓名':'联系人'}</span>
        </InputItem>
        <InputItem
          {...getFieldProps('tel', {
            initialValue: this.props.endMsg.tel
          })}
          placeholder={this.typeId==2?'选填':''}
          type='phone'
        >
          <span style={{color: '#e38466'}} >{this.typeId==2?'商家电话':'联系电话'}</span>
        </InputItem>
        {this.typeId==3&&
        <Picker
          onPickerChange={ this.onPickerChange }
          cols={1}
          value={[this.props.provinceCode]}
          data={this.props.provinceList} >
          <ListItem
            arrow='horizontal'
          ><span style={{color: '#e38466'}} >省归属地</span></ListItem>
        </Picker>
        }
        <TextareaItem
          {...getFieldProps('address', {
            initialValue: this.props.chooseAddress||this.props.endAddress
          })}
          rows={3}
          count={50}
          placeholder={this.typeId==2?'购货详细地址':'收件详细地址'}
          title={<span style={{color: '#e38466'}} >详细地址</span>} />
      </List>
      <Flex justify='center' style={{padding: 20}} >
        <a onClick={this.linkChooseAddress} >我的常用地址</a>
      </Flex>
      <WhiteSpace />
      <WingBlank>
        <Button onClick={ this.submit } type='primary'>确定</Button>
      </WingBlank>
    </div>
  }
}
