import { stringify } from 'qs';
import request from '../utils/request';

// 获取验证码
export async function getCode(params) {
  return request(`/getAuthCode?${stringify(params)}`)
}

/*
*   管理员端API
* */
// 管理员登录
export async function adminLogin (parmas) {
  return request('/adminLogin', {
    method: 'POST',
    body: parmas
  })
}



/*
*   客户端API
* */
// 客户端登录请求
export async function clientLogin(params) {
  return request('/cus/login', {
    method: 'POST',
    body: params
  })
}
// 客户端注册账户
export async function clientReg(params) {
  return request('/cus/register', {
    method: 'POST',
    body: params
  })
}
//  用户修改密码
export async function clientUpdatePsw(params) {
  return request('/cus/modifyPwd', {
    method: 'POST',
    body: params
  })
}
// 用户获取消息列表
export async function getMsg(params) {
  return request('/getMes')
}

/*
*   快递员端API
* */
// 快递员登录
export async function driverLogin(params) {
  return request('/courier/login', {
    method: 'POST',
    body: params
  })
}
// 快递员 上班不断发送位置
export async function sendPos(params) {
  return request(`/courier/toWork?${stringify(params)}`)
}
// 快递员下班请求
export async function offWork(parmas) {
  return request(`/courier/offWork?${stringify(parmas)}`)
}
// 快递员修改密码
export async function driverUpdatePsw(params) {
  return request('/courier/modifyPwd', {
    method: 'POST',
    body: params
  })
}
// 查询快递员已有的申请提现的账户
export async function getDriverMoneyAccount(params) {
  return request(`/courier/getCash${stringify(params)}`)
}
