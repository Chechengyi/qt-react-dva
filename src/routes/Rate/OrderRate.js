import React, { PureComponent } from 'react'
import { connect } from 'dva'
import { Row, Col, Card, Form, Input, Select, Button, message,
  List
} from 'antd'
import PageHeaderLayout from '../../layouts/PageHeaderLayout'
import styles from '../Order/TableList.less'
import OrderRate_item from './OrderRate_Item'

const FormItem = Form.Item;
const { Option } = Select;

@connect(state => ({
  // categoryList: state.drop.category
  roleId: state.admin_login.roleId,
  admin_id: state.admin_login.admin_id,
  orderType: state.orderType.data,
  data: state.adminRate.data,
  loading: state.adminRate.loading
}))
@Form.create()
export default class Cai extends PureComponent {

  constructor(props){
    super(props)
    this.parameter = {
      adminStatus: 0,
      disposeStatus: 0,
      arbitraStatus: 0
    }
    this.state = {
      formValues: {},
      pageNo: 1,
      pageSize: 10,
    }
  }

  componentDidMount() {
    if ( this.props.orderType.length===0 ) {
      this.props.dispatch({
        type: 'orderType/getData'
      })
    }
    this.props.dispatch({
      type: 'adminRate/getData',
      payload: {
        ...this.parameter,
        pageNo: this.state.pageNo,
        pageSize: this.state.pageSize,
      }
    })
  }

  handle_delete = () => {
    if ( this.state.selectKeys.length==0 ) {
      message.error('请选择需要删除的用户', 1)
      return false
    }
  }

  handle_page_change = (page, pageSize) => {
    this.props.dispatch({
      type: 'adminRate/getData',
      payload: {
        pageNo: page,
        pageSize: this.state.pageSize,
        ...this.state.formValues,
        roleId: this.props.roleId,
        adminId: this.props.admin_id
      }
    })
    this.setState({
      pageNo: page
    })
  }

  handleSelectRows = (rows, key) => {
    this.setState({
      selectedRows: rows,
      selectKeys: key
    });
  }

  handleSearch = (e) => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };
      this.setState({
        formValues: values,
        pageSize: 1
      });
      this.props.dispatch({
        type: 'adminRate/getData',
        payload: {
          pageNo: 1,
          pageSize: 10,
          ...fieldsValue,
          roleId: this.props.roleId,
          adminId: this.props.admin_id
        }
      })
    });
  }

  handle_reset = () => {
    this.props.history.replace('/admin/cont/rate/orderRate')
    // return
    // this.props.form.resetFields()
    // this.setState({
    //   formValues: {},
    //   pageNo: 1
    // })
    // this.props.dispatch({
    //   type: 'donesOrder/getData',
    //   payload: {
    //     pageNo: 1,
    //     pageSize: 10,
    //     roleId: this.props.roleId,
    //     adminId: this.props.admin_id
    //   }
    // })
  }

  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={10}>
          <Col md={6} sm={10} >
            <FormItem label="订单编号">
              {getFieldDecorator('ono')(
                <Input placeholder="输入订单编号查询" />
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={10}>
            <FormItem label="电话">
              {getFieldDecorator('tel', {
                normalize: (v, prev) => {
                  // 电话号码正则验证
                  if (v && !/^(([1-9]\d*)|0)$/.test(v)) {
                    if (v === '.') {
                      return '0';
                    }
                    return prev;
                  }
                  return v;
                },
              })(
                <Input placeholder="输入用户电话查询" />
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={10} >
            <FormItem label="姓名">
              {getFieldDecorator('username')(
                <Input placeholder="输入用户姓名查询" />
              )}
            </FormItem>
          </Col>
          <Col md={5} sm={10} >
            <FormItem label="订单类型">
              {getFieldDecorator('orderType')(
                <Select>
                  {this.props.orderType.map( item=>(
                    <Option key={item.id} value={item.id} >{item.type}</Option>
                  ) )}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={5} sm={10} >
            <FormItem label="星级">
              {getFieldDecorator('starLevel')(
                <Select>
                  <Option value={1} >1 星</Option>
                  <Option value={2} >2 星</Option>
                  <Option value={3} >3 星</Option>
                  <Option value={4} >4 星</Option>
                  <Option value={5} >5 星</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={4} sm={10}>
            <FormItem>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">确认</Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handle_reset}>重置</Button>
            </span>
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const { selectedRows } = this.state;
    const row = item => (
      <OrderRate_item data={item} orderType={this.props.orderType} />
    )

    return (
      <PageHeaderLayout title="">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm} style={{marginBottom: '15px'}} >
              { this.renderSimpleForm() }
              {/*<Button onClick={ ()=>this.props.history.push('/admin/cont/people/addCourier') } >添加快递员</Button>*/}
            </div>
            <List
              itemLayout="vertical"
              loading={this.props.loading}
              dataSource={this.props.data}
              renderItem={row}
              pagination={{
                onChange: (page) => {
                  // 分页请求发送
                  this.props.dispatch({
                    type: 'adminRate/getData',
                    payload: {
                      pageNo: page,
                      pageSize: this.state.pageSize
                    }
                  })
                  this.setState({
                    pageNo: page
                  })
                },
                pageSize: 10,
                total: 100,
                current: this.state.pageNo
              }}
            />
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}

