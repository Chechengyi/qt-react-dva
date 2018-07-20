import React, { Component } from 'react'
import { NavBar, Icon, Toast } from 'antd-mobile'
import styles from './zhinan.less'
import {adminGetOrderTypePrice} from "../../services/api";
import { Table } from 'antd'
import { connect } from 'dva'

@connect(state => ({
  data: state.provincePriceList.data,
  loading: state.provincePriceList.loading,
}))
export default class Zhinan extends Component{

  state = {
    tcData: null,
    dgData: null,
    wlData: null,
    loading: true
  }

  componentDidMount(){
    Toast.loading('加载中...', 2)
    let p1 = new Promise( (reslove, reject)=>{
      adminGetOrderTypePrice({id: 1})
        .then( res=>{
          reslove(res.data)
        })
    })
    let p2 = new Promise( (reslove, reject)=>{
      adminGetOrderTypePrice({id: 2})
        .then( res=>{
          reslove(res.data)
        })
    })
    Promise.all([p1, p2])
      .then( res=>{
        console.log(res)
        this.setState({
          tcData: res[0],
          dgData: res[1],
        })
        Toast.hide()
      })
    this.props.dispatch({
      type: 'provincePriceList/getData',
    })
  }

  render(){
    const columns = [{
      title: '目的地',
      dataIndex: 'name',
    }, {
      title: '首重(kg)',
      dataIndex: 'startWeight',
    }, {
      title: '续重(kg)',
      dataIndex: 'weightPrice',
    }, {
      title: '起步价(元)',
      dataIndex: 'startPrice'
    }];
    return (
      <div style={{paddingBottom: 100}} >
        <NavBar
          leftContent={<div onClick={ ()=>this.props.history.goBack() } >返回</div>}
        >用户指南</NavBar>
        <div className={styles.content} >
          <div>
            <h4>平台介绍</h4>
            <p>强通速递有限公司是经工商行政管理局批准，并加入货运交通运输网的大型物流企业，我们建立了本地一体化的物流配送流通网络，服务范围贯穿货物运输、仓储及市内配送等领域，涵盖了化工、建材、纺织、食品、制药、电器、高科技产品等各行各业。
              公司实力强大，车辆类型齐全，适用于各种货物的运输；管理和操作人员都经过专业的物流培训上岗，是一支年轻化、专业化、高素质的队伍；从而确保货物的安全。
              我们本着服务第一，客户至上的宗旨；急客户之所急，想客户之所未想；为您提供最优质、快捷的服务。
            </p>
          </div>
          <div>
            <h4>注册与账户</h4>
            <p>
              收不到验证码怎么办？
              如果注册迟迟收不到验证码，可按如下顺序排查：<br/>
              1.检查您是否安装了短信拦截软件（如360，手机管家等），如有安装，可放行来自强通速递的短信或暂时删除拦截软件，再次注册发送验证码即可。<br/>
              2.如未安装短信拦截软件，请联系强通速递的客服电话：0821-28855799我们将尽快为您处理。
            </p>
          </div>
          <div>
            <h4>价格申明</h4>
            <div>
              <p>
                <span style={{fontWeight: 500}} >同城急送：</span>
                起步价{this.state.dgData&&this.state.dgData.startPrice}元
                （首距离{this.state.dgData&&this.state.dgData.startDistance}公里+
                  首重{this.state.dgData&&this.state.dgData.startWeight}公斤
                ）超出{this.state.dgData&&this.state.dgData.startWeight}公斤续重
                {this.state.dgData&&this.state.dgData.weightPrice}元钱1公斤，超出
                {this.state.dgData&&this.state.dgData.startDistance}公里加收
                {this.state.dgData&&this.state.dgData.plusPrice}元钱一公里
              </p>
            </div>
            <div>
              <p>
                <span style={{fontWeight: 500}} >代购服务：</span>
                起步价{this.state.tcData&&this.state.tcData.startPrice}元
                （首距离{this.state.tcData&&this.state.tcData.startDistance}公里+
                首重{this.state.tcData&&this.state.tcData.startWeight}公斤
                ）超出{this.state.tcData&&this.state.tcData.startWeight}公斤续重
                {this.state.tcData&&this.state.tcData.weightPrice}元钱1公斤，超出
                {this.state.tcData&&this.state.tcData.startDistance}公里加收
                {this.state.tcData&&this.state.tcData.plusPrice}元钱一公里
              </p>
            </div>
            <div>
              <p>
                <span style={{fontWeight: 500}} >快递物流：</span>请参考快递物流价格表。
              </p>
            </div>
            <div>
              <Table
                size='small'
                dataSource={this.props.data}
                loading={this.props.loading}
                columns={columns}

              />
            </div>
          </div>
        </div>
      </div>
    )
  }
}


