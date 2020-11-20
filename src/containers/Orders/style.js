const style = (theme) => ({
  content: {
    marginTop: '65px'
  },
  dataTable: {
    '& .rdt_Table': {
      '& .rdt_TableHead': {
        position: 'fixed',
        width: 'calc(100% - 16px)',
        zIndex: 1,
        borderTop: '1px solid rgba(0,0,0,.12)',
        '& .rdt_TableCol': {
          borderLeft: '1px solid rgba(0,0,0,.12)',
          '&:last-child': {
            borderRight: '1px solid rgba(0,0,0,.12)'
          }
        }
      },
      '& .rdt_TableBody': {
        marginTop: '57px',
        borderTop: '1px solid rgba(0,0,0,.12)',
        height: 'calc(100vh - 186px)',
        overflowY: 'overlay !important',
        '& .rdt_TableCell': {
          borderLeft: '1px solid rgba(0,0,0,.12)',
          '&:last-child': {
            borderRight: '1px solid rgba(0,0,0,.12)'
          }
        },
        '& .rdt_TableRow:last-child': {
          borderBottom: '1px solid rgba(0,0,0,.12)'
        }
      }
    },
  },
});
export default style;