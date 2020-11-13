import React, { Component } from 'react';
import { withStyles, Grid, Button, MenuItem, ExpansionPanel, ExpansionPanelSummary, Typography, ExpansionPanelDetails, ListItem, List } from '@material-ui/core';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import * as modalActions from '../../actions/modal';
import * as OrderActions from '../../actions/orderActions';


import { reduxForm, Field } from 'redux-form';
import validate from './validate';
import styles from './style';
import renderTextField from '../../components/FormHelper/TextField';
import renderSelectField from '../../components/FormHelper/Select';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { filter } from 'lodash';

class OrderForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      findName: '',
      findPhoneNumber: '',
      findAddress: '',
      findFacebook: '',
      price: '',
      showSearch: true,
      openSelectCustomer: false,
      nameCustomer: '',
    }
  }

  handleSubmitForm = (data) => {
    const { orderActionsCreator, orderEditting } = this.props;
    const { addOrder, updateOrder } = orderActionsCreator;
    const { customerId } = this.state;
    const { product, quantity, cash, } = data;
    const newOrder = {
      customerId,
      product: product.toString(),
      quantity: parseInt(quantity),
      price: parseInt(this.state.price),
      cash: parseInt(cash),
      status: 'Khởi tạo đơn hàng',
    }
    if (orderEditting) {
      updateOrder(newOrder);
    } else {
      addOrder(newOrder);
    }
  };
  handleChange = (e) => {
    console.log(e.target.name)
    this.setState({ [e.target.name]: e.target.value })
    if (e.target.name === 'product') {
      const productId = e.target.value;
      const { products } = this.props;
      const productSelected = filter(products, (product) => {
        return product.productId.toString().indexOf(productId.toString()) !== -1;
      })
      this.setState({
        price: productSelected[0].price,
      })
    }
  }

  renderProductSelection() {
    const { classes, products } = this.props;
    let xhtml;

    xhtml = (
      <Field
        id="product"
        name="product"
        label="Sản phẩm"
        className={classes.select}
        component={renderSelectField}
        onChange={this.handleChange}
      >
        {products.map(product => {
          return <MenuItem key={product.productId} value={product.productId}>{product.title}</MenuItem>
        })}
      </Field>
    );
    return xhtml;
  }
  selectCustomer = (_id, nameCustomer) => {
    this.setState({
      customerId: _id,
      openSelectCustomer: !this.state.openSelectCustomer,
      nameCustomer: nameCustomer
    })
  }
  openSelectCustomer = () => {
    this.setState({
      openSelectCustomer: !this.state.openSelectCustomer,
      findName: '',
      findPhoneNumber: '',
      findAddress: '',
      findFacebook: '',
    })
  }
componentWillMount(){
    console.log('alo')
    const {orderEditting, customersList} = this.props;
    if(orderEditting){
      const {customerId} = orderEditting;
      const nameCustomer = filter(customersList, customer => {
        return customer._id.toString().indexOf(customerId.toString()) !== -1;
      });
      this.setState({
        nameCustomer: nameCustomer[0].name,
      });
    }
  }
  render() {
    var {
      classes,
      modalActionsCreator,
      handleSubmit,
      invalid,
      submitting, customersList
    } = this.props;
    var {
      price,
      findAddress,
      findFacebook,
      findName,
      findPhoneNumber,
      nameCustomer,
    } = this.state;
    const { hideModal } = modalActionsCreator;

    if (findName !== '') {
      customersList = filter(customersList, (customer) => {
        return customer.name.toLowerCase().indexOf(findName.toLowerCase()) !== -1;
      })

    }
    if (findAddress !== '') {
      customersList = filter(customersList, (customer) => {
        return customer.name.toLowerCase().indexOf(findAddress.toLowerCase()) !== -1;
      })
    }
    if (findFacebook !== '') {
      customersList = filter(customersList, (customer) => {
        return customer.name.toLowerCase().indexOf(findFacebook.toLowerCase()) !== -1;
      })
    }
    if (findPhoneNumber !== '') {
      customersList = filter(customersList, (customer) => {
        return customer.phoneNumber.toString().indexOf(findPhoneNumber) !== -1;
      })
    }
    var listCustomers = customersList.map(({ _id, name, phoneNumber }, index) => {
      if (findName !== '' || findPhoneNumber !== '' || findFacebook !== '' || findAddress !== '') {
        return (
          <ListItem action key={index} onClick={() => this.selectCustomer(_id, name)} >{name} - {phoneNumber}</ListItem>
        )
      } else {
        return null
      }
    })
    return (
      <form onSubmit={handleSubmit(this.handleSubmitForm)}>
        <Grid container className={classes.form}>
          <ExpansionPanel expanded={this.state.openSelectCustomer}>
            <ExpansionPanelSummary
              //expandIcon={}
              aria-controls="panel1a-content"
              id="panel1a-header"
              onClick={() => { this.openSelectCustomer() }}
            >
              <Typography className={classes.heading} >{nameCustomer === '' ? "Chọn khách hàng" : `Tên khách hàng ${nameCustomer}`} <Button onClick={() => { this.openSelectCustomer() }}><ExpandMoreIcon /></Button></Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Grid container >
                <Grid item md={12}>
                  <Field
                    id="findName"
                    name="findName"
                    label="Ten khach hang"
                    className={classes.TextField}
                    margin="normal"
                    component={renderTextField}
                    onChange={this.handleChange}
                  />
                </Grid>
                <Grid item md={12}>
                  <Field
                    id="findPhoneNumber"
                    name="findPhoneNumber"
                    label="Số điện thoại"
                    type='number'
                    className={classes.TextField}
                    margin="normal"
                    component={renderTextField}
                    onChange={this.handleChange}
                  />
                </Grid>
                <Grid item md={12}>
                  <Field
                    id="findAddress"
                    name="findAddress"
                    label="Địa chỉ"
                    className={classes.TextField}
                    margin="normal"
                    component={renderTextField}
                    onChange={this.handleChange}
                  />
                </Grid>
                <Grid item md={12}>
                  <Field
                    id="findFacebook"
                    name="findFacebook"
                    label="Facebook"
                    className={classes.TextField}
                    margin="normal"
                    component={renderTextField}
                    onChange={this.handleChange}
                  />
                </Grid>
                <List component="nav" aria-label="main mailbox folders">
                  {listCustomers}
                </List>
              </Grid>
            </ExpansionPanelDetails>
          </ExpansionPanel>

          {this.renderProductSelection()}
          <Grid item md={12}>
            <div className={classes.TextField}>Giá: {price}</div>
          </Grid>
          <Grid item md={12}>
            <Field
              id="quantity"
              name="quantity"
              label="Số lượng"
              type='number'
              className={classes.TextField}
              margin="normal"
              component={renderTextField}
            ></Field>
          </Grid>
          <Grid item md={12}>
            <Field
              id="cash"
              name="cash"
              label="Thành tiền"
              type='number'
              className={classes.TextField}
              margin="normal"
              component={renderTextField}
            ></Field>
          </Grid>
          <Grid
            container
            direction="row"
            justify="flex-end"
            alignItems="flex-end"
          >
            <Button onClick={hideModal}>Hủy</Button>
            <Button disabled={invalid || submitting} type="submit">
              Lưu
            </Button>
          </Grid>
        </Grid>
      </form>
    );
  }
}

OrderForm.propTypes = {
  customerId: PropTypes.string,
  product: PropTypes.string,
};

const mapStateToProps = (state, ownProps) => {
  return {
    orderEditting: state.orders.orderEditting,
    initialValues: {
      customerId: state.orders.orderEditting ? state.orders.orderEditting.customerId : null,
      product: state.orders.orderEditting
        ? state.orders.orderEditting.product
        : null,
      quantity: state.orders.orderEditting ? state.orders.orderEditting.quantity : null,
      price: state.orders.orderEditting ? state.orders.orderEditting.price : null,
      cash: state.orders.orderEditting ? state.orders.orderEditting.cash : null,
      status: state.orders.orderEditting ? state.orders.orderEditting.status : null,
    },
    products: state.products.products,
    customersList: state.customers.customers,

  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    modalActionsCreator: bindActionCreators(modalActions, dispatch),
    orderActionsCreator: bindActionCreators(OrderActions, dispatch),
  };
};
const withConnect = connect(mapStateToProps, mapDispatchToProps);
const FORM_NAME = 'ORDER_MANAGEMENT';
const withReduxForm = reduxForm({
  form: FORM_NAME,
  validate,
});
export default compose(
  withStyles(styles),
  withConnect,
  withReduxForm,
)(OrderForm);
