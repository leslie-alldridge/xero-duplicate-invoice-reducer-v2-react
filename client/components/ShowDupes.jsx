import React from 'react';
import request from '../utils/api';
import PropTypes from 'prop-types';

import Loading from './Loading';
import SwitchToggle from './Buttons/Switch';
import CheckButton from './Buttons/Check';
import Notification from './Snackbar';
import ErrSnackbar from './ErrSnackbar';
import SimpleModalWrapped from './Modals/Modal';

import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto'
  },
  table: {
    minWidth: 700
  }
});

class DupeTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      duplicates: this.props.duplicates
    };
  }

  handleClose() {
    this.setState({
      snackbar: false,
      error: false
    });
  }

  openModal() {
    this.setState({
      open: true
    });
  }

  render() {
    const { classes } = this.props;
    return (
      <div>
        {!this.state.loading && (
          <p>
            You're now viewing: <b>Summarized invoices</b>
          </p>
        )}
        {/* {this.state.apiLimit &&
          'Xero API Limit reached, please wait sixty seconds for it to reset'}
        <Paper className={classes.root}>
          {!this.state.loading && (
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell numeric>Create Invoice</TableCell>
                  <TableCell numeric>Date</TableCell>
                  <TableCell numeric>Due Date</TableCell>
                  <TableCell numeric>Contact</TableCell>
                  <TableCell numeric>Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {this.state.invoices.map(invoice => {
                  if (
                    invoice.InvoiceNumber !== 'Expense Claims' &&
                    this.state.type == invoice.Type
                  ) {
                    return (
                      <TableRow key={invoice.InvoiceID}>
                        <TableCell numeric>I'm a dupe</TableCell>
                        <TableCell numeric>
                          {this.state.type == 'ACCREC' && (
                            <a
                              href={`https://go.xero.com/AccountsReceivable/View.aspx?invoiceid=${
                                invoice.InvoiceID
                              }`}
                              target="_blank"
                            >
                              {invoice.InvoiceNumber}
                            </a>
                          )}
                          {this.state.type == 'ACCPAY' && (
                            <a
                              href={`https://go.xero.com/AccountsPayable/View.aspx?invoiceid=${
                                invoice.InvoiceID
                              }`}
                              target="_blank"
                            >
                              {invoice.InvoiceNumber || 'No reference'}
                            </a>
                          )}
                        </TableCell>
                        <TableCell numeric>
                          {invoice.DateString.slice(0, 10)}
                        </TableCell>
                        <TableCell numeric>
                          {invoice.DueDateString.slice(0, 10)}
                        </TableCell>
                        <TableCell numeric>
                          {String(invoice.Contact.Name).length > 10
                            ? String(invoice.Contact.Name).substring(0, 10) +
                              '...'
                            : invoice.Contact.Name}
                        </TableCell>
                        <TableCell numeric>${invoice.Total}</TableCell>
                      </TableRow>
                    );
                  }
                })}
              </TableBody>
            </Table>
          )}
          {this.state.loading && <Loading />}
          <div id="buttons">
            <CheckButton
              onClick={() => {
                this.findDupes();
              }}
            />
          </div>
          <SwitchToggle
            checked={this.state.checkedA}
            toggle={this.handleToggle}
          />
          <Notification
            handleClose={this.handleClose}
            open={this.state.snackbar}
          />
        </Paper>
        <p style={{ color: '#3f51b5' }} onClick={this.openModal}>
          Need help? Click here
        </p>
        {this.state.open && (
          <SimpleModalWrapped open={this.state.open} close={this.closeModal} />
        )}
        {this.state.error && (
          <ErrSnackbar handleClose={this.handleClose} open={this.state.error} />
        )} */}
      </div>
    );
  }
}

DupeTable.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(DupeTable);
