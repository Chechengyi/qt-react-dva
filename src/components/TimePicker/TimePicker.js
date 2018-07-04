import React, { Component } from 'react'
import { Form, Input, Select, Button } from 'antd'

const FormItem = Form.Item
const Option = Select.Option

// @Form.create()
export default class TimePicker extends Component{

  state = {
    day: 0,
    isRunYear: false,
    year: null,
    month: null,
    date: null   //选中的日期
  }

  renderOptionMouth =()=> {
    let Opntios = []
    for ( var i=0; i<12; i++ ) {
      Opntios.push(
        <Option key={i} value={i} >{i+1}月</Option>
      )
    }
    return Opntios
  }

  // 年份选择改变
  changeYear =value=> {
    if (!value) {
      this.setState({
        month: undefined,
        date: undefined
      })
    }
    // 判断年份平年还是闰年
    var a1=value%4==0
    var a2=value%100!=0
    var a3=value%400==0
    this.setState({
      isRunYear: (a1&&a2)||a3?true:false, //三目运算符
      year: value
    })
  }
  renderOptionDay =()=> {
    let Options = []
    for ( var i=0; i<this.state.day; i++ ) {
      Options.push(
        <Option key={i} value={i+1} >{i+1}号</Option>
      )
    }
    return Options
  }

  mouthChange =value=> {
    if (!value) {
      this.setState({
        date: undefined
      })
    }
    this.setState({
      month: value
    })
    // 平年2月份只有28天， 闰年有29天
    if ( value ==2 ) {
      this.setState({
        day: this.state.isRunYear?29:28
      })
      return
    }
    // 传入月份后判断天数显示多少天，1～7月 奇数31天 8～12月偶数31天
    if ( value <= 7 ) {
      if ( value%2===0 ) { //偶数
        this.setState({
          day: 30
        })
      } else {
        this.setState({
          day: 31
        })
      }
    } else {
      if ( value%2===0 ) { //偶数
        this.setState({
          day: 31
        })
      } else {
        this.setState({
          day: 30
        })
      }
    }
  }

  submit =()=> {
    // const {year, month, day} = this.props.form.getFieldsValue(['year', 'month', 'days'])
    const { year, month, date } = this.state
    if (!year&&!month&&!date) return
    var starTime
    var endTime
    if (year) {
      starTime = new Date(year,1,1)
      endTime = new Date(year+1,1,1)
    }
    if (month) {
      starTime = new Date(year, month, 1)
      endTime = new Date(year, month+1, 1)
    }
    if (date) {
      starTime = new Date(year,month,date)
      endTime = new Date(year, month, date+1)
    }
    // this.props.search([year, month, day])
    this.props.search([starTime, endTime])
  }
  // 吧时间全部重置为没有选择过
  resetTime =()=> {
    this.setState({
      year: undefined,
      month: undefined,
      date: undefined
    })
  }

  _reset=()=> {
    this.resetTime()
    if (this.props.reset) {
      this.props.reset()
    }
  }

  render(){
    // const { getFieldDecorator } = this.props.form
    return (
      <div>
        <Form layout="inline">
          <FormItem label='年' >
            <Select
              value={this.state.year}
              allowClear
              style={{width: 100}}
              onChange={this.changeYear}
            >
              <Option key={2018} value={2018} >2018年</Option>
              <Option key={2019} value={2019} >2019年</Option>
              <Option key={2020} value={2020} >2020年</Option>
              <Option key={2021} value={2021} >2021年</Option>
              <Option key={2022} value={2022} >2022年</Option>
            </Select>
          </FormItem>
          <FormItem label='月' >
            <Select
              value={this.state.month}
              disabled={this.state.year?false:true}
              onChange={this.mouthChange}
              allowClear
              style={{width: 100}} >
              {this.renderOptionMouth()}
            </Select>
          </FormItem>
          <FormItem label='日' >
            <Select
              disabled={this.state.year&&this.state.month?false:true}
              onChange={ e=>{
                this.setState({
                  date: e
                })
              }}
              value={this.state.date}
              allowClear
              style={{width: 100}} >
              {this.renderOptionDay()}
            </Select>
          </FormItem>
          <FormItem>
            <Button
              onClick={ this.submit }
              type='primary' >查询</Button>
          </FormItem>
          <FormItem>
            <Button
              onClick={ this._reset }
            >重置</Button>
          </FormItem>
        </Form>
      </div>
    )
  }
}
