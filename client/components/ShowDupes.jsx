import React from 'react';
import PropTypes from 'prop-types';

import Loading from './Loading';
import ErrSnackbar from './ErrSnackbar';
import CreateInv from './Buttons/CreateInv';
import SimpleModalWrapped from './Modals/Modal';
import MaterialUiForm from './Form';

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
      duplicates: this.props.data || {},
      showInvoice: false,
      date: '',
      total: '',
      name: '',
      due: ''
    };
    this.createInvoice = this.createInvoice.bind(this);
    this.handleBack = this.handleBack.bind(this);
  }

  createInvoice(date, total, name, due) {
    this.setState({
      showInvoice: true,
      date,
      total,
      name,
      due
    });
  }

  handleBack() {
    this.setState({
      showInvoice: false,
      date: '',
      total: '',
      name: '',
      due: ''
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

  render() {
    const { classes } = this.props;
    return (
      <div>
        {!this.state.loading && (
          <p>
            You're now viewing: <b>Summarized invoices</b>
          </p>
        )}
        {this.state.apiLimit &&
          'Xero API Limit reached, please wait sixty seconds for it to reset'}
        <Paper className={classes.root}>
          {!this.state.loading &&
            !this.state.showInvoice && (
              <Table className={classes.table}>
                <TableHead>
                  <TableRow>
                    <TableCell>Create Invoice</TableCell>
                    <TableCell numeric>Date</TableCell>
                    <TableCell numeric>Due Date</TableCell>
                    <TableCell numeric>Contact</TableCell>
                    <TableCell numeric>Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {this.state.duplicates.map(invoice => {
                    return invoice.datesList.map(date => {
                      if (date.total !== 0) {
                        return (
                          <TableRow>
                            <TableCell>
                              <CreateInv
                                onClick={() => {
                                  this.createInvoice(
                                    date.date,
                                    date.total,
                                    invoice.name,
                                    invoice.datesList[0].invoices[0].DueDateString.slice(
                                      0,
                                      10
                                    )
                                  );
                                }}
                              />
                            </TableCell>
                            <TableCell numeric>{date.date}</TableCell>
                            <TableCell numeric>
                              {invoice.datesList[0].invoices[0].DueDateString.slice(
                                0,
                                10
                              )}
                            </TableCell>
                            <TableCell id="capital" numeric>
                              {invoice.name}
                            </TableCell>
                            <TableCell numeric>${date.total}</TableCell>
                          </TableRow>
                        );
                      }
                    });
                  })}
                </TableBody>
              </Table>
            )}
          {this.state.loading && <Loading />}
        </Paper>
        {this.state.open && (
          <SimpleModalWrapped open={this.state.open} close={this.closeModal} />
        )}
        {this.state.error && (
          <ErrSnackbar handleClose={this.handleClose} open={this.state.error} />
        )}
        {this.state.showInvoice && (
          <MaterialUiForm
            date={this.state.date}
            total={this.state.total}
            name={this.state.name}
            due={this.state.due}
            handleBack={this.handleBack}
            type={this.props.type}
          />
        )}
      </div>
    );
  }
}

DupeTable.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(DupeTable);
