import React, { Component, Fragment, } from 'react';

import { connect } from 'react-redux';
import * as orderActions from '../../actions/orderActions';
import * as modalActions from '../../actions/modal';
import * as customerActions from '../../actions/customerActions';
import { bindActionCreators, compose } from 'redux';
import styles from './style';
import OrderForm from '../OrderForm';
import { Grid, withStyles, Fab, TextField, FormControl, InputLabel, Select, MenuItem, Input } from '@material-ui/core';
import { DeleteForever, Edit, Visibility } from '@material-ui/icons';
import { Redirect } from "react-router-dom";
import DataTable from 'react-data-table-component';
import moment from 'moment';
import { popupConfirm } from '../../actions/ui';

class Orders extends Component {
  constructor(props) {
    super(props)
    this.state = {
      pagination: {
        page: 1,
        rowPerPage: 20,
        rowPerPageOption: [10, 20, 50]
      },
      redirect: false,
      idRedirect: '',
      dataSearch: {
        WO: '',
        PCT: '',
        userId: [],
        status: 'ALL'
      },
      columnsGrid: [
        { selector: 'WO', name: 'Work Order', width: '120px', sortable: true },
        { selector: 'PCT', name: 'PCT', width: 'calc((100% - 600px) / 9 * 2)', sortable: true },
        { selector: 'userId.name', name: 'Tạo bởi', width: 'calc((100% - 600px) / 9 * 2)', sortable: true },
        { selector: 'userId.department', name: 'Phân xưởng', width: 'calc((100% - 600px) / 9 * 2)', sortable: true },
        { selector: 'content', name: 'Nội dung công tác', width: 'calc((100% - 600px) / 9 * 3)' },
        { selector: 'timeStart', name: 'Ngày bắt đầu', width: '110px',
          cell: (params) => moment(params.timeStart).format('DD/MM/YYYY')
        },
        { selector: 'timeStop', name: 'Ngày kết thúc', width: '110px',
          cell: (params) => moment(params.timeStop).format('DD/MM/YYYY')
        },
        { selector: 'status', name: 'Trạng thái', width: '110px', sortable: true },
        { name: 'Hành động', width: '150px',
          cell: (params) => {
            let data = JSON.parse(JSON.stringify(params))
            return <>
              <Fab
                color="default"
                aria-label="Xem Chi Tiết"
                size='small'
                onClick={() => {
                  this.onClickView(data._id)
                }}
              >
                <Visibility color="primary" />
              </Fab>
              &nbsp;&nbsp;
              <Fab
                color="default"
                aria-label="Sửa WO"
                size='small'
                onClick={() => {
                  this.onClickEdit(data)
                }}
              >
                <Edit color="primary" />
              </Fab>
              &nbsp;&nbsp;
              <Fab
                color="default"
                aria-label="Xóa WO"
                size='small'
                onClick={() => {
                  this.onClickDelete(data)
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
  renderRedirect = () => {
    if (this.state.redirect && this.state.idRedirect) {
      let tool = '/admin/order-detail/' + this.state.idRedirect;
      return <Redirect to={tool} />
    }
  }
  componentDidMount() {
    const { orderActionCreator, customerActionCreator } = this.props;
    const { pagination, dataSearch } = this.state;
    const { searchOrder } = orderActionCreator;
    const { listAllCustomers } = customerActionCreator;
    let params = JSON.parse(JSON.stringify(dataSearch))
    params = {
      ...params,
      skip: (pagination.page - 1) * pagination.rowPerPage,
      limit: pagination.rowPerPage
    }
    searchOrder(params);
    listAllCustomers();
  }
  onClickDelete = (order) => {
    let self = this
    popupConfirm({
      title: 'Delete',
      html: "Bạn muốn xóa Work Order này?",
      ifOk: () => {
        const { orderActionCreator } = self.props;
        const { deleteOrder } = orderActionCreator;
        deleteOrder(order);
      }
    })
  }
  onClickView = (idRedirect) => {
    this.setState({
      redirect: true,
      idRedirect
    })
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
  handleSearch = (event) => {
    const { orderActionCreator } = this.props;
    const { pagination, dataSearch } = this.state;
    const { searchOrder } = orderActionCreator;
    let search = {
      ...dataSearch,
      skip: 0,
      limit: pagination.rowPerPage,
      [event.target.name]: event.target.value
    }
    this.setState({ dataSearch: search });
    searchOrder(search);
  }
  handleChangePage = (page, total) => {
    const { orderActionCreator } = this.props;
    const { pagination, dataSearch } = this.state;
    const { searchOrder } = orderActionCreator;
    pagination.page = page;
    this.setState({ pagination })
    let params = JSON.parse(JSON.stringify(dataSearch))
    params = {
      ...params,
      skip: (pagination.page - 1) * pagination.rowPerPage,
      limit: pagination.rowPerPage
    }
    this.setState({ dataSearch: params })
    searchOrder(params);
  }
  handleChangeRowsPerPage = (rowPerPage, total) => {
    const { orderActionCreator } = this.props;
    const { pagination, dataSearch } = this.state;
    const { searchOrder } = orderActionCreator;
    pagination.rowPerPage = rowPerPage;
    pagination.page = 1;
    this.setState({ pagination })
    let params = JSON.parse(JSON.stringify(dataSearch))
    params = {
      ...params,
      skip: (pagination.page - 1) * pagination.rowPerPage,
      limit: pagination.rowPerPage
    }
    this.setState({ dataSearch: params })
    searchOrder(params);
  }

  render() {
    const { orders, customers, ordersTotal, classes } = this.props;
    const { columnsGrid, pagination, dataSearch } = this.state;
    return (
      <Fragment>
        <div className={classes.content}>
          <div className="box-search">
            <div className="lb-search">Search</div>
            <div className="field-search">
              <TextField
                fullWidth
                id="search_WO"
                name="wo"
                label="Work Order"
                variant="filled"
                onInput={this.handleSearch}
              />
            </div>
            <div className="field-search">
              <TextField
                fullWidth
                id="search_pct"
                name="pct"
                label="PCT"
                variant="filled"
                onInput={this.handleSearch}
              />
            </div>
            <div className="field-search">
              <FormControl fullWidth className="multiple-select">
                <InputLabel className="lb-user" id="lb-user">Tạo bởi</InputLabel>
                <Select
                  labelId="lb-user"
                  id="user-id"
                  className="sl-user"
                  multiple
                  value={dataSearch.userId}
                  onChange={this.handleSearch}
                  inputProps={{
                    name: 'userId',
                    id: 'userId',
                  }}
                  input={<Input />}
                >
                  {customers && customers.map((c) => (
                    <MenuItem key={c._id} value={c._id}>
                      {c.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            <div className="field-search">
              <TextField
                fullWidth
                id="search_content"
                name="content"
                label="Nội dung công tác"
                variant="filled"
                onInput={this.handleSearch}
              />
            </div>
            <div className="field-search">
              <FormControl fullWidth variant="filled">
                <InputLabel htmlFor="status">Trạng thái</InputLabel>
                <Select
                  fullWidth
                  native
                  value={dataSearch.status}
                  onChange={this.handleSearch}
                  inputProps={{
                    name: 'status',
                    id: 'status',
                  }}
                >
                  <option value="ALL">Tất cả</option>
                  <option value="START">START</option>
                  <option value="READY">READY</option>
                  <option value="IN PROGRESS">IN PROGRESS</option>
                  <option value="COMPLETE">COMPLETE</option>
                </Select>
              </FormControl>
            </div>
          </div>
          <Grid className={classes.dataTable}>
            <DataTable
              noHeader={true}
              keyField={'_id'}
              columns={columnsGrid}
              data={orders}
              striped={true}
              pagination
              paginationServer
              paginationDefaultPage={pagination.page}
              paginationPerPage={pagination.rowPerPage}
              paginationRowsPerPageOptions={pagination.rowPerPageOption}
              paginationTotalRows={ordersTotal}
              onChangePage={this.handleChangePage}
              onChangeRowsPerPage={this.handleChangeRowsPerPage}
            />
          </Grid>
          {this.renderRedirect()}
        </div>
      </Fragment>
    );
  }
}
const mapStateToProps = (state, ownProps) => {
  return {
    customers: state.customers.customers,
    orders: state.orders.orders,
    ordersTotal: state.orders.total
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    customerActionCreator: bindActionCreators(customerActions, dispatch),
    orderActionCreator: bindActionCreators(orderActions, dispatch),
    modalActionsCreator: bindActionCreators(modalActions, dispatch)
  }
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);
export default compose(
  withStyles(styles),
  withConnect,
)(Orders);