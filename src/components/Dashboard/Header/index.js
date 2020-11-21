import React, { Component } from 'react';
import { compose, bindActionCreators } from 'redux';
import { connect, } from 'react-redux';
import { withRouter } from 'react-router';

import { withStyles, Button, Grid } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MoreIcon from '@material-ui/icons/MoreVert';
import AddIcon from '@material-ui/icons/Add';

import * as modalActions from '../../../actions/modal';
import * as orderActions from '../../../actions/orderActions';
import * as customerActions from '../../../actions/customerActions';
import * as toolActions from '../../../actions/toolActions';

import styles from './styles';
import OrderForm from '../../../containers/OrderForm';
import CustomerForm from '../../../containers/CustomerForm';
import ToolForm from '../../../containers/ToolForm';
import { Redirect } from "react-router-dom";

const menuId = 'primary-search-account-menu';
const mobileMenuId = 'primary-search-account-menu-mobile';

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      anchorEl: null,
      redirect: false,
      urlRedirect: ''
    };
  }
  handleProfileMenuOpen = (event) => {
    this.setState({
      anchorEl: event.currentTarget,
    });
  };

  handleMenuClose = () => {
    this.setState({
      anchorEl: null,
    });
  };
  handleMyProfile = () => {
    const { customerActionsCreator, modalActionsCreator, user } = this.props;
    const { setCustomerEditing } = customerActionsCreator;
    setCustomerEditing(user);
    const {
      showModal,
      changeModalTitle,
      changeModalContent,
    } = modalActionsCreator;
    showModal();
    changeModalTitle('Sửa thông tin cá nhân');
    changeModalContent(<CustomerForm />);
  }
  handleLogout = () => {
    const { history, logout } = this.props;
    logout();
    if (history) {
      history.push('/login')
    }
  }
  renderMenu = () => {
    const { anchorEl } = this.state;
    const isMenuOpen = Boolean(anchorEl);
    return (
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        id={menuId}
        keepMounted
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={isMenuOpen}
        onClose={this.handleMenuClose}
      >
        <MenuItem onClick={this.handleMyProfile}>Thông tin cá nhân</MenuItem>
        <MenuItem onClick={this.handleLogout}>Log out</MenuItem>
      </Menu>
    );
  };

  handleToggleSidebar = () => {
    const { showSidebar, onToggleSidebar } = this.props;
    if (onToggleSidebar) {
      onToggleSidebar(!showSidebar)
    }
  }

  openFormOrder = () => {
    const { modalActionsCreator, orderActionsCreator } = this.props;
    const { setOrderEditing } = orderActionsCreator;
    setOrderEditing(null);
    const {
      showModal,
      changeModalTitle,
      changeModalContent,
    } = modalActionsCreator;
    showModal();
    changeModalTitle('Thêm đơn hàng');
    changeModalContent(<OrderForm />);
  }
  openFormCustomer = () => {
    const { modalActionsCreator, customerActionsCreator } = this.props;
    const { setCustomerEditing } = customerActionsCreator;
    setCustomerEditing(null);
    const {
      showModal,
      changeModalTitle,
      changeModalContent,
    } = modalActionsCreator;
    showModal();
    changeModalTitle('Thêm khách hàng');
    changeModalContent(<CustomerForm />);
  }
  openFormTool = () => {
    const { modalActionsCreator, toolActionsCreator } = this.props;
    const { setToolEditing } = toolActionsCreator;
    setToolEditing(null);
    const {
      showModal,
      changeModalTitle,
      changeModalContent,
    } = modalActionsCreator;
    showModal();
    changeModalTitle('Thêm sản phẩm');
    changeModalContent(<ToolForm />);
  }
  openForm = () => {
    const { modalActionsCreator,
      toolActionsCreator,
      customerActionsCreator,
      orderActionsCreator,
      form: FormComponent,
      labelButtonAdd } = this.props;
    const { setToolEditing } = toolActionsCreator;
    setToolEditing(null);
    const { setCustomerEditing } = customerActionsCreator;
    setCustomerEditing(null);
    const { setOrderEditing } = orderActionsCreator;
    setOrderEditing(null);
    const {
      showModal,
      changeModalTitle,
      changeModalContent,
    } = modalActionsCreator;
    showModal();
    changeModalTitle(`Thêm ${labelButtonAdd}`);
    changeModalContent(<FormComponent />);
  }
  renderRedirect = () => {
    if (this.state.redirect) {
      return <Redirect to={this.state.urlRedirect} />
    }
  }
  onClickGotoUrl = (urlRedirect) => {
    this.setState({
      redirect: true,
      urlRedirect
    })
  }
  render() {
    const { classes, name, labelButtonAdd, user, isHide, match: { params }, order } = this.props;
    let isGetToolforOrder = params.orderId ? true : false;
    return (
      <div className={classes.grow}>
        {this.renderRedirect()}
        <AppBar position="fixed">
          <Toolbar>
            <IconButton
              edge="start"
              className={classes.menuButton}
              color="inherit"
              aria-label="open drawer"
              onClick={this.handleToggleSidebar}
            >
              <MenuIcon />
            </IconButton>
            <Typography className={classes.title} variant="h6" noWrap>
              { isHide || !isGetToolforOrder ? name : <>{`Thêm Công Cụ vào WO: ${order ? order.WO : ''}`}&nbsp;<Button variant="contained" className={classes.btnBack} onClick={() => {this.onClickGotoUrl('/admin/order-detail/' + order._id)}}>Quay lại</Button></>}
            </Typography>
            {labelButtonAdd && !isGetToolforOrder ? <Button variant="contained" color="primary" onClick={this.openForm}>
              <AddIcon />
              { `THÊM MỚI ${labelButtonAdd}`}
            </Button> : null}
            <div className={classes.grow} />
            <div className={classes.sectionDesktop}>
              <label>{user.name}</label>
              <IconButton
                edge="end"
                aria-label="account of current user"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={this.handleProfileMenuOpen}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
            </div>
            <div className={classes.sectionMobile}>
              <IconButton
                aria-label="show more"
                aria-controls={mobileMenuId}
                aria-haspopup="true"
                onClick={this.handleMobileMenuOpen}
                color="inherit"
              >
                <MoreIcon />
              </IconButton>
            </div>
          </Toolbar>
        </AppBar>
        {this.renderMenu()}

      </div>
    );
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    modalActionsCreator: bindActionCreators(modalActions, dispatch),
    orderActionsCreator: bindActionCreators(orderActions, dispatch),
    customerActionsCreator: bindActionCreators(customerActions, dispatch),
    toolActionsCreator: bindActionCreators(toolActions, dispatch)
  };
};

const mapStateToProps = (state, ownProps) => {
  return {
    showModalStatus: state.modal.showModal,
    user: state.auth.user || {},
    order: state.orders.order
  };
};

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(
  withStyles(styles),
  withConnect,
  withRouter,
)(Header);

//export default withStyles(styles)(withRouter(Header));
