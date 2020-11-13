import React, { Component, Fragment, } from 'react';

import { connect } from 'react-redux';
import * as customerActions from '../../actions/customerActions';
import * as modalActions from '../../actions/modal';
import { bindActionCreators } from 'redux';
import CustomerList from '../../components/Customers/Customerlist';
import CustomerItem from '../../components/Customers/CustomerItems';
import CustomerForm from '../CustomerForm';

class Customers extends Component {

  componentDidMount() {
    const { customerActionCreator } = this.props;
    const { listAllCustomers } = customerActionCreator;
    listAllCustomers();
  }
  onClickDelete = (customer) => {
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
    const { customers } = this.props;
    return (
      <Fragment>
        <CustomerList>
          {this.showCustomers(customers)}
        </CustomerList>
      </Fragment>
    ); 
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
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    customerActionCreator: bindActionCreators(customerActions, dispatch),
    modalActionsCreator: bindActionCreators(modalActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Customers);