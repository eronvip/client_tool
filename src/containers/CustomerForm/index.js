import React, { Component } from 'react';
import { withStyles, Grid, Button, } from '@material-ui/core';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import * as modalActions from '../../actions/modal';
import * as CustomerActions from '../../actions/customerActions';
import { reduxForm, Field } from 'redux-form';
import validate from './validate';
import styles from './style';
import renderTextField from '../../components/FormHelper/TextField';

class CustomerForm extends Component {

  handleSubmitForm = (data) => {
    const { customerActionsCreator, customerEditting } = this.props;
    const { addCustomer, updateCustomer } = customerActionsCreator;
    const { name, address, phoneNumber, facebook, } = data;
    const newCustomer = {
      name,
      address,
      facebook,
      phoneNumber,
    }
    if (customerEditting) {
      updateCustomer(newCustomer);
    } else {
      addCustomer(newCustomer);
    }
  };
  render() {
    const {
      classes,
      modalActionsCreator,
      handleSubmit,
      invalid,
      submitting,
    } = this.props;
    const { hideModal } = modalActionsCreator;
    return (
      <form onSubmit={handleSubmit(this.handleSubmitForm)}>
        <Grid container>
          <Grid item md={12}>
            <Field
              id="name"
              name="name"
              label="Tên khách hàng"
              className={classes.TextField}
              margin="normal"
              component={renderTextField}
            />
          </Grid>
          <Grid item md={12}>
            <Field
              id="address"
              name="address"
              label="Địa chỉ"
              type='text'
              className={classes.TextField}
              margin="normal"
              component={renderTextField}
            ></Field>
          </Grid>
          <Grid item md={12}>
            <Field
              id="facebook"
              name="facebook"
              label="Facebook"
              type='text'
              className={classes.TextField}
              margin="normal"
              component={renderTextField}
            ></Field>
          </Grid>
          <Grid item md={12}>
            <Field
              id="phoneNumber"
              name="phoneNumber"
              label="Số điện thoại"
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

CustomerForm.propTypes = {
  customerId: PropTypes.string,
  product: PropTypes.string,
};

const mapStateToProps = (state, ownProps) => {
  return {
    customerEditting: state.customers.customerEditting,
    initialValues: {
      name: state.customers.customerEditting ? state.customers.customerEditting.name : null,
      address: state.customers.customerEditting
        ? state.customers.customerEditting.address
        : null,
      facebook: state.customers.customerEditting ? state.customers.customerEditting.facebook : null,
      phoneNumber: state.customers.customerEditting ? state.customers.customerEditting.phoneNumber : null,
    },
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    modalActionsCreator: bindActionCreators(modalActions, dispatch),
    customerActionsCreator: bindActionCreators(CustomerActions, dispatch),
  };
};
const withConnect = connect(mapStateToProps, mapDispatchToProps);
const FORM_NAME = 'CUSTOMER_MANAGEMENT';
const withReduxForm = reduxForm({
  form: FORM_NAME,
  validate,
});
export default compose(
  withStyles(styles),
  withConnect,
  withReduxForm,
)(CustomerForm);
