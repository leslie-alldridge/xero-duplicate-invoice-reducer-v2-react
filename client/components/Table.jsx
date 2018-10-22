import React from 'react';
import request from '../utils/api';
import PropTypes from 'prop-types';

import Loading from './Loading';
import SwitchToggle from './Buttons/Switch';
import XeroButton from './Buttons/Send';
import RetrieveButton from './Buttons/Retrieve';
import CheckButton from './Buttons/Check';
import Notification from './Snackbar';
import ErrSnackbar from './ErrSnackbar';
import SimpleModalWrapped from './Modals/Modal';
import NoDupesModal from './Modals/NoDupes';
import ShowDupes from './ShowDupes';

import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import ArrowBackIos from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIos from '@material-ui/icons/ArrowForwardIos';

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

class InvoiceTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 0,
      rows: [],
      invoices: [],
      type: 'ACCREC',
      loading: false,
      apiLimit: false,
      error: false,
      checkedA: true,
      selected: [],
      snackbar: false,
      page: 1,
      open: false,
      duplicates: [],
      noDupes: false,
      showDupes: false
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleToggle = this.handleToggle.bind(this);
    this.handleSelectAllClick = this.handleSelectAllClick.bind(this);
    this.boxChange = this.boxChange.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleChangePage = this.handleChangePage.bind(this);
    this.handleChangePageBack = this.handleChangePageBack.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.findDupes = this.findDupes.bind(this);
    this.closeDupeModal = this.closeDupeModal.bind(this);
    this.swapPage = this.swapPage.bind(this);
  }

  findDupes() {
    let apiInfo = this.state.rows;
    let data = {};
    for (let i = 0; i < apiInfo.length; i++) {
      let invoice = apiInfo[i];
      let name = invoice.Contact.Name;
      let date = invoice.DateString.slice(0, 10);
      if (!data.hasOwnProperty(name))
        data[name] = {
          total: 0,
          name,
          dates: []
        };
      if (!data[name]['dates'].hasOwnProperty(date)) {
        data[name]['dates'][date] = {
          total: 0,
          invoices: []
        };
      }
      data[name].total += Number(invoice.Total);
      data[name]['dates'][date].total += Number(invoice.Total);
      data[name]['dates'][date].invoices.push(invoice);
    }
    for (let i = 0; i < apiInfo.length; i++) {
      let invoice = apiInfo[i];
      let name = invoice.Contact.Name;
      let date = invoice.DateString.slice(0, 10);
      if (data[name]['dates'][date].invoices.length <= 1) {
        data[name]['dates'][date].invoices.pop();

        data[name].total = data[name].total - data[name]['dates'][date].total;
        data[name]['dates'][date].total = 0;
      }
    }

    let names = Object.keys(data);
    names.forEach(name => {
      let dates = Object.keys(data[name].dates);
      data[name].datesList = dates.map(date => {
        data[name]['dates'][date].date = date;
        return data[name]['dates'][date];
      });
    });
    names.forEach(names => {
      let amount = data[names].total;
      if (amount <= 0) {
        delete data[names];
      }
    });
    let newData = [];
    Object.keys(data).forEach(function(key) {
      newData.push(data[key]);
    });
    if (Object.keys(data).length < 1) {
      this.setState({
        loading: false,
        noDupes: true
      });
    } else {
      this.setState(
        {
          duplicates: newData,
          loading: true
        },
        () => {
          setTimeout(() => {
            this.swapPage();
          }, 50);
        }
      );
    }
  }

  swapPage() {
    setTimeout(() => {
      if (this.state.duplicates.length < 1) {
        this.setState({
          noDupes: true,
          loading: false
        });
      } else if (this.state.duplicates.length >= 1) {
        this.setState({
          showDupes: true,
          loading: false
        });
      } else {
        this.setState({
          loading: false
        });
      }
    }, 150);
  }

  handleClick() {
    this.setState({
      loading: true
    });
    request('get', `/invoices/${this.state.page}`)
      .then(res => {
        this.setState({
          error: false,
          loading: false,
          invoices: res.body.Invoices,
          checkedA: !this.state.checkedA,
          rows: res.body.Invoices.filter(
            invoice =>
              invoice.Type !== 'ACCPAY' &&
              invoice.InvoiceNumber !== 'Expense Claims'
          )
        });
      })
      .catch(err => {
        this.setState({
          error: true,
          loading: false
        });
      });
  }

  handleChangePage() {
    this.setState({
      loading: true,
      page: this.state.page + 1
    });
    request('get', `/invoices/${this.state.page + 1}`)
      .then(res => {
        this.setState({
          error: false,
          loading: false,
          voidConfirm: false,
          invoices: res.body.Invoices,
          checkedA: !this.state.checkedA,
          rows: res.body.Invoices.filter(
            invoice =>
              invoice.Type !== 'ACCPAY' &&
              invoice.InvoiceNumber !== 'Expense Claims'
          )
        });
      })
      .catch(err => {
        this.setState({
          error: true,
          loading: false
        });
      });
  }

  handleChangePageBack() {
    this.setState({
      loading: true,
      page: this.state.page - 1
    });
    request('get', `/invoices/${this.state.page - 1}`)
      .then(res => {
        this.setState({
          error: false,
          loading: false,
          invoices: res.body.Invoices,
          checkedA: !this.state.checkedA,
          voidConfirm: false,
          rows: res.body.Invoices.filter(
            invoice =>
              invoice.Type !== 'ACCPAY' &&
              invoice.InvoiceNumber !== 'Expense Claims'
          )
        });
      })
      .catch(err => {
        this.setState({
          error: true,
          loading: false
        });
      });
  }

  handleToggle(name, e) {
    this.setState({
      type: this.state.type == 'ACCREC' ? 'ACCPAY' : 'ACCREC',
      checkedA: !this.state.checkedA,
      rows: this.state.invoices.filter(
        invoice =>
          invoice.Type !== this.state.type &&
          invoice.InvoiceNumber !== 'Expense Claims'
      ),
      selected: []
    });
  }

  handleSelectAllClick(event) {
    if (event.target.checked == true) {
      this.setState({
        selected: this.state.rows.map(inv => inv.InvoiceID)
      });
    } else {
      return this.setState({
        selected: []
      });
    }
  }

  boxChange(inv) {
    this.state.selected.includes(inv)
      ? this.setState({
          selected: this.state.selected.filter(invoice => invoice !== inv)
        })
      : this.setState({
          selected: this.state.selected.concat(inv)
        });
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

  closeModal() {
    this.setState({
      open: false
    });
  }

  closeDupeModal() {
    this.setState({
      noDupes: false
    });
  }

  render() {
    const { classes } = this.props;
    const rowCount = this.state.rows.length;
    return (
      <div>
        {this.state.showDupes && (
          <ShowDupes type={this.state.type} data={this.state.duplicates} />
        )}

        {!this.state.loading &&
          !this.state.showDupes && (
            <p>
              You're now viewing:{' '}
              {this.state.type == 'ACCREC' ? (
                <b>
                  Accounts Receivable -{' '}
                  {this.state.page > 1 && (
                    <ArrowBackIos
                      style={{
                        color: '#3f51b5',
                        marginTop: '10px',
                        paddingTop: '10px'
                      }}
                      onClick={this.handleChangePageBack}
                    />
                  )}
                  Page {this.state.page}{' '}
                  {rowCount >= 100 && (
                    <ArrowForwardIos
                      style={{
                        color: '#3f51b5',
                        marginTop: '10px',
                        paddingTop: '10px'
                      }}
                      onClick={this.handleChangePage}
                    />
                  )}
                </b>
              ) : (
                <b>
                  Accounts Payable -
                  {this.state.page > 1 && (
                    <ArrowBackIos
                      style={{
                        color: '#3f51b5',
                        marginTop: '10px',
                        paddingTop: '10px'
                      }}
                    />
                  )}{' '}
                  Page {this.state.page}{' '}
                  {rowCount >= 100 && (
                    <ArrowForwardIos
                      style={{
                        color: '#3f51b5',
                        marginTop: '10px',
                        paddingTop: '10px'
                      }}
                      onClick={this.handleChangePage}
                    />
                  )}
                </b>
              )}
            </p>
          )}
        {this.state.apiLimit &&
          'Xero API Limit reached, please wait sixty seconds for it to reset'}
        <Paper className={classes.root}>
          {!this.state.loading &&
            !this.state.showDupes && (
              <Table className={classes.table}>
                <TableHead>
                  <TableRow>
                    {this.state.type == 'ACCREC' && (
                      <TableCell numeric>Invoice Number</TableCell>
                    )}
                    {this.state.type == 'ACCPAY' && (
                      <TableCell numeric>Bill Reference</TableCell>
                    )}
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
          {!this.state.showDupes && (
            <div id="buttons">
              <XeroButton />
              <RetrieveButton onClick={this.handleClick} />
              <CheckButton
                onClick={() => {
                  this.findDupes();
                }}
              />
            </div>
          )}
          {!this.state.showDupes && (
            <SwitchToggle
              checked={this.state.checkedA}
              toggle={this.handleToggle}
            />
          )}
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
        {this.state.noDupes && (
          <NoDupesModal open={this.state.noDupes} close={this.closeDupeModal} />
        )}
        {this.state.error && (
          <ErrSnackbar handleClose={this.handleClose} open={this.state.error} />
        )}
      </div>
    );
  }
}

InvoiceTable.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(InvoiceTable);
