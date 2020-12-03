import React, { Component } from 'react';
import { withStyles, Grid, Button, FormControl, InputLabel, Select } from '@material-ui/core';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import * as modalActions from '../../actions/modal';
import * as OrderActions from '../../actions/orderActions';
import * as customerActions from '../../actions/customerActions';


import { reduxForm, Field } from 'redux-form';
import validate from './validate';
import styles from './style';
import renderTextField from '../../components/FormHelper/TextField';
import moment from 'moment';

class OrderForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showSearch: true,
      openSelectCustomer: false,
      nameCustomer: '',
      userIdSelect: ''
    }
  }
  componentDidMount() {
    const { customerActionCreator } = this.props;
    const { listAllCustomers } = customerActionCreator;
    listAllCustomers();
  }
  handleSubmitForm = (data) => {
    const { orderActionsCreator, orderEditting, user } = this.props;
    const { userIdSelect } = this.state;
    const { addOrder, updateOrder } = orderActionsCreator;
    const { WO, PCT, timeStart, timeStop, content } = data;
    const newOrder = {
      WO,
      PCT,
      timeStart,
      timeStop,
      userId: userIdSelect || user._id,
      status: 'START',
      content: content || ''
    }
    if (orderEditting) {
      newOrder.toolId = orderEditting.toolId
      newOrder.userId = orderEditting.userId
      newOrder.status = orderEditting.status
      updateOrder(newOrder);
    } else {
      newOrder.status = 'START'
      addOrder(newOrder);
    }
  };
  handleChangeCustomer = (event) => {
    const name = event.target.name;
    this.setState({
      [name]: event.target.value,
    });
  };
  render() {
    var {
      classes,
      modalActionsCreator,
      handleSubmit,
      invalid,
      submitting,
      customers,
      user,
      initialValues
    } = this.props;
    var {
      userIdSelect
    } = this.state;
    const { hideModal } = modalActionsCreator;
    return (
      <form onSubmit={handleSubmit(this.handleSubmitForm)}>
        <Grid container className={classes.form}>
          <Grid item md={12}>
            <Field
              id="WO"
              name="WO"
              label="Work Order"
              className={classes.TextField}
              margin="normal"
              component={renderTextField}
            ></Field>
          </Grid>
          <Grid item md={12}>
            <Field
              id="PCT"
              name="PCT"
              label="PCT"
              className={classes.TextField}
              margin="normal"
              component={renderTextField}
            ></Field>
          </Grid>
          <Grid item md={12}>
            <Field
              id="timeStart"
              name="timeStart"
              label="Ngày bắt đầu"
              type="date"
              className={classes.TextField}
              margin="normal"
              component={renderTextField}
            ></Field>
          </Grid>
          <Grid item md={12}>
            <Field
              id="timeStop"
              name="timeStop"
              label="Ngày kết thúc"
              type="date"
              className={classes.TextField}
              margin="normal"
              component={renderTextField}
            ></Field>
          </Grid>
          <Grid item md={12}>
            <Field
              id="content"
              name="content"
              label="Nội dung công tác"
              multiline
              rowsMax={4}
              className={classes.TextField}
              margin="normal"
              component={renderTextField}
            ></Field>
          </Grid>
          {
            user && user.admin && !initialValues.WO ?
              <Grid item md={12}>
                <FormControl className={classes.TextFieldCustomer}>
                  <InputLabel htmlFor="age-native-simple">Người dùng</InputLabel>
                  <Select
                    native
                    fullWidth
                    value={userIdSelect}
                    onChange={this.handleChangeCustomer}
                    inputProps={{
                      name: 'userIdSelect',
                      id: 'userId',
                    }}
                  >
                    <option aria-label="None" value="" />
                    {
                      customers.map((customer) => {
                        return <option key={customer._id} value={customer._id}>{customer.name}</option>
                      })
                    }
                  </Select>
                </FormControl>
              </Grid>
              : <></>
          }
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
    orderEditting: state.orders.order,
    initialValues: {
      WO: state.orders.order ? state.orders.order.WO : null,
      PCT: state.orders.order ? state.orders.order.PCT : null,
      timeStart: state.orders.order ? moment(state.orders.order.timeStart).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD'),
      timeStop: state.orders.order ? moment(state.orders.order.timeStop).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD')
    },
    customers: state.customers ? state.customers.customers : [],
    user: state.auth.user
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    modalActionsCreator: bindActionCreators(modalActions, dispatch),
    orderActionsCreator: bindActionCreators(OrderActions, dispatch),
    customerActionCreator: bindActionCreators(customerActions, dispatch)
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
