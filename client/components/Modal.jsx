import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`
  };
}

const styles = theme => ({
  paper: {
    position: 'absolute',
    width: theme.spacing.unit * 50,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4
  }
});

class SimpleModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: this.props.open
    };
  }

  render() {
    const { classes } = this.props;

    return (
      <div>
        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={this.state.open}
          onClose={this.props.close}
        >
          <div style={getModalStyle()} className={classes.paper}>
            <Typography variant="h6" id="modal-title">
              <b>How to use this application</b>
            </Typography>
            <Typography variant="subtitle1" id="simple-modal-description">
              1. Connect to your Xero organisation. <br />
              <br /> 2. You can toggle receivables/payables and navigate through
              pages if desired. <br />
              <br />
              3. Click Retrieve Invoices and then press 'Find Duplicates' to
              locate any duplicates.
              <br />
              <br />
              4. Browse the recommended duplicates and create a new summarized
              invoice that'll save in Xero. <br />
              <br />
              5. Ability to void the invoices post summary is coming soon!{' '}
              <br />
              <br />
              Notes: Xero allows 60 API calls per minute so please respect these
              limits otherwise your changes won't save. <br />
              <br />
              Selected invoies will be reset everytime you navigate to a new
              page, this encourages a safe amount of summarizing. <br />
              <br />
              If the hyperlinks don't work, please ensure you're logged in to
              the right organisation in your web browser (open a new tab for
              Xero and login).
            </Typography>
            <SimpleModalWrapped />
          </div>
        </Modal>
      </div>
    );
  }
}

const SimpleModalWrapped = withStyles(styles)(SimpleModal);

export default SimpleModalWrapped;
