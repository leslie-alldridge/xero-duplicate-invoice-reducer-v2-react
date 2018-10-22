import React from 'react';
import request from '../utils/api';
import PropTypes from 'prop-types';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';

import Loading from './Loading';
import Snackbar from './Snackbar';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import InputLabel from '@material-ui/core/InputLabel';
import AddComment from '@material-ui/icons/AddComment';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import Switch from '@material-ui/core/Switch';

const styles = theme => ({
  layout: {
    width: 'auto',
    display: 'block',
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 400,
      marginLeft: 'auto',
      marginRight: 'auto'
    }
  },
  paper: {
    marginTop: theme.spacing.unit * 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme
      .spacing.unit * 3}px`
  },
  avatar: {
    margin: theme.spacing.unit,
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: '100%',
    marginTop: theme.spacing.unit
  },
  input: {
    marginBottom: '10px'
  },
  submit: {
    marginTop: theme.spacing.unit * 3
  }
});

class Form extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      total: this.props.total,
      name: this.props.name,
      date: this.props.date,
      due: this.props.due,
      type: this.props.type,
      reference: '',
      accountcode: '',
      itemcode: '',
      description: 'Daily sales',
      quantity: 1,
      status: 'DRAFT',
      classes: this.props.classes,
      moreDetails: false,
      checked: true,
      checked2: true,
      loading: false,
      open: true,
      success: false,
      error: false
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleDetails = this.handleDetails.bind(this);
    this.handleToggle = this.handleToggle.bind(this);
    this.handleToggleStatus = this.handleToggleStatus.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }
  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  handleClose() {
    this.setState({
      open: false,
      success: false
    });
  }

  handleClick(e) {
    const state = this.state;
    let obj = {
      total: state.total,
      name: state.name,
      date: state.date,
      due: state.due,
      reference: state.reference,
      accountcode: state.accountcode,
      itemcode: state.itemcode,
      type: state.type,
      description: state.description,
      status: state.status
    };
    e.preventDefault();
    this.setState({
      loading: true
    });
    request('post', `/createinvoice`, obj).then(res => {
      if (res.body == 'Invoice created') {
        this.setState({
          loading: false,
          success: true
        });
      } else {
        this.setState({
          loading: false,
          error: true
        });
      }
    });
  }

  handleDetails() {
    this.setState({
      handleDetails: true
    });
  }

  handleToggle() {
    this.setState({
      type: this.state.type == 'ACCREC' ? 'ACCPAY' : 'ACCREC',
      checked: !this.state.checked
    });
  }

  handleToggleStatus() {
    this.setState({
      status: this.state.status == 'DRAFT' ? 'AUTHORISED' : 'DRAFT',
      checked2: !this.state.checked2
    });
  }

  render() {
    return (
      <React.Fragment>
        <CssBaseline />
        <main className={this.state.classes.layout}>
          {!this.state.loading && (
            <Paper className={this.state.classes.paper}>
              <Avatar className={this.state.classes.avatar}>
                <AddComment />
              </Avatar>
              <Typography variant="headline">
                Save invoice or add details
              </Typography>
              <ValidatorForm
                onSubmit={this.handleClick}
                name="Form"
                action="/createinvoice"
                method="POST"
                className={this.state.classes.form}
              >
                <InputLabel htmlFor="type">
                  Invoice Type: {this.state.type}
                </InputLabel>
                <Switch
                  checked={this.state.checked}
                  onChange={this.handleToggle}
                  value={this.state.type}
                  color="primary"
                />
                <br />
                <InputLabel htmlFor="total">Invoice Total</InputLabel>
                <TextValidator
                  autoFocus={true}
                  className={this.state.classes.input}
                  fullWidth
                  onChange={this.handleChange}
                  id="total"
                  name="total"
                  value={this.state.total || ''}
                  validators={['required']}
                  errorMessages={['this field is required']}
                />
                <InputLabel htmlFor="Description">Description</InputLabel>
                <TextValidator
                  autoFocus={true}
                  className={this.state.classes.input}
                  fullWidth
                  onChange={this.handleChange}
                  id="description"
                  name="description"
                  value={this.state.description || ''}
                />
                <InputLabel htmlFor="name">Name</InputLabel>
                <TextValidator
                  className={this.state.classes.input}
                  validators={['required']}
                  fullWidth
                  errorMessages={['this field is required']}
                  onChange={this.handleChange}
                  name="name"
                  id="name"
                  value={this.state.name || ''}
                  autoComplete="current-name"
                />
                <InputLabel htmlFor="Date">Date</InputLabel>
                <TextValidator
                  className={this.state.classes.input}
                  validators={['required']}
                  fullWidth
                  errorMessages={['this field is required']}
                  onChange={this.handleChange}
                  name="date"
                  id="date"
                  value={this.state.date || ''}
                  autoComplete="current-date"
                />
                <InputLabel htmlFor="Due Date">Due Date</InputLabel>
                <TextValidator
                  className={this.state.classes.input}
                  validators={['required']}
                  fullWidth
                  errorMessages={['this field is required']}
                  onChange={this.handleChange}
                  name="due"
                  id="due"
                  value={this.state.due || ''}
                  autoComplete="current-due"
                />
                {this.state.handleDetails && (
                  <div>
                    <InputLabel htmlFor="reference">Reference</InputLabel>
                    <TextValidator
                      className={this.state.classes.input}
                      fullWidth
                      onChange={this.handleChange}
                      name="reference"
                      id="reference"
                      autoComplete="current-reference"
                    />
                    <InputLabel htmlFor="accountcode">Account Code</InputLabel>
                    <TextValidator
                      className={this.state.classes.input}
                      fullWidth
                      onChange={this.handleChange}
                      name="accountcode"
                      id="accountcode"
                      autoComplete="current-accountcode"
                    />
                    <InputLabel htmlFor="itemcode">Item Code</InputLabel>
                    <TextValidator
                      className={this.state.classes.input}
                      fullWidth
                      onChange={this.handleChange}
                      name="itemcode"
                      id="itemcode"
                      autoComplete="current-itemcode"
                    />
                    <InputLabel htmlFor="status">
                      Invoice Status: {this.state.status}
                    </InputLabel>
                    <Switch
                      checked={this.state.checked2}
                      onChange={this.handleToggleStatus}
                      value={this.state.status}
                      color="primary"
                    />
                    <p id="note">
                      <i>
                        <b>Please Note</b>: Approved invoices must have a{' '}
                        <u>due date</u> and <u>account code</u> to be saved
                        successfully.
                      </i>
                    </p>
                  </div>
                )}
                <Button
                  onClick={this.handleDetails}
                  fullWidth
                  variant="raised"
                  color="primary"
                  className={this.state.classes.submit}
                >
                  Add Details..
                </Button>
                <Button
                  onClick={this.props.handleBack}
                  fullWidth
                  variant="raised"
                  color="primary"
                  className={this.state.classes.submit}
                >
                  Go Back
                </Button>

                <Button
                  type="submit"
                  fullWidth
                  variant="raised"
                  color="primary"
                  className={this.state.classes.submit}
                >
                  Save Invoice
                </Button>
              </ValidatorForm>
              {this.state.success && (
                <Snackbar
                  open={this.state.open}
                  handleClose={this.handleClose}
                />
              )}
              {this.state.error && <h1>An error occurred.</h1>}
            </Paper>
          )}
          {this.state.loading && <Loading />}
        </main>
      </React.Fragment>
    );
  }
}
Form.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Form);
