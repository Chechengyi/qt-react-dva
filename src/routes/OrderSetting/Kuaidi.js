import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Select, Button, message} from 'antd';
import Frontdesk_table from './Kuaidi_table'
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './TableList.less';

const FormItem = Form.Item;
const { Option } = Select;

@connect(state => ({
  // categoryList: state.drop.category
  roleId: state.admin_login.roleId,
  admin_id: state.admin_login.admin_id
}))
@Form.create()
export default class Cai extends PureComponent {
  state = {
    selectedRows: [],
    selectKeys: [],
    formValues: {},
    pageNo: 1,
    pageSize: 10,
    delete_key: []
  };

  componentDidMount() {
    this.props.dispatch({
      type: 'provincePriceList/getData',
    })
  }

  handle_page_change = (page, pageSize) => {
    // this.props.dispatch({
    //   type: 'provincePriceList/getData',
    //   payload: {
    //     ...this.state.formValues,
    //   }
    // })
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
        type: 'provincePriceList/getData',
        payload: {
          ...fieldsValue,
        }
      })
    });
  }

  handle_reset = () => {
    this.props.form.resetFields()
    this.setState({
      formValues: {},
      pageNo: 1
    })
    this.props.dispatch({
      type: 'provincePriceList/getData',
    })
  }

  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={10}>
          <Col md={6} sm={10}>
            <FormItem label="省">
              {getFieldDecorator('name', {

              })(
                <Input placeholder="输入省名称查询" />
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
              <Button onClick={ ()=>this.props.history.push('/admin/cont/people/addCourier') } >添加快递员</Button>
            </div>
            <Frontdesk_table
              // data={this.props.data}
              // loading={this.props.loading}
              selectedRows={selectedRows}
              formValues={this.state.formValues}
              onSelectRow={this.handleSelectRows}
              onChange={this.handle_page_change}
              pageNo = {this.state.pageNo}
              delete_key = {this.state.delete_key}
              // total = {this.props.total}
              history={this.props.history}
            />
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}

