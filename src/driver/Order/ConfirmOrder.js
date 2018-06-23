import React, { Component } from 'react'
import { NavBar, Icon, Flex, List, InputItem,
  WhiteSpace, WingBlank, Button, Modal, Toast } from 'antd-mobile'
import { createForm } from 'rc-form'
import { connect } from 'dva'
import { courierConfirmOrder } from '../../services/api'

const FlexItem = Flex.Item
const ListItem = List.Item
const isIPhone = new RegExp('\\biPhone\\b|\\biPod\\b', 'i').test(window.navigator.userAgent);
let moneyKeyboardWrapProps;
if (isIPhone) {
  moneyKeyboardWrapProps = {
    onTouchStart: e => e.preventDefault(),
  };
}

@createForm()
@connect( state=>({
  driver_id: state.driver_login.driver_id
}) )
export default class ConfirmOrder extends Component {

  constructor(props){
    super(props)
    this.state = {
      loading: false
    }
  }

  componentDidMount(){

  }

  submit= data=> {
    if (this.state.loading) return
    let {weight, goodsType, actualFee, price} = this.props.form.getFieldsValue()
    if ( !weight || !actualFee || /^[\s]*$/.test(goodsType) ) {
      Modal.alert('提交的信息不能为空', '请检查表单', [{
        text: '确认', onPress: ()=> {}
      }])
      return
    }
    console.log(data.typeId)
    if ( data.typeId==2 ) {
      if ( !price || /^[\s]*$/.test(price) ) {
        Modal.alert('商品价格不能为空', '', [{
          text: '确认', onPress: ()=> {}
        }])
         return
      }
    }

    Modal.alert('确定订单信息正确？', '确认后将不能在更改', [{
      text: '取消', onPress: ()=> {}
    }, {
      text: '确认', onPress: ()=> {
        this.setState({
          loading: true
        })
        courierConfirmOrder({
          id: data.id,
          couId: this.props.driver_id,
          weight,
          goodsType,
          actualFee: parseFloat(actualFee),
        })
          .then( res=> {
            this.setState({
              loading: false
            })
            if (res.status==='OK') {
              Modal.alert('确认订单信息成功，等待客户付款','', [{
                text: '确认', onPress: ()=> this.props.history.replace('/driverCont/daifukuan')
              }] )
            } else {
              Toast.fail('确认订单信息失败，请重试', 1)
            }
          } )
          .catch( err=> {
            this.setState({
              loading: false
            })
            Toast.fail('服务器发生错误，请重试', 1)
          } )
      }
    }])
  }

  render () {
    const data = this.props.location.params
    const { getFieldProps } = this.props.form
    this.type = 'money'
    if (this.props.location.params) {
      return <div>
        <NavBar
          icon={ <Icon type='left' ></Icon> }
          onLeftClick={ ()=>this.props.history.goBack() }
        >确认订单页面</NavBar>
        <List renderHeader={ ()=>'订单确认页面，请勿刷新页面' } renderFooter={ ()=>'检验订单信息是否正确后确认订单' } >
          <ListItem>
            订单编号：{data.ono}
          </ListItem>
          <ListItem>
            订单类型：{data.orderType}
          </ListItem>
          <InputItem
            {...getFieldProps('weight', {
              initialValue: data.weight,
              normalize: (v, prev) => {  //验证金额
                if (v && !/^(([1-9]\d*)|0)(\.\d{0,2}?)?$/.test(v)) {
                  if (v === '.') {
                    return '0.';
                  }
                  return prev;
                }
                return v;
              },
            })}
            clear
            ref={el => this.inputRef = el}
            // moneyKeyboardWrapProps={moneyKeyboardWrapProps}
            extra=" 公斤"
          >
            货物重量
          </InputItem>
          <InputItem
            {...getFieldProps('goodsType', {
              initialValue: data.goodsType
            })}
          >
            商品类型
          </InputItem>
          {data.typeId==2&&<InputItem
            {...getFieldProps('price', {
              // initialValue: data.actualFee,
              initialValue: 30,
              normalize: (v, prev) => {  //验证金额
                if (v && !/^(([1-9]\d*)|0)(\.\d{0,2}?)?$/.test(v)) {
                  if (v === '.') {
                    return '0.';
                  }
                  return prev;
                }
                return v;
              },
            })}
            extra="元"
          >
            商品价格
          </InputItem>}
          <InputItem
            {...getFieldProps('actualFee', {
              initialValue: data.fee,
              normalize: (v, prev) => {  //验证金额
                if (v && !/^(([1-9]\d*)|0)(\.\d{0,2}?)?$/.test(v)) {
                  if (v === '.') {
                    return '0.';
                  }
                  return prev;
                }
                return v;
              },
            })}
            extra="元"
          >
            真实运费
          </InputItem>
        </List>
        <WingBlank>
          <WhiteSpace />
          <Button loading={this.state.loading} onClick={ ()=>this.submit(data) } type='primary' >确认订单信息</Button>
        </WingBlank>
      </div>
    } else {
      return <div>
        <NavBar
          icon={ <Icon type='left' ></Icon> }
          onLeftClick={ ()=>this.props.history.goBack() }
        >确认订单页面</NavBar>
        <div style={{textAlign: 'center', paddingTop: 30}}  >
          丢失订单信息，请回到上级页面
        </div>
      </div>
    }


  }
}
