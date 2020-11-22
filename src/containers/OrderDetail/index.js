import React, { Component, Fragment, } from 'react';

import { connect } from 'react-redux';
import * as orderActions from '../../actions/orderActions';
import * as modalActions from '../../actions/modal';
import { bindActionCreators, compose } from 'redux';
import styles from './style';
import { Grid, withStyles, Fab, Paper, TextField, FormControl, Button, GridList, GridListTile } from '@material-ui/core';
import { Redirect } from "react-router-dom";
import { DeleteForever, ArrowBackIos, Edit } from '@material-ui/icons';
import DataTable from 'react-data-table-component';
import { API_ENDPOINT as URL } from '../../constants';
import OrderForm from '../OrderForm';
import moment from 'moment';

class OrderDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showRightPanel: false,
      redirect: false,
      urlRedirect: '',
      currentIdTool: {},
      columnsGrid: [
        { selector: 'name', name: 'Tên công cụ', width: 'calc((100% - 100px) / 3)', sortable: true },
        { selector: 'manufacturer', name: 'Hãng' , width: 'calc((100% - 100px) / 3)', sortable: true },
        { selector: 'type', name: 'Loại', width: 'calc((100% - 100px) / 3)', sortable: true },
        { name: 'Hành động', width: '100px',
          cell: (params) => {
            let data = JSON.parse(JSON.stringify(params))
            const { classes, order } = this.props;
            if (order && order._id && order.status === 'READY') {
              return <></>
            }
            return <>
              <Fab
                color="default"
                aria-label="Remove"
                size='small'
                onClick={() => {
                  this.onClickRemoveTool(data)
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
    const { orderActionCreator, match: { params }} = this.props;
    const { getIdOrder } = orderActionCreator;
    getIdOrder(params.orderId);
  }
  onClickShowTool = (data) => {
    if (data._id === this.state.currentIdTool._id) {
      this.setState({ showRightPanel: false, currentIdTool: {} });
    } else {
      this.setState({ showRightPanel: true, currentIdTool: data})
    }
  }
  renderRedirect = () => {
    if (this.state.redirect) {
      return <Redirect to={this.state.urlRedirect} />
    }
  }
  onClickAddTool = (urlRedirect) => {
    this.setState({
      redirect: true,
      urlRedirect
    })
  }
  onClickGotoList = (urlRedirect) => {
    this.setState({
      redirect: true,
      urlRedirect
    })
  }
  onClickRemoveTool = (data) => {
    const { orderActionCreator, order } = this.props;
    const { currentIdTool } = this.state
    const { updateOrder } = orderActionCreator;
    const { WO, PCT, timeStart, timeStop, userId, status } = data;
    const newOrder = JSON.parse(JSON.stringify(order));
    let indexTool = newOrder.toolId.indexOf(data._id)
    newOrder.toolId.splice(indexTool, 1)
    if(currentIdTool._id === data._id) {
      this.setState({ currentIdTool: {} })
    }
    updateOrder(newOrder);
  }
  onClickEdit = (data) => {
    const { orderActionCreator, modalActionsCreator } = this.props;
    const { setOrderEditing } = orderActionCreator;
    setOrderEditing(data);
    const {
      showModal,
      changeModalTitle,
      changeModalContent,
    } = modalActionsCreator;
    showModal();
    changeModalTitle('Sửa đơn hàng');
    changeModalContent(<OrderForm />);
  }
  onClickVerify = (data) => {
    const { orderActionCreator, user } = this.props;
    const { updateOrder } = orderActionCreator;
    const newOrder = JSON.parse(JSON.stringify(data))
    newOrder.status = 'READY'
    if (user.admin) {
      newOrder.status = 'IN PROGRESS'
    }
    updateOrder(newOrder);
  };
  groupButtonActions = () => {
    const { order, user } = this.props
    if (!user || !order) return <></>;
    switch (order.status) {
      case 'START':
        if (user.admin) {
          return <Button variant="contained" color="primary" onClick={() => {this.onClickVerify(order)}}>Duyệt</Button>;
        } else {
          return <Button variant="contained" color="primary" onClick={() => {this.onClickVerify(order)}}>Gửi Duyệt</Button>;
        }
      case 'READY':
        if (user.admin) {
          return <Button variant="contained" color="primary" onClick={() => {this.onClickVerify(order)}}>Duyệt</Button>;
        } else {
          return <></>;
        }
      case 'IN PROGRESS':
        return <Button variant="contained" color="primary">{user.admin ? 'Đã duyệt' : 'Đã được duyệt'}</Button>;
      case 'COMPLETE':
        return <></>;
      default:
        return <></>;
    }
  }
  render() {
    const { classes, order, user } = this.props
    const { showRightPanel, columnsGrid, currentIdTool } = this.state
    return (
      <Fragment>
        <div className={classes.containerPanel}>
          {this.renderRedirect()}
          <div className={order && order._id ? '' : classes.maskLoading}>
          </div>
          <Grid className={ (showRightPanel ? 'box-panel show-right-panel' : 'box-panel') + (user && (order.userId._id === user._id || user.admin) ? '' : ' hide') }>
            <Grid className='left-panel'>
              <div className='block'>
                <div className='header-action'>
                  <div className='group'>
                    <Button variant="contained" color="primary" onClick={() => {this.onClickGotoList('/admin/order')}}>
                      <ArrowBackIos style={{'color': '#fff'}} fontSize="small" />&nbsp;Quay về danh sách
                    </Button>
                    &nbsp;
                    <Button className={order && order._id && order.status !== 'READY' ? '' : 'hide'} variant="contained" color="primary" onClick={() => {this.onClickEdit(order)}}>
                      <Edit style={{'color': '#fff'}} fontSize="small" />&nbsp;Chỉnh sửa
                    </Button>
                  </div>
                  <div className='group'>
                    <Button variant="contained" color="primary">
                      Trạng thái: {order.status} {user && !user.admin ? '- CHỜ DUYỆT' : ''}
                    </Button>
                    &nbsp;
                    {this.groupButtonActions()}
                  </div>
                </div>
                { user && user.admin ? <div className='customer-field'>Khách hàng: {order.userId.name}</div> : '' }
                <div className='info-wo'>
                  <div className='col-wo'>
                    <FormControl className='field' fullWidth>
                      <TextField id="wo" value={order.WO} label="Work Order" InputProps={{ readOnly: true }} />
                    </FormControl>
                    <FormControl className='field' fullWidth>
                      <TextField id="pct" value={order.PCT} label="PCT" InputProps={{ readOnly: true }} />
                    </FormControl>
                  </div>
                  <div className='col-wo'>
                    <FormControl className='field' fullWidth>
                      <TextField id="date_start" value={moment(order.timeStart).format('DD/MM/YYYY')} label="Ngày bắt đầu" InputProps={{ readOnly: true }} />
                    </FormControl>
                    <FormControl className='field' fullWidth>
                      <TextField id="date_stop" value={moment(order.timeStop).format('DD/MM/YYYY')} label="Ngày kết thúc" InputProps={{ readOnly: true }} />
                    </FormControl>
                  </div>
                </div>
                <div className={classes.boxActions}>
                  <Button className={order && order._id && order.status !== 'READY' ? '' : 'hide'} variant="contained" color="primary" onClick={() => {this.onClickAddTool('/admin/tool/' + order._id)}}>
                    Thêm tool
                  </Button>
                </div>
                <Grid className={classes.dataTable}>
                  <DataTable
                    noHeader={true}
                    keyField={'_id'}
                    columns={columnsGrid}
                    data={this.genarateTools()}
                    striped={true}
                    pagination
                    paginationPerPage={20}
                    paginationRowsPerPageOptions={[10, 20, 50]}
                    onRowClicked={this.onClickShowTool}
                    noDataComponent='Chưa thêm công cụ'
                  />
                </Grid>
              </div>
            </Grid>
            <Grid className='right-panel'>
              <div className='block'>
                <div>Tool ID: {currentIdTool.toolId}</div>
                <div>Tên công cụ: {currentIdTool.name}</div>
                <div>Hãng: {currentIdTool.manufacturer}</div>
                <div>Loại: {currentIdTool.type}</div>
                <div>Hình ảnh:</div>
                <GridList className={classes.gridList} cols={2.5}>
                  {(currentIdTool.images || []).map((image) => (
                    <GridListTile key={image.filename}>
                      <img src={`${URL}/api/upload/image/${image.filename}`} alt={image.filename} />
                    </GridListTile>
                  ))}
                </GridList>     
              </div>
            </Grid>
          </Grid>
        </div>
      </Fragment>
    );
  }
  genarateTools = () => {
    const { order } = this.props;
    if (order && order.toolId && order.toolId.length > 0 && order.toolId[0]._id) {
      return order.toolId
    }
    return []
  }
}
const mapStateToProps = (state, ownProps) => {
  return {
    orders: state.orders.orders,
    order: {
      WO: state.orders.order ? state.orders.order.WO : '',
      PCT: state.orders.order ? state.orders.order.PCT : '',
      date: state.orders.order ? state.orders.order.date : '',
      status: state.orders.order ? state.orders.order.status : '',
      timeStart: state.orders.order ? state.orders.order.timeStart : '',
      timeStop: state.orders.order ? state.orders.order.timeStop : '',
      toolId: state.orders.order ? state.orders.order.toolId : [],
      timeStop: state.orders.order ? state.orders.order.timeStop : '',
      userId: state.orders.order ? state.orders.order.userId : {},
      _id: state.orders.order ? state.orders.order._id : ''
    },
    user: state.auth.user
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    orderActionCreator: bindActionCreators(orderActions, dispatch),
    modalActionsCreator: bindActionCreators(modalActions, dispatch)
  }
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);
export default compose(
  withStyles(styles),
  withConnect,
)(OrderDetail);