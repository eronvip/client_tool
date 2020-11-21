import React, { Component, Fragment, } from 'react';

import { connect } from 'react-redux';
import * as orderActions from '../../actions/orderActions';
import * as modalActions from '../../actions/modal';
import * as toolActions from '../../actions/toolActions';
import * as customerActions from '../../actions/customerActions';
import { bindActionCreators, compose } from 'redux';
import styles from './style';
import OrderForm from '../OrderForm';
import { Grid, withStyles, Fab } from '@material-ui/core';
import { DeleteForever, Edit, Visibility } from '@material-ui/icons';
import { Redirect } from "react-router-dom";
import DataTable from 'react-data-table-component';
import moment from 'moment';

class Orders extends Component {
  constructor(props) {
    super(props)
    this.state = {
      page: 1,
      rowPerPage: 20,
      redirect: false,
      idRedirect: '',
      columnsGrid: [
        { selector: 'WO', name: 'Tên Order', width: '100px' },
        { selector: 'PCT', name: 'PCT', width: 'calc((100% - 250px) / 4)' },
        { selector: 'userId', name: 'Tạo bởi', width: 'calc((100% - 250px) / 4)',
          cell: (params) => {
            let data = JSON.parse(JSON.stringify(params))
            const { customers } = this.props;
            let user = JSON.parse(JSON.stringify(customers.filter(i => i._id === data.userId)));
            let value = ''
            if (user.length > 0) {
              value = user[0].name
            }
            return value
          }
        },
        { selector: 'timeStart', name: 'Ngày bắt đầu', width: 'calc((100% - 250px) / 4)',
          cell: (params) => moment(params.timeStart).format('DD/MM/YYYY')
        },
        { selector: 'timeStop', name: 'Ngày kết thúc', width: 'calc((100% - 250px) / 4)',
          cell: (params) => moment(params.timeStop).format('DD/MM/YYYY')
        },
        { name: 'Hành động', width: '150px',
          cell: (params) => {
            let data = JSON.parse(JSON.stringify(params))
            return <>
              <Fab
                color="default"
                aria-label="Xem Chi Tiết"
                size='small'
                onClick={() => {
                  this.onClickView(data._id)
                }}
              >
                <Visibility color="primary" />
              </Fab>
              &nbsp;&nbsp;
              <Fab
                color="default"
                aria-label="Sửa WO"
                size='small'
                onClick={() => {
                  this.onClickEdit(data)
                }}
              >
                <Edit color="primary" />
              </Fab>
              &nbsp;&nbsp;
              <Fab
                color="default"
                aria-label="Xóa WO"
                size='small'
                onClick={() => {
                  this.onClickDelete(data)
                }}
              >
                <DeleteForever color="error" fontSize="small" />
              </Fab>
            </>
          }
        }
      ]
    }
  }
  renderRedirect = () => {
    if (this.state.redirect && this.state.idRedirect) {
      let tool = '/admin/order-detail/' + this.state.idRedirect;
      return <Redirect to={tool} />
    }
  }
  componentDidMount() {
    const { orderActionCreator, toolActionCreator, customerActionsCreator } = this.props;
    const { listAllOrders } = orderActionCreator;
    const { listAllTools } = toolActionCreator;
    const { listAllCustomers } = customerActionsCreator;
    listAllOrders();
    listAllTools();
    listAllCustomers();
  }
  onClickDelete = (order) => {
    const { orderActionCreator } = this.props;
    const { deleteOrder } = orderActionCreator;
    deleteOrder(order);
  }
  onClickView = (idRedirect) => {
    this.setState({
      redirect: true,
      idRedirect
    })
  }
  onClickEdit = (data) => {
    const { orderActionCreator, modalActionsCreator } = this.props;
    const { setOrderEditing } = orderActionCreator;
    setOrderEditing(data);
    const {
      showModal,
      changeModalTitle,
      changeModalContent,
    } = modalActionsCreator;
    showModal();
    changeModalTitle('Sửa đơn hàng');
    changeModalContent(<OrderForm />);
  }
  handleChangePage = (page, total) => {
    // this.setState({ page });
  }
  handleChangeRowsPerPage = (perPage, total) => {
    // this.setState({ page });
  }

  render() {
    const { orders, classes } = this.props;
    const { columnsGrid, rowPerPage } = this.state;
    return (
      <Fragment>
        <div className={classes.content}>
          <Grid className={classes.dataTable}>
            <DataTable
              noHeader={true}
              keyField={'_id'}
              columns={columnsGrid}
              data={orders}
              striped={true}
              pagination
              paginationPerPage={rowPerPage}
              paginationRowsPerPageOptions={[10, 20, 50]}
              onChangePage={this.handleChangePage}
              onChangeRowsPerPage={this.handleChangeRowsPerPage}
            />
          </Grid>
          {this.renderRedirect()}
        </div>
      </Fragment>
    );
  }
}
const mapStateToProps = (state, ownProps) => {
  return {
    orders: state.orders.orders,
    tools: state.tools.tools,
    customers: state.customers.customers,
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    orderActionCreator: bindActionCreators(orderActions, dispatch),
    modalActionsCreator: bindActionCreators(modalActions, dispatch),
    customerActionsCreator: bindActionCreators(customerActions, dispatch),
    toolActionCreator: bindActionCreators(toolActions, dispatch),
  }
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);
export default compose(
  withStyles(styles),
  withConnect,
)(Orders);