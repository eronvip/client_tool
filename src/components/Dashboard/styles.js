const styles = (theme) => ({
  wrapper: {
      display: 'flex',
      flexDirection: 'row',
      height: '100vh',
    },
  wrapperContent: {
    position:'fixed',
    left:0,
    width:'100%',
    padding: '8px',
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeIn,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  dashboard:{

    display:'block',
    position:'fixed',
    height:'100vh',
  },
  shiftLeft:{
   //marginLeft: "-240px",
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.shape,
      duration: theme.transitions.duration.leavingScreen
    })
  }
   
  });
  
  export default styles;
  