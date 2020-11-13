import React, { Component, Fragment, } from 'react';

import { connect } from 'react-redux';
import * as orderActions from '../../actions/orderActions';
import * as modalActions from '../../actions/modal';
import * as productActions from '../../actions/toolActions';
import * as customerActions from '../../actions/customerActions';
import { bindActionCreators } from 'redux';
import OrderList from '../../components/Orders/Orderlist';
import OrderItem from '../../components/Orders/OrderItems';
import OrderForm from '../OrderForm';

import { filter } from 'lodash';

class Orders extends Component {

  componentDidMount() {
    const { orderActionCreator, productActionsCreator, customerActionsCreator } = this.props;
    const { listAllOrders } = orderActionCreator;
    const { listAllProducts } = productActionsCreator;
    const { listAllCustomers } = customerActionsCreator;
    listAllOrders();
    listAllProducts();
    listAllCustomers();
  }
  onClickDelete = (order) => {
    const { orderActionCreator } = this.props;
    const { deleteOrder } = orderActionCreator;
    deleteOrder(order);
  }
  onClickEdit = (order) => {
    const { orderActionCreator, modalActionsCreator } = this.props;
    const { setOrderEditing } = orderActionCreator;
    setOrderEditing(order);
    const {
      showModal,
      changeModalTitle,
      changeModalContent,
    } = modalActionsCreator;
    showModal();
    changeModalTitle('Sửa đơn hàng');
    changeModalContent(<OrderForm />);
  }

  render() {
    const { orders } = this.props;
    return (
      <Fragment>
        <OrderList>
          {this.showOrders(orders)}
        </OrderList>
      </Fragment>
    );
  }
  showOrders = (orders) => {
    var result = null
    var { products, customers } = this.props;
    if (orders.length > 0 && products) {
      result = orders.map((order, index) => {
        const productt = filter(products, (product) => {
          return product.productId === parseInt(order.product);
        })
        if (productt[0] !== undefined ) {
          const productName = productt[0].title;
          return <OrderItem
            key={index}
            order={order}
            index={index}
            productName={productName}
            customers={customers}
            onClickDelete={() => {
              this.onClickDelete(order)
            }}
            onClickEdit={() => {
              this.onClickEdit(order)
            }}
          >
          </OrderItem>
        }
      })
    }
    return result;
  }
}
const mapStateToProps = (state, ownProps) => {
  return {
    orders: state.orders.orders,
    products: state.products.products,
    customers: state.customers.customers,
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    orderActionCreator: bindActionCreators(orderActions, dispatch),
    modalActionsCreator: bindActionCreators(modalActions, dispatch),
    productActionsCreator: bindActionCreators(productActions, dispatch),
    customerActionsCreator: bindActionCreators(customerActions, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Orders);