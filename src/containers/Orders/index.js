import React, { Component, Fragment, } from 'react';

import { connect } from 'react-redux';
import * as orderActions from '../../actions/orderActions';
import * as modalActions from '../../actions/modal';
import * as toolActions from '../../actions/toolActions';
import * as customerActions from '../../actions/customerActions';
import { bindActionCreators, compose } from 'redux';
import OrderList from '../../components/Orders/Orderlist';
import OrderItem from '../../components/Orders/OrderItems';
import OrderForm from '../OrderForm';
import styles from './style';
import { Grid, withStyles, Fab } from '@material-ui/core';
import { DataGrid } from '@material-ui/data-grid';
import { DeleteForever, ShoppingCart, Edit } from '@material-ui/icons';
import { Redirect } from "react-router-dom";

import { filter } from 'lodash';

class Orders extends Component {
  constructor(props) {
    super(props)
    this.state = {
      searchTerm: '',
      redirect: false,
      columnsGrid: [
        { field: 'WO', headerName: 'Tên Order', width: 100 },
        { field: 'PCT', headerName: 'PCT', width: 300 },
        { field: 'userId', headerName: 'Tạo bởi', width: 300,
          renderCell: (params) => {
            let data = JSON.parse(JSON.stringify(params.data))
            const { customers } = this.props;
            let user = JSON.parse(JSON.stringify(customers.filter(i => i._id === data.userId)));
            let value = ''
            if (user.length > 0) {
              value = user[0].name
            }
            return value
          }
        },
        { field: 'date', headerName: 'Ngày', width: 300,
          renderCell: (params) => (new Date(params.data.date)).toLocaleString()
        },
        { field: 'action', headerName: 'Hành động', width: 500,
          renderCell: (params) => {
            let data = JSON.parse(JSON.stringify(params.data))
            const { classes } = this.props;
            return <>
              <Fab
                color="default"
                aria-label="Delete"
                size='small'
                onClick={() => {
                  this.onClickEdit()
                }}
              >
                {this.renderRedirect(data._id)}
                <Edit color="primary" />
              </Fab>
              &nbsp;&nbsp;
              <Fab
                color="default"
                aria-label="Delete"
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
  renderRedirect = (id) => {
    if (this.state.redirect) {
      let tool = '/admin/tool/' + id;
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
  onClickEdit = () => {
    this.setState({
      redirect: true
    })
    // const { orderActionCreator, modalActionsCreator } = this.props;
    // const { setOrderEditing } = orderActionCreator;
    // setOrderEditing(order);
    // const {
    //   showModal,
    //   changeModalTitle,
    //   changeModalContent,
    // } = modalActionsCreator;
    // showModal();
    // changeModalTitle('Sửa đơn hàng');
    // changeModalContent(<OrderForm />);
  }

  render() {
    const { orders, classes } = this.props;
    const { columnsGrid } = this.state;
    return (
      <Fragment>
        <div className={classes.content}>
          <Grid className={classes.heightorder}>
            <DataGrid rows={this.genorders(orders)} columns={columnsGrid} pageSize={10} rowsPerPageOptions={[10,20,50]} disableSelectionOnClick />
          </Grid>
        </div>
      </Fragment>
    );
  }

  genorders = (orders) => {
    let _order = JSON.parse(JSON.stringify(orders.map((i, index) => ({...i, id: index}))));
    return _order
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