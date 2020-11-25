import React, { Component, Fragment, } from 'react';

import { connect } from 'react-redux';
import * as toolActions from '../../actions/toolActions';
import * as imageActions from '../../actions/imageActions';
import * as modalActions from '../../actions/modal';
import * as OrderActions from '../../actions/orderActions';
import { bindActionCreators, compose } from 'redux';
import ToolForm from '../ToolForm';
import { Grid, withStyles, Fab, TextField, FormControl, InputLabel, Select } from '@material-ui/core';
import styles from './style';
import { limitSizeImage } from '../../constants';
import { DeleteForever, Add, Edit, Remove } from '@material-ui/icons';
import DataTable from 'react-data-table-component';

class Tools extends Component {
  constructor(props) {
    super(props)
    this.state = {
      listFile: [],
      filenameImageTool: [],
      largeImage:'',
      searchTerm: '',
      dataSearch: {
        name: '',
        manufacturer: '',
        type: '',
        status: "all"
      },
      columnsGrid: [
        { selector: 'name', name: 'Tên công cụ', width: 'calc((100% - 120px) / 4)', sortable: true },
        { selector: 'manufacturer', name: 'Hãng' , width: 'calc((100% - 120px) / 4)', sortable: true },
        { selector: 'type', name: 'Loại', width: 'calc((100% - 120px) / 4)', sortable: true },
        { selector: 'status', name: 'Trạng thái', width: 'calc((100% - 120px) / 4)', sortable: true,
          cell: (param) => {
            return param.status && 'IN USE' || 'READY';
          }
        },
        { name: 'Hành động', width: '120px',
          cell: (param) => {
            let data = JSON.parse(JSON.stringify(param))
            const { classes, user, match: { params } } = this.props;
            return <>
              {
                params.orderId ?
                <>
                    {
                      data.hasTool ?
                      <Fab
                        color="default"
                        aria-label="Thêm vào WO"
                        size='small'
                        onClick={() => {
                          this.onClickWorkOrder(data)
                        }}
                      >
                        <Remove color="error" fontSize="small" />
                      </Fab>
                      : (
                        data.status ?
                        <></> :
                        <Fab
                          color="default"
                          aria-label="Thêm vào WO"
                          size='small'
                          onClick={() => {
                            this.onClickWorkOrder(data)
                          }}
                        >
                          <Add className={classes.colorSuccess} fontSize="small" />
                        </Fab>
                      )
                    }
                </>
                :
                <>
                  {
                    user.admin ?
                    <>
                      <Fab
                        color="default"
                        aria-label="Delete"
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
                        aria-label="Delete"
                        size='small'
                        onClick={() => {
                          this.onClickDelete(data)
                        }}
                      >
                        <DeleteForever color="error" fontSize="small" />
                      </Fab>
                      &nbsp;&nbsp;
                    </>
                    : <></>
                  }
                </>
              }
            </>
          }
        }
      ]
    }
  }

  componentDidMount() {
    const { orderActionsCreator, toolActionCreator, match: { params } } = this.props;
    const { listAllTools } = toolActionCreator;
    const { getIdOrder } = orderActionsCreator;
    listAllTools();
    if (params.orderId) {
      getIdOrder(params.orderId)
    }
  }
  onClickDelete = (tool) => {
    const { toolActionCreator } = this.props;
    const { deleteTool } = toolActionCreator;
    deleteTool(tool)
  }
  onClickEdit = (tool) => {
    const { toolActionCreator, modalActionsCreator, imageActionsCreator } = this.props;
    const { setToolEditing } = toolActionCreator;
    const { uploadImagesSuccess } = imageActionsCreator;
    uploadImagesSuccess(tool.images);
    setToolEditing(tool);
    const {
      showModal,
      changeModalTitle,
      changeModalContent,
    } = modalActionsCreator;
    showModal();
    changeModalTitle('Sửa công cụ');
    changeModalContent(<ToolForm />);
  }
  onClickWorkOrder = (tool) => {
    const { orderActionsCreator, toolActionCreator, order } = this.props;
    const { updateOrder } = orderActionsCreator;
    const { updateTool } = toolActionCreator;
    const newOrder = JSON.parse(JSON.stringify(order));
    const newTool = JSON.parse(JSON.stringify(tool));
    let lstTool = [] 
    if (newOrder.toolId && newOrder.toolId.length > 0) {
      lstTool = newOrder.toolId
      if (newOrder.toolId[0]._id) {
        lstTool = newOrder.toolId.map(i => i._id)
      }
    }
    let indexTool = lstTool.indexOf(tool._id);
    if (indexTool > -1) {
      lstTool.splice(indexTool, 1);
      newTool.status = 0;
      newTool.hasTool = false;
    } else {
      lstTool.unshift(tool._id);
      newTool.status = 1;
    }
    newOrder.toolId = lstTool
    updateOrder(newOrder);
    updateTool(newTool);
  }
  onClickRow = (tool) => {
    this.setState({
      filenameImageTool: tool.images
    })
  }
  onChange = (e) => {
    const countFile = e.target.files.length;
    let arrayFile = [];
    let totalSize = 0;
    for (let i = 0; i < countFile; i++) {
      arrayFile.push(e.target.files[i])
      totalSize = totalSize + e.target.files[i].size;
      if (totalSize < limitSizeImage) {
        this.setState({
          listFile: [...this.state.listFile, arrayFile]
        })
      } else {
        alert('Tổng dung lượng ảnh lớn hơn 10Mb, vui lòng chọn ảnh khác...');
        break;
      }
    }
  }
  onSubmit = (e) => {
    e.preventDefault() // Stop form submit
    const { imageActionsCreator } = this.props;
    const { uploadImages } = imageActionsCreator;
    if (this.state.listFile && this.state.listFile.length > 0) {
      var { listFile } = this.state;
      uploadImages(listFile);
      this.setState({
        listFile: null,
      })
    } else {
      alert('Vui lòng chọn ảnh ...')
    }
  }
  becomeLargeImage=(filename)=> {
    this.setState({
      largeImage: filename,
    })
  }
  handleSearch = (event) => {
    const { toolActionCreator } = this.props;
    const { dataSearch } = this.state;
    const { searchToolsSuccess } = toolActionCreator;
    let search = {
      ...dataSearch,
      [event.target.name]: event.target.value
    }
    this.setState({ dataSearch: search });
    searchToolsSuccess([], search);
  }

  render() {
    const { tools, classes } = this.props;
    const { columnsGrid, dataSearch } = this.state;
    return (
      <Fragment>
        <div className={classes.content}>
          <div className="box-search">
            <div className="lb-search">Search</div>
            <div className="field-search">
              <TextField
                fullWidth
                id="search_name"
                name="name"
                label="Công cụ"
                variant="filled"
                onInput={this.handleSearch}
              />
            </div>
            <div className="field-search">
              <TextField
                fullWidth
                id="search_manufacturer"
                name="manufacturer"
                label="Hãng"
                variant="filled"
                onInput={this.handleSearch}
              />
              </div>
            <div className="field-search">
              <TextField
                fullWidth
                id="search_type"
                name="type"
                label="Loại"
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
                  <option value="all">Tất cả</option>
                  <option value="false">READY</option>
                  <option value="true">IN USE</option>
                </Select>
              </FormControl>
            </div>
          </div>
          <Grid className={classes.dataTable}>
            <DataTable
              noHeader={true}
              keyField={'_id'}
              columns={columnsGrid}
              data={this.generateTools(tools)}
              striped={true}
              pagination
              paginationPerPage={20}
              paginationRowsPerPageOptions={[10, 20, 50]}
            />
          </Grid>
        </div>
      </Fragment>
    );
  }
  generateTools = (tools) => {
    const { order } = this.props;
    const { dataSearch } = this.state;
    let _tools = JSON.parse(JSON.stringify(tools.filter(t => 
      t.name.toLowerCase().indexOf(dataSearch.name.toLowerCase()) > -1 &&
      t.manufacturer.toLowerCase().indexOf(dataSearch.manufacturer.toLowerCase()) > -1 &&
      t.type.toLowerCase().indexOf(dataSearch.type.toLowerCase()) > -1
    )));
    if (dataSearch.status && dataSearch.status !== 'all'){
      _tools = _tools.filter(t => {
        t.status = t.status || false
        return dataSearch.status === t.status + ''
      })
    }
    if (order && order.toolId && order.toolId.length > 0) {
      let lstIdTool = order.toolId
      if (order.toolId[0]._id) {
        lstIdTool = order.toolId.map(t => t._id)
      }
      _tools.filter(t => t.status).forEach(t => {
        t.hasTool = lstIdTool.indexOf(t._id) > -1;
      })
    }
    return _tools;
  }
}
const mapStateToProps = (state, ownProps) => {
  return {
    tools: state.tools.tools,
    user: state.auth.user,
    order: state.orders.order
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    toolActionCreator: bindActionCreators(toolActions, dispatch),
    modalActionsCreator: bindActionCreators(modalActions, dispatch),
    imageActionsCreator: bindActionCreators(imageActions, dispatch),
    orderActionsCreator: bindActionCreators(OrderActions, dispatch)
  }
}


const withConnect = connect(mapStateToProps, mapDispatchToProps);
export default compose(
  withStyles(styles),
  withConnect,
)(Tools);