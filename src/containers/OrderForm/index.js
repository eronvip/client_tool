import React, { Component } from 'react';
import { withStyles, Grid, Button, MenuItem, ExpansionPanel, ExpansionPanelSummary, Typography, ExpansionPanelDetails, ListItem, List, TextField } from '@material-ui/core';
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
import moment from 'moment';
import { filter } from 'lodash';

class OrderForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showSearch: true,
      openSelectCustomer: false,
      nameCustomer: '',
    }
  }
  handleSubmitForm = (data) => {
    const { orderActionsCreator, orderEditting, user } = this.props;
    const { addOrder, updateOrder } = orderActionsCreator;
    const { WO, PCT, timeStart, timeStop, userId, status, toolId } = data;
    const newOrder = {
      WO,
      PCT,
      timeStart,
      timeStop,
      userId: userId || user._id,
      status: status || 'START'
    }
    if (orderEditting) {
      newOrder.toolId = orderEditting.toolId
      updateOrder(newOrder);
    } else {
      newOrder.userId = user._id;
      newOrder.status = 'START'
      addOrder(newOrder);
    }
  };
  render() {
    var {
      classes,
      modalActionsCreator,
      handleSubmit,
      invalid,
      submitting
    } = this.props;
    const { hideModal } = modalActionsCreator;
    return (
      <form onSubmit={handleSubmit(this.handleSubmitForm)}>
        <Grid container className={classes.form}>
          <Grid item md={12}>
            <Field
              id="WO"
              name="WO"
              label="ID Word Order"
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
