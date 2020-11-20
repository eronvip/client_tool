import React, { Component, Fragment, } from 'react';

import { connect } from 'react-redux';
import * as orderActions from '../../actions/orderActions';
import * as modalActions from '../../actions/modal';
import * as toolActions from '../../actions/toolActions';
import * as customerActions from '../../actions/customerActions';
import { bindActionCreators, compose } from 'redux';
import styles from './style';
import { Grid, withStyles, Fab } from '@material-ui/core';
import { DeleteForever, Edit } from '@material-ui/icons';
import { Redirect } from "react-router-dom";
import DataTable from 'react-data-table-component';

class Orders extends Component {
  constructor(props) {
    super(props)
    this.state = {
      page: 1,
      rowPerPage: 20,
      redirect: false,
      columnsGrid: [
        { selector: 'WO', name: 'Tên Order', width: 100 },
        { selector: 'PCT', name: 'PCT', width: 300 },
        { selector: 'userId', name: 'Tạo bởi', width: 300,
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
        { selector: 'date', name: 'Ngày', width: 300,
          cell: (params) => (new Date(params.date)).toLocaleString()
        },
        { name: 'Hành động', width: 500,
          cell: (params) => {
            let data = JSON.parse(JSON.stringify(params))
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