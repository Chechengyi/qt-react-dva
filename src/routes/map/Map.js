import React, { PureComponent } from 'react';
import { Select } from 'antd'

const Option = Select.Option
let AMap = Object.map  // 地图对象
let gloabalMap = null  // 全局地图实例
// let circle = null      // 圆

export default class Map extends PureComponent {

  componentDidMount () {
    // console.log(this.props.match.params.id)
    //   27.70846  107.05683
    let self = this
    AMap = Object.AMap
    gloabalMap = new AMap.Map(this.refs.map, {
      resizeEnable: true,
      center: ["107.05683","27.70846"],
      zoom: 15
    });
    AMap.plugin(['AMap.ToolBar','AMap.Scale','AMap.OverView'],
      function(){
        gloabalMap.addControl(new AMap.ToolBar());

        gloabalMap.addControl(new AMap.Scale());

        gloabalMap.addControl(new AMap.OverView({isOpen:true}));
      });
    new AMap.Marker({
      position: ["107.05683","27.70846"],
      icon: '/place.png',
      title: '客户',
      // animation: 'AMAP_ANIMATION_BOUNCE',
      map: gloabalMap
    })
    // 绘制圆  绘制的时候默认圆的半径为1公里
    this.changeR = this.drawRound()
    this.changeR(1000)
  }

  //  显示圆范围   r 为圆的半径
  drawRound = (r) => {
    let circle = circle = new AMap.Circle({
      center: new AMap.LngLat("107.05683","27.70846"),// 圆心位置
      // radius: r, //半径 /m
      // strokeColor: "#FF33FF", //线颜色
      // strokeOpacity: 0.2, //线透明度
      // strokeWeight: 3,    //线宽
      // fillColor: "#1791fc", //填充色
      // fillOpacity: 0.05//填充透明度
      strokeColor: "#4196ff", //线颜色
      strokeOpacity: .4, //线透明度
      strokeWeight: 2,    //线宽
      fillColor: "#4196ff", //填充色
      fillOpacity: 0.05//填充透明度
    });
    circle.setMap(gloabalMap);//显示圆圈
    return (r) => {
      circle.setRadius(r)
      gloabalMap.setFitView();//根据地图上添加的覆盖物分布情况，自动缩放地图到合适的视野级别
    }
  }


  // 快递员位置撒点
  driverMaker = () => {

  }


  render () {
    return <div>
      <div style={{
        height: 50,
        paddingLeft: 10,
        display: 'flex',
        alignItems: 'center'
      }} >
        <div><a onClick={ () => { this.props.history.goBack() }} >返回</a></div>
        <div style={{marginLeft: 30}} >选择范围：</div>
        <div>
          <Select defaultValue={1000} onChange={ (e) => {
            this.changeR(e)
          } } >
            <Option key={1000} value={1000} >1000米</Option>
            <Option key={1500} value={1500} >1500米</Option>
            <Option key={2000} value={2000} >2000米</Option>
          </Select>
        </div>
      </div>
      <div ref='map' id='map' style={{
        width: '100%',
        height: document.body.clientHeight || document.documentElement.clientHeight - 50,
      }} >

      </div>
    </div>
  }
}
