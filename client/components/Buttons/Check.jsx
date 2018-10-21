import React from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import {
  withStyles,
  MuiThemeProvider,
  createMuiTheme
} from '@material-ui/core/styles';
import Icon from '@material-ui/core/Icon';
import Search from '@material-ui/icons/Search';
import green from '@material-ui/core/colors/green';

const styles = theme => ({
  button: {
    margin: theme.spacing.unit
  },
  rightIcon: {
    marginLeft: theme.spacing.unit
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

function CheckButton(props) {
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
          Find Duplicates
          <Icon className={classes.rightIcon}>
            <Search />
          </Icon>
        </Button>
      </MuiThemeProvider>
    </div>
  );
}

CheckButton.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(CheckButton);
