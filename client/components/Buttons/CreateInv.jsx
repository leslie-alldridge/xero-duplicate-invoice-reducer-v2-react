import React from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import {
  withStyles,
  MuiThemeProvider,
  createMuiTheme
} from '@material-ui/core/styles';
import Icon from '@material-ui/core/Icon';
import AddCircleOutline from '@material-ui/icons/AddCircleOutline';
import green from '@material-ui/core/colors/green';

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
    maxWidth: '50%'
  }
});

const theme = createMuiTheme({
  palette: {
    primary: green,
    color: 'white'
  },
  typography: {
    useNextVariants: true
  }
});

function CreateInv(props) {
  const { classes } = props;
  return (
    <div>
      <MuiThemeProvider theme={theme}>
        <Button
          variant="contained"
          color="primary"
          className={classes.button}
          onClick={props.onClick}
        >
          <Icon>
            <AddCircleOutline />
          </Icon>
        </Button>
      </MuiThemeProvider>
    </div>
  );
}

CreateInv.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(CreateInv);
