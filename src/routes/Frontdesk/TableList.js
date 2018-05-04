import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Select, Button, message} from 'antd';
import Frontdesk_table from './FrontDesk_table'
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './TableList.less';
import { delete_cus } from '../../services/api'

const FormItem = Form.Item;
const { Option } = Select;

@connect(state => ({
  tablelist: []
}))
@Form.create()
export default class Cai extends PureComponent {
  state = {
    selectedRows: [],
    selectKeys: [],
    formValues: {},
    page: 0,
    num: 10,
    delete_key: []
  };

  componentDidMount() {
    this.props.dispatch({
      type: 'frontdesk/getData',
      payload: {
        page: this.state.page,
        num: this.state.num
      }
    })
  }

  handle_delete = () => {
    if ( this.state.selectKeys.length==0 ) {
      message.error('请选择需要删除的用户', 1)
      return false
    }
    delete_cus({range: this.state.selectKeys})
      .then( res => {
        if ( res.status == 'ok' ) {
          this.props.history.push('/admin/cont/home/frontdesk')
        } else {

        }
      } )
  }

  handle_daochu = () => {
  }

  handle_page_change = (page, pageSize) => {
    this.props.dispatch({
      type: 'frontdesk/getData',
      payload: {
        page: (page-1) *this.state.num,
        num: this.state.num,
        ...this.state.formValues
      }
    })
    this.setState({
      page: page
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
        page: 0
      });
      this.props.dispatch({
        type: 'frontdesk/getData',
        payload: {
          page: 0,
          num: 10,
          ...fieldsValue
        }
      })
    });
  }

  handle_reset = () => {
    this.props.form.resetFields()
    this.setState({
      formValues: {},
      page: 0
    })
    this.props.dispatch({
      type: 'frontdesk/getData',
      payload: {
        page: 0,
        num: 10,
      }
    })
  }

  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={10}>
          <Col md={4} sm={10}>
            <FormItem label="编号">
              {getFieldDecorator('id')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col md={4} sm={10} >
            <FormItem label="用户名称">
              {getFieldDecorator('cus_name')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col md={4} sm={10} >
            <FormItem label="联系人">
              {getFieldDecorator('cus_contact')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col md={4} sm={10} >
            <FormItem label="电话">
              {getFieldDecorator('cus_tel')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col md={4} sm={10}>
            <FormItem label="">
              {getFieldDecorator('cus_type')(
                <Select placeholder="--请选择客户类型--" style={{ width: '100%' }}>
                  <Option value="0">连锁</Option>
                  <Option value="1">普通</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={4} sm={10}>
            <FormItem label="">
              {getFieldDecorator('driver_id')(
                <Select placeholder="--请选择司机--" style={{ width: '100%' }}>
                  {/*<Option value="0">社会连锁</Option>*/}
                  {/*<Option value="1">社会普通</Option>*/}
                  {/*<Option value="2">招标社会</Option>*/}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={4} sm={10}>
            <FormItem label="">
              {getFieldDecorator('is_active')(
                <Select placeholder="--请选择状态--" style={{ width: '100%' }}>
                  <Option value="0">锁定</Option>
                  <Option value="1">启用</Option>
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

    return (
      <PageHeaderLayout title="">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm} style={{marginBottom: '15px'}} >
              { this.renderSimpleForm() }
              {/*<Button onClick={this.handle_daochu} >导出</Button>*/}
              <Button style={{marginLeft: 15}} onClick={ this.handle_delete } >删除</Button>
              <Button style={{marginLeft: 15}} onClick={ () => { this.props.history.push('/admin/cont/home/add_cus') } } >添加用户</Button>
            </div>
            <Frontdesk_table
              selectedRows={selectedRows}
              formValues={this.state.formValues}
              onSelectRow={this.handleSelectRows}
              onChange={this.handle_page_change}
              page = {this.state.page}
              delete_key = {this.state.delete_key}
            />
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
