import React, { Component, Fragment, } from 'react';

import { connect } from 'react-redux';
import * as toolActions from '../../actions/toolActions';
import * as imageActions from '../../actions/imageActions';
import * as modalActions from '../../actions/modal';
import * as OrderActions from '../../actions/orderActions';
import { bindActionCreators, compose } from 'redux';
import ToolForm from '../ToolForm';
import { Grid, withStyles, Fab } from '@material-ui/core';
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
      columnsGrid: [
        { selector: 'name', name: 'Tên công cụ', width: 'calc((100% - 120px) / 3)', sortable: true },
        { selector: 'manufacturer', name: 'Hãng' , width: 'calc((100% - 120px) / 3)', sortable: true },
        { selector: 'type', name: 'Loại', width: 'calc((100% - 120px) / 3)', sortable: true },
        { name: 'Hành động', width: '120px',
          cell: (param) => {
            let data = JSON.parse(JSON.stringify(param))
            const { classes, match: { params } } = this.props;
            return <>
              {
                params.orderId ?
                <>
                  <Fab
                    color="default"
                    aria-label="Thêm vào WO"
                    size='small'
                    onClick={() => {
                      this.onClickWorkOrder(data)
                    }}
                  >
                    {
                      data.hasTool ?
                      <Remove color="error" fontSize="small" />
                      :
                      <Add className={classes.colorSuccess} fontSize="small" />
                    }
                  </Fab>
                </>
                :
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
    const { orderActionsCreator, order } = this.props;
    const { addOrder, updateOrder } = orderActionsCreator;
    const newOrder = JSON.parse(JSON.stringify(order));
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
    } else {
      lstTool.unshift(tool._id);
    }
    newOrder.toolId = lstTool
    updateOrder(newOrder);
    // if (orderEditting) {
    //   updateOrder(newOrder);
    // } else {
    //   addOrder(newOrder);
    // }
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
  render() {
    const { tools, classes } = this.props;
    const { columnsGrid } = this.state;
    return (
      <Fragment>
        <div className={classes.content}>
          <Grid className={classes.dataTable}>
            <DataTable
              noHeader={true}
              keyField={'_id'}
              columns={columnsGrid}
              data={this.genarateTools(tools)}
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
  genarateTools = (tools) => {
    const { order } = this.props;
    let _tools = JSON.parse(JSON.stringify(tools));
    if (order && order.toolId && order.toolId.length > 0) {
      let lstIdTool = order.toolId
      if (order.toolId[0]._id) {
        lstIdTool = order.toolId.map(t => t._id)
      }
      _tools.forEach((tool) => {
        tool.hasTool = lstIdTool.indexOf(tool._id) > -1;
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