import React, { Component, Fragment, } from 'react';

import { connect } from 'react-redux';
import * as orderActions from '../../actions/orderActions';
import * as modalActions from '../../actions/modal';
import * as toolActions from '../../actions/toolActions';
import * as customerActions from '../../actions/customerActions';
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
        { selector: 'toolId', name: 'Tool ID', width: '80px' },
        { selector: 'name', name: 'Tên công cụ', width: 'calc((100% - 180px) / 3)' },
        { selector: 'manufacturer', name: 'Hãng' , width: 'calc((100% - 180px) / 3)' },
        { selector: 'type', name: 'Loại', width: 'calc((100% - 180px) / 3)' },
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
    const { orderActionCreator, toolActionCreator, customerActionsCreator, match: { params }} = this.props;
    const { getIdOrder } = orderActionCreator;
    const { listAllTools } = toolActionCreator;
    const { listAllCustomers } = customerActionsCreator;
    getIdOrder(params.orderId);
    listAllTools();
    listAllCustomers();
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
    const { orderActionCreator } = this.props;
    const { updateOrder } = orderActionCreator;
    const newOrder = JSON.parse(JSON.stringify(data))
    newOrder.status = 'READY'
    updateOrder(newOrder);
  };

  render() {
    const { classes, order, tools} = this.props
    const { showRightPanel, columnsGrid, currentIdTool } = this.state
    return (
      <Fragment>
        <div className={classes.containerPanel}>
          {this.renderRedirect()}
          <div className={order && order._id && tools ? '' : classes.maskLoading}>
          </div>
          <Grid className={ showRightPanel ? 'box-panel show-right-panel' : 'box-panel' }>
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
                      Trạng thái: {order.status}
                    </Button>
                    &nbsp;
                    <Button variant="contained" color="primary" onClick={() => {this.onClickVerify(order)}}>
                      Gửi Duyệt
                    </Button>
                  </div>
                </div>
                <FormControl className='field' fullWidth>
                  <TextField id="wo" value={order.WO} label="Work Order" InputProps={{ readOnly: true }} />
                </FormControl>
                <FormControl className='field' fullWidth>
                  <TextField id="pct" value={order.PCT} label="PCT" InputProps={{ readOnly: true }} />
                </FormControl>
                <FormControl className='field' fullWidth>
                  <TextField id="date_start" value={moment(order.timeStart).format('DD/MM/YYYY')} label="Ngày bắt đầu" InputProps={{ readOnly: true }} />
                </FormControl>
                <FormControl className='field' fullWidth>
                  <TextField id="date_stop" value={moment(order.timeStop).format('DD/MM/YYYY')} label="Ngày kết thúc" InputProps={{ readOnly: true }} />
                </FormControl>
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
                    data={this.genarateToolsForid()}
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
  genarateToolsForid = () => {
    const { order, tools } = this.props;
    if (order && order.toolId && tools) {
      let _tools = JSON.parse(JSON.stringify(tools));
      return _tools.filter((tool) => {
        return order.toolId.indexOf(tool._id) > -1;
      })
    }
    return []
  }
}
const mapStateToProps = (state, ownProps) => {
  return {
    orders: state.orders.orders,
    tools: state.tools.tools,
    customers: state.customers.customers,
    order: {
      WO: state.orders.order ? state.orders.order.WO : '',
      PCT: state.orders.order ? state.orders.order.PCT : '',
      date: state.orders.order ? state.orders.order.date : '',
      status: state.orders.order ? state.orders.order.status : '',
      timeStart: state.orders.order ? state.orders.order.timeStart : '',
      timeStop: state.orders.order ? state.orders.order.timeStop : '',
      toolId: state.orders.order ? state.orders.order.toolId : [],
      timeStop: state.orders.order ? state.orders.order.timeStop : '',
      userId: state.orders.order ? state.orders.order.userId : '',
      _id: state.orders.order ? state.orders.order._id : ''
    },
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    orderActionCreator: bindActionCreators(orderActions, dispatch),
    modalActionsCreator: bindActionCreators(modalActions, dispatch),
    customerActionsCreator: bindActionCreators(customerActions, dispatch),
    toolActionCreator: bindActionCreators(toolActions, dispatch),
  }
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);
export default compose(
  withStyles(styles),
  withConnect,
)(OrderDetail);