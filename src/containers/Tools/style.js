const style = (theme) => ({
  content: {
    marginTop: '65px',
    maxHeight: '60vh',
  },
  background: {
    backgroundColor: theme.palette.primary.main,
    padding: 40,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    textAlign: 'center',
    flex: '1 0 auto',
  },
  alert: {
    display: 'flex',
    margin: '10px',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  login: {
    maxWidth: '600px',
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },

  gridList: {
    flexWrap: 'nowrap',
    // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
    transform: 'translateZ(0)',
  },
  test: {
    minHeight: '40vh'
  },
  showImageProduct: {
    width: '50vw',
    height: '50vh',

  },
  showImageProduct1: {
    height: '100%',
  },
  boxImage: {
    display: 'block',
    marginTop: '20px',
    height: '100vw*0.5',
    width: '100%',
    maxWidth: '600px',
    
  },

  largeImage: {
    display: 'flex',
    direction: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    height: '60%',
    width: '100%',
  },
  imgLarge: {
    //width: '100%',
    height: '30vh',
  },
  smallImage: {
    display: 'flex',
    //direction: 'row',
    //justifyContent:"center",
    height: '40%',
    width: '100%',
    padding: '10px',
    overflowY: 'scroll',
  },

  itemSmallImage: {
    //display: 'inline',
    //width: '100px',
    height: '15vh',
    //minWidth: '30%',
    //height: '50%'
  },
  imgSmall:{
    height:'100%',
  },
  showDetail: {
    width: '50vw',
    //position:'fixed',
    top: 50,
    right: 0,
    bottom: 'auto',
    minHeight: '50vh',
  },

  showTable: {
    width: '100%'
  },
  
  widthIcon: {
    width: '50px'
  },
  
  widthInput: {
    width: 'calc(100% - 50px)'
  },

  width100per: {
    width: '100%'
  }
});
export default style;
