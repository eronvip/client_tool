import React, { Component, Fragment, } from 'react';

import { connect } from 'react-redux';
import * as customerActions from '../../actions/customerActions';
import * as modalActions from '../../actions/modal';
import { bindActionCreators, compose } from 'redux';
import CustomerForm from '../CustomerForm';
import { withStyles, Fab, Grid } from '@material-ui/core';
import { DeleteForever, Edit } from '@material-ui/icons';
import DataTable from 'react-data-table-component';
import styles from './style';

class Customers extends Component {
  constructor(props) {
    super(props)
    this.state = {
      page: 1,
      rowPerPage: 20,
      columnsGrid: [
        { name: '#', width: '80px',
          cell: (params, index) => {
            return index + 1
          }
        },
        { selector: 'email', name: 'Email', width: 'calc((100% - 200px) / 5)', sortable: true },
        { selector: 'name', name: 'Tên khách hàng', width: 'calc((100% - 200px) / 5)', sortable: true },
        { selector: 'phone', name: 'Số điện thoại', width: 'calc((100% - 200px) / 5)', sortable: true },
        { selector: 'department', name: 'Phân Xưởng', width: 'calc((100% - 200px) / 5)', sortable: true },
        { selector: 'group', name: 'Tổ', width: 'calc((100% - 200px) / 5)', sortable: true },
        { name: 'Hành động', width: '120px',
          cell: (params) => {
            let data = JSON.parse(JSON.stringify(params))
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
  handleChangePage = (page, total) => {
    // this.setState({ page });
  }
  handleChangeRowsPerPage = (perPage, total) => {
    // this.setState({ page });
  }

  render() {
    const { customers, classes, user } = this.props;
    const { columnsGrid, rowPerPage } = this.state;
    return (
      <Fragment>
        <div className={classes.content}>
          {
            user && user.admin
            ?
            <Grid className={classes.dataTable}>
              <DataTable
                noHeader={true}
                keyField={'_id'}
                columns={columnsGrid}
                data={customers}
                striped={true}
                pagination
                paginationPerPage={rowPerPage}
                paginationRowsPerPageOptions={[10, 20, 50]}
                onChangePage={this.handleChangePage}
                onChangeRowsPerPage={this.handleChangeRowsPerPage}
              />
            </Grid>
            :
            <>
            </>
          }
        </div>
      </Fragment>
    ); 
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