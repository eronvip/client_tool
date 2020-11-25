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
import { Add, GetApp } from '@material-ui/icons';

import * as modalActions from '../../../actions/modal';
import * as orderActions from '../../../actions/orderActions';
import * as customerActions from '../../../actions/customerActions';
import * as toolActions from '../../../actions/toolActions';

import styles from './styles';
import OrderForm from '../../../containers/OrderForm';
import CustomerForm from '../../../containers/CustomerForm';
import ToolForm from '../../../containers/ToolForm';
import { Redirect } from "react-router-dom";
import axios from 'axios';
import * as Config from '../../../constants';
import { getWithToken } from '../../../commons/utils/apiCaller';
import { getToken } from '../../../apis/auth';
import XLSX from 'xlsx';
import moment from 'moment';

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

  convertArrayOfObjectsToCSV = (array) => {
    let result;
  
    const columnDelimiter = ',';
    const lineDelimiter = '\n';
    const keys = Object.keys(array[0]);
  
    result = '';
    result += keys.join(columnDelimiter);
    result += lineDelimiter;
  
    array.forEach(item => {
      let ctr = 0;
      keys.forEach(key => {
        if (ctr > 0) result += columnDelimiter;
  
        result += item[key];
        
        ctr++;
      });
      result += lineDelimiter;
    });
  
    return result;
  }
  generateOrder = (item) => {
    return [item.WO, item.PCT, item.userId.name, moment(item.timeStart).format('DD-MM-YYYY'), moment(item.timeStop).format('DD-MM-YYYY'), item.status]
  }
  generateTool = (item) => {
    return [item.name, item.manufacturer, item.type, item.status ? 'READY' : 'IN USE']
  }
  handleExport = async () => {
    const { labelButtonAdd, order, tools } = this.props;
    let url = '';
    let params = {};
    let header = [];
    let dataBind = '';
    let genData = null;
    switch (labelButtonAdd) {
      case 'ĐƠN HÀNG':
        params = JSON.parse(JSON.stringify(order.params));
        delete params.skip;
        delete params.limit;
        header = ["Work Order", "PCT", "Người Dùng", "Ngày Bắt Đầu", "Ngày Kết Thúc", "Trạng Thái"];
        genData = this.generateOrder;
        url = 'api/orders/search';
        dataBind = 'data.Data.Row';
        break;
    
      case 'CÔNG CỤ':
        params = JSON.parse(JSON.stringify(tools && tools.params ? tools.params : {}));
        if (tools && tools.params) {
          delete params.skip;
          delete params.limit;
        }
        header = ["Tên công cự", "Hãng", "Loại", "Trạng thái"];
        genData = this.generateTool;
        url = 'api/tools/search';
        dataBind = 'data';
        break;
    
      default:
        break;
    }
    let token = await getToken();
    getWithToken(url, token, { params }).then(res => {
      let array = res[dataBind];
      let users = [];
      users.push(header);
      array.forEach((item) => {
        users.push(genData(item));
      })
      const wb = XLSX.utils.book_new();
      const wsAll = XLSX.utils.aoa_to_sheet(users);
      XLSX.utils.book_append_sheet(wb, wsAll, "Work Order");
      let name = `WorkOrder_${moment().format('YYYYMMDDHHmmss')}.xlsx`;
      XLSX.writeFile(wb, name);
    }).catch(err => { return err.response });
  }
  render() {
    const { classes, name, labelButtonAdd, user, isHide, isExport, match: { params }, order } = this.props;
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
              { isHide || !isGetToolforOrder ? name : <>{`Thêm Công Cụ vào Word Order: ${order && order.order ? order.order.WO : ''}`}&nbsp;<Button variant="contained" className={classes.btnBack} onClick={() => {this.onClickGotoUrl('/admin/order-detail/' + order.order._id)}}>Quay lại</Button></>}
            </Typography>
            {labelButtonAdd && !isGetToolforOrder ? <Button variant="contained" color="primary" onClick={this.openForm}>
              <Add />
              { `THÊM MỚI ${labelButtonAdd}`}
            </Button> : null}
            { isExport && user && user.admin ? <>&nbsp;&nbsp;&nbsp;&nbsp;<Button variant="contained" color="primary" onClick={this.handleExport}><GetApp />EXPORT</Button></> : null }
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
    order: state.orders,
    tools: state.tools
  };
};

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(
  withStyles(styles),
  withConnect,
  withRouter,
)(Header);

//export default withStyles(styles)(withRouter(Header));
