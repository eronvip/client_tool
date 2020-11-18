import React, { Component, Fragment, } from 'react';

import { connect } from 'react-redux';
import * as customerActions from '../../actions/customerActions';
import * as modalActions from '../../actions/modal';
import { bindActionCreators, compose } from 'redux';
import CustomerList from '../../components/Customers/Customerlist';
import CustomerItem from '../../components/Customers/CustomerItems';
import CustomerForm from '../CustomerForm';
import { withStyles, Fab, Grid } from '@material-ui/core';
import { DeleteForever, Edit } from '@material-ui/icons';
import { DataGrid } from '@material-ui/data-grid';
import styles from './style';

class Customers extends Component {
  constructor(props) {
    super(props)
    this.state = {
      columnsGrid: [
        { field: 'id', headerName: '#', width: 100 },
        { field: 'name', headerName: 'Tên khách hàng', width: 300 },
        { field: 'email', headerName: 'Email', width: 300 },
        { field: 'department', headerName: 'Phân Xưởng', width: 300 },
        { field: 'group', headerName: 'Tổ', width: 300 },
        { field: 'action', headerName: 'Hành động', width: 200,
          renderCell: (params) => {
            let data = JSON.parse(JSON.stringify(params.data))
            if (data.id) delete data.id
            return <>
              <Fab
                color="default"
                aria-label="Delete"
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
  componentDidMount() {
    const { customerActionCreator } = this.props;
    const { listAllCustomers } = customerActionCreator;
    listAllCustomers();
  }
  onClickWorkOrder = (customer) => {
    const { customerActionCreator } = this.props;
    const { deleteCustomer } = customerActionCreator;
    deleteCustomer(customer);
  }
  onClickEdit = (customer) => {
    const { customerActionCreator, modalActionsCreator } = this.props;
    const { setCustomerEditing } = customerActionCreator;
    setCustomerEditing(customer);
    const {
      showModal,
      changeModalTitle,
      changeModalContent,
    } = modalActionsCreator;
    showModal();
    changeModalTitle('Sửa thông tin khách hàng');
    changeModalContent(<CustomerForm />);
  }

  render() {
    const { customers, classes, user } = this.props;
    const { columnsGrid } = this.state;
    return (
      <Fragment>
        <div className={classes.content}>
          {
            user && user.admin
            ?
            <Grid className={classes.heightgrid}>
              <DataGrid rows={this.genCustomers(customers)} columns={columnsGrid} pageSize={10} rowsPerPageOptions={[10,20,50]} disableSelectionOnClick />
            </Grid>
            :
            <>
            </>
          }
          {/* <CustomerList>
            {this.showCustomers(customers)}
          </CustomerList> */}
        </div>
      </Fragment>
    ); 
  }
  genCustomers = (customers) => {
    let _customers = JSON.parse(JSON.stringify(customers.map((i, index) => ({...i, id: index + 1}))));
    return _customers
  }
  showCustomers = (customers) => {
    var result = null
    var {products} = this.props;
    if (customers.length > 0) {
        result = customers.map((customer, index) => {
            return <CustomerItem
                key={index}
                customer={customer}
                index={index}
                products = {products}
                customers = {customers}
                onClickDelete={()=>{
                  this.onClickDelete(customer)
                }}
                onClickEdit={()=>{
                  this.onClickEdit(customer)
                }}
            >
            </CustomerItem>
        })
    }
    return result;
  }
}
const mapStateToProps = (state, ownProps) => {
  return {
    customers: state.customers.customers,
    user: state.auth.user,
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    customerActionCreator: bindActionCreators(customerActions, dispatch),
    modalActionsCreator: bindActionCreators(modalActions, dispatch)
  }
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);
export default compose(
  withStyles(styles),
  withConnect,
)(Customers);