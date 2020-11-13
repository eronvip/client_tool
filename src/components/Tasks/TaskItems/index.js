import React, { Component } from 'react';
import {
  withStyles,
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Fab,
  Icon,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import styles from './styles';

class TaskItem extends Component {
  render() {
    const { classes, tasks, status, onClickEdit, onClickDelete } = this.props;
    const { id, title, description } = tasks;
    return (
      <Card key={id} className={classes.card}>
        <CardContent >
          <Grid container justify="space-between">
            <Grid item md={8}>
              <Typography component="h2">{title}</Typography>
            </Grid>
            <Grid item md={4}>
              <Typography component="h2">{status}</Typography>
            </Grid>
          </Grid>
          <p>{description}</p>
        </CardContent>
        <CardActions className={classes.cardActions}>
          <Fab
            color="primary"
            aria-label="Edit"
            className={classes.fab}
            size="small"
            onClick={onClickEdit}
          >
            <Icon fontSize="small">edit_icon</Icon>
          </Fab>
          <Fab
            color="secondary"
            aria-label="Delete"
            className={classes.fab}
            size="small"
            onClick={onClickDelete}
          >
            <Icon fontSize="small">delete_icon</Icon>
          </Fab>
        </CardActions>
      </Card>
    );
  }
}
TaskItem.propTypes = {
  classes: PropTypes.object,
  tasks: PropTypes.object,
};

export default withStyles(styles)(TaskItem);
