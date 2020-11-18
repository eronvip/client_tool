import React, { Component, Fragment, } from 'react';

import { connect } from 'react-redux';
import * as toolActions from '../../actions/toolActions';
import * as imageActions from '../../actions/imageActions';
import * as modalActions from '../../actions/modal';
import * as OrderActions from '../../actions/orderActions';
import { bindActionCreators, compose } from 'redux';
import ToolList from '../../components/Tools/Toollist';
import ToolItem from '../../components/Tools/ToolItems';
import ToolForm from '../ToolForm';
import { Grid, Paper, withStyles, GridList, GridListTile, Box, TextField, Fab } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import styles from './style';
import { limitSizeImage } from '../../constants';
import { DataGrid } from '@material-ui/data-grid';
import { DeleteForever, ShoppingCart, Edit } from '@material-ui/icons';

class Tools extends Component {
  constructor(props) {
    super(props)
    this.state = {
      listFile: [],
      filenameImageTool: [],
      largeImage:'',
      searchTerm: '',
      columnsGrid: [
        { field: 'toolId', headerName: 'Tool ID', width: 100 },
        { field: 'name', headerName: 'Tên công cụ', width: 500 },
        { field: 'manufacturer', headerName: 'Hãng' , width: 500 },
        { field: 'type', headerName: 'Loại', width: 500 },
        { field: 'action', headerName: 'Hành động', width: 500,
          renderCell: (params) => {
            let data = JSON.parse(JSON.stringify(params.data))
            const { classes } = this.props;
            return <>
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
              <Fab
                color="default"
                aria-label="Thêm vào WO"
                size='small'
                onClick={() => {
                  this.onClickWorkOrder(data)
                }}
              >
                <ShoppingCart className={classes.colorSuccess} fontSize="small" />
              </Fab>
            </>
          }
        }
      ]
    }
  }

  componentDidMount() {
    const { toolActionCreator } = this.props;
    const { listAllTools } = toolActionCreator;
    listAllTools();
  }
  onClickDelete = (tool) => {
    const { toolActionCreator } = this.props;
    const { deleteTool, listAllTools } = toolActionCreator;
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
  onClickWorkOrder = (tools) => {
    const { orderActionsCreator, user } = this.props;
    const { addOrder, updateOrder } = orderActionsCreator;
    const newOrder = {
      userId: user._id,
      toolId: [tools.toolId],
      WO: "625934",
      PCT: "12/12/12",
      timeStart: (new Date()).toJSON(),
      timeStop: "12321321",
      status: "1"
    }
    addOrder(newOrder);
    // if (orderEditting) {
    //   updateOrder(newOrder);
    // } else {
    //   addOrder(newOrder);
    // }
  }
  onClickRow = (tool) => {
    console.log(tool)
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
  onChangeSearch = (e) => {
    this.setState({ searchTerm: e.target.value })
  }
  submitFilter = (e) => {
    if (e.keyCode === 13) {
      const { toolActionCreator } = this.props;
      const { listAllTools } = toolActionCreator;
      let params = {
        search: this.state.searchTerm
      }
      listAllTools(params);
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
    const { tools, classes, } = this.props;
    const { filenameImageTool, columnsGrid } = this.state;
    return (
      <Fragment>
        <div className={classes.content}>
          <Grid style={{ marginBottom: "10px" }} container spacing={1} alignItems="flex-end">
            <Grid item className={classes.widthIcon}>
              <SearchIcon />
            </Grid>
            <Grid item className={classes.widthInput}>
              <TextField className={classes.width100per} value={this.state.searchTerm} label="Tìm kiếm Công cụ" onChange={this.onChangeSearch} onKeyDown={this.submitFilter} />
            </Grid>
          </Grid>
          <Grid className={classes.newheight}>
            <DataGrid rows={this.gentool(tools)} columns={columnsGrid} pageSize={10} rowsPerPageOptions={[10,20,50]} disableSelectionOnClick />
          </Grid>
        </div>
      </Fragment>
    );
  }
  gentool = (tools) => {
    let _tool = JSON.parse(JSON.stringify(tools.map((i, index) => ({...i, id: index}))));
    return _tool
  }
  showTools = (tools) => {
    var result = null
    var { customers } = this.props;
    if (tools.length > 0) {
      result = tools.map((tool, index) => {
        return <ToolItem
          key={index}
          tool={tool}
          index={index}
          tools={tools}
          customers={customers}
          onClickDelete={() => {
            this.onClickDelete(tool)
          }}
          onClickEdit={() => {
            this.onClickEdit(tool)
          }}
          onClickRow={() => {
            this.onClickRow(tool)
          }}
        >
        </ToolItem>
      })
    }
    return result;
  }

}
const mapStateToProps = (state, ownProps) => {
  return {
    tools: state.tools.tools,
    user: state.auth.user
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