import React, { Component, Fragment, } from 'react';

import { connect } from 'react-redux';
import * as toolActions from '../../actions/toolActions';
import * as imageActions from '../../actions/imageActions';
import * as modalActions from '../../actions/modal';
import { bindActionCreators, compose } from 'redux';
import ToolList from '../../components/Tools/Toollist';
import ToolItem from '../../components/Tools/ToolItems';
import ToolForm from '../ToolForm';
import { Grid, Paper, withStyles, GridList, GridListTile, Box } from '@material-ui/core';
import styles from './style';
import { limitSizeImage } from '../../constants';

class Tools extends Component {
  constructor(props) {
    super(props)
    this.state = {
      listFile: [],
      filenameImageTool: [],
      largeImage:'',
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
    deleteTool(tool);
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
    const { filenameImageTool } = this.state;
    return (
      <Fragment>
        <div className={classes.content}>
          <Grid container spacing={1} className={classes.test}>
            <Grid item xs={6} md={6} className={classes.showImageTool} >
              <Box border={1} className={classes.boxImage}>
                <Box border={1} className={classes.largeImage}>
                 
                  <img src={`http://localhost:5000/api/upload/image/${this.state.largeImage}`} alt='hoa-dep' className={classes.imgLarge} />
                </Box>
                <Box border={1} className={classes.smallImage}>
                  {filenameImageTool.map((image,index) => (
                    <Box border={1} className={classes.itemSmallImage} mr={1} key={index}  >
                      <img src={`http://localhost:5000/api/upload/image/${image.filename}`} alt={image.name} 
                      className={classes.imgSmall} 
                      onClick={()=>this.becomeLargeImage(image.filename)}
                      key={image.filename}
                      />
                    </Box>
                  ))}
                </Box>
              </Box>
              {/* <Paper className={classes.paper}>
                hien thi hinh anh o day
                <div>
                  <GridList cellHeight={160} className={classes.gridList} cols={3}>
                    {filenameImageTool.map((image) => (
                      <GridListTile key={image._id} cols={2 || 1}>
                        <img src={`https://api.yensaochampa.icu/api/upload/image/${image.filename}`} alt={image.name} />
                      </GridListTile>
                    ))}
                  </GridList>
                </div>
              </Paper> */}

            </Grid>
            <Grid item xs={6} md={6} className={classes.showDetail}>
              <Paper className={classes.paper}>
                hien thi Chi tiet san pham o day
                <div className={classes.showImageTool}>
                  <GridList cellHeight={160} className={classes.gridList} cols={3}>
                    {filenameImageTool.map((image) => (
                      <GridListTile key={image._id} cols={2 || 1}>
                        <img src={`http://localhost:5000/api/upload/image/${image.filename}`} alt={image.name} />
                      </GridListTile>
                    ))}
                  </GridList>
                </div>
              </Paper>
            </Grid>
          </Grid>
          <Grid
            item
            // xs={12} 
            // md={12} 
            className={classes.showTable}>
            <Paper className={classes.paper}>
              <ToolList>
                {this.showTools(tools)}
              </ToolList>
            </Paper>
          </Grid>

        </div>
      </Fragment>
    );
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
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    toolActionCreator: bindActionCreators(toolActions, dispatch),
    modalActionsCreator: bindActionCreators(modalActions, dispatch),
    imageActionsCreator: bindActionCreators(imageActions, dispatch)
  }
}


const withConnect = connect(mapStateToProps, mapDispatchToProps);
export default compose(
  withStyles(styles),
  withConnect,
)(Tools);