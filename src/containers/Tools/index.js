import React, { Component, Fragment, } from 'react';

import { connect } from 'react-redux';
import * as toolActions from '../../actions/toolActions';
import * as imageActions from '../../actions/imageActions';
import * as modalActions from '../../actions/modal';
import * as OrderActions from '../../actions/orderActions';
import { bindActionCreators, compose } from 'redux';
import ToolForm from '../ToolForm';
import { Grid, withStyles, TextField, Fab } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import styles from './style';
import { limitSizeImage } from '../../constants';
import { DeleteForever, ShoppingCart, Edit } from '@material-ui/icons';
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
        { selector: 'toolId', name: 'Tool ID', width: 100 },
        { selector: 'name', name: 'Tên công cụ', width: 500 },
        { selector: 'manufacturer', name: 'Hãng' , width: 500 },
        { selector: 'type', name: 'Loại', width: 500 },
        { name: 'Hành động', width: 500,
          cell: (params) => {
            let data = JSON.parse(JSON.stringify(params))
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
  onClickWorkOrder = (tools) => {
    const { orderActionsCreator, user } = this.props;
    const { addOrder } = orderActionsCreator;
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
    const { tools, classes, match: { params } } = this.props;
    const { columnsGrid } = this.state;
    return (
      <Fragment>
        <div className={classes.content}>
          <Grid className={classes.newheight}>
            <DataTable
              noHeader={true}
              className={classes.datatable}
              keyField={'_id'}
              columns={columnsGrid}
              data={tools}
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
  gentool = (tools) => {
    let _tool = JSON.parse(JSON.stringify(tools.map((i, index) => ({...i, id: index}))));
    return _tool
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