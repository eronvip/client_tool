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
    const { orderActionsCreator, orderEditting, user } = this.props;
    const { addOrder, updateOrder } = orderActionsCreator;
    const { woId, pct } = data;
    const newOrder = {
      WO: woId,
      PCT: pct,
      timeStart: (new Date()).toJSON(),
      timeStop: (new Date()).valueOf() + (30 * 24 * 60 * 60 * 1000),
      userId: user._id,
      toolId: ['12'],
      status: 'START'
    }

    if (orderEditting) {
      let { toolId, userId, status, timeStart, timeStop } = orderEditting
      updateOrder({ ...newOrder, toolId, userId, status, timeStart, timeStop });
    } else {
      addOrder(newOrder);
    }
  };
  componentWillMount = () => {
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
    return (
      <form onSubmit={handleSubmit(this.handleSubmitForm)}>
        <Grid container className={classes.form}>
          <Grid item md={12}>
            <Field
              id="woId"
              name="woId"
              label="ID Word Order"
              className={classes.TextField}
              margin="normal"
              component={renderTextField}
            ></Field>
          </Grid>
          <Grid item md={12}>
            <Field
              id="pct"
              name="pct"
              label="PCT"
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
      woId: state.orders.orderEditting ? state.orders.orderEditting.WO : null,
      pct: state.orders.orderEditting ? state.orders.orderEditting.PCT : null
    },
    customersList: state.customers.customers,
    user: state.auth.user
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
