import React, { PureComponent } from 'react'

var Amap = null
var map = null   // 地图

export default class Ceshi extends PureComponent {

  componentDidMount () {
    /*
    * <script type="text/javascript">
        var u = navigator.userAgent;
        var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
        var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
        alert('是否是Android：'+isAndroid);
        alert('是否是iOS：'+isiOS);
      </script>
    * */
   // alert( navigator.userAgent)   判断是苹果手机还是安卓手机
   //  return false
    Amap = Object.AMap
    map = new AMap.Map(this.refs.map, {
      resizeEnable: true,
      zoom:14,
      center: ["107.05683","27.70846"]
    });
    AMap.plugin(['AMap.ToolBar','AMap.Scale','AMap.OverView'],
      function(){
        map.addControl(new AMap.ToolBar());

        map.addControl(new AMap.Scale());

        // map.addControl(new AMap.OverView({isOpen:true}));
      });
  }

  render () {
    return <div>

      <div style={{margin: 20}} >地图测试</div>
      {/*安卓手机androidamap 开头*/}
      <a href="iosamap://navi?sourceApplication=appname&amp;poiname=fangheng&amp;lat=27.70846&amp;lon=107.05683&amp;dev=1&amp;style=2">导航</a>
      <div id='map' ref='map' style={{height: 300}} ></div>
    </div>
  }
}
