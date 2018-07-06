import React, { Component } from 'react'

/**   路由检验器， 用作控制登录状态
 * redirectPath   将要重定向去的路径
 * stateSelector state检查函数
 * propsSelector props检查函数
 * redirectBefore  重定向需要执行的函数
 *@autor: Chechengyi
 *@time: 2018/7/3  上午9:43
 *@params:
 *@return:
 */
const loginHoc = ({redirectPath, stateSelector, redirectBeforeTime=300,
                    propsSelector, redirectBefore}) => WrappedComponent => {
  return class extends Component {

    componentWillMount(){
      // 检验组件是否加载成功
      if ( !(this.inspectionStatus()) ) {
        if (redirectBefore) {
          redirectBefore()
        }
        window.location.href=redirectPath
      }
    }

    // 检验条件是否满足
    inspectionStatus =()=> {
      let stateStatus=true, propsStatus=true
      if (stateSelector) {
        if (!this.state) return stateStatus = false
        stateStatus = stateSelector(this.state)
      }
      if (propsSelector) {
        if (!this.props) return stateStatus = false
        propsStatus = propsSelector(this.props)
      }
      return stateStatus&&propsStatus
    }

    componentDidMount(){

    }

    render(){
      return (
        <WrappedComponent {...this.props} />
      )
    }
  }
}

export default loginHoc
