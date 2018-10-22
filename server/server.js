const express = require('express');
const XeroClient = require('xero-node').AccountingAPIClient;
const path = require('path');
let app = express();

let lastRequestToken = null;
let xeroClient = new XeroClient({
  appType: 'public',
  callbackUrl: 'http://localhost:3000/callback',
  consumerKey: 'YICB8H2Y08CFTMSQFNF0853YRZ1RJZ',
  consumerSecret: 'MLJ5OWMA54RRBEBYSPFWRAHWHKHAC1',
  userAgent: 'Tester (PUBLIC) - Application for testing Xero',
  redirectOnError: true
});
app.set('port', process.env.PORT || 3000);
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get('/connect', async function(req, res) {
  lastRequestToken = await xeroClient.oauth1Client.getRequestToken();

  let authoriseUrl = xeroClient.oauth1Client.buildAuthoriseUrl(
    lastRequestToken
  );
  res.redirect(authoriseUrl);
});

app.get('/callback', async function(req, res) {
  let oauth_verifier = req.query.oauth_verifier;
  let accessToken = await xeroClient.oauth1Client.swapRequestTokenforAccessToken(
    lastRequestToken,
    oauth_verifier
  );
  res.redirect('/');
});

app.get('/invoices/:id', async function(req, res) {
  let invoices = await xeroClient.invoices.get({
    Statuses: 'AUTHORISED',
    page: req.params.id
  });
  res.json(invoices);
});

app.post('/createinvoice', async function(req, res) {
  let invoice = await xeroClient.invoices
    .create({
      Reference: req.body.reference || '',
      Type: req.body.type,
      Contact: {
        Name: req.body.name
      },
      Date: req.body.date,
      DueDate: req.body.due || '',
      LineItems: [
        {
          Description: req.body.description,
          Quantity: req.body.quantity,
          UnitAmount: req.body.total,
          AccountCode: req.body.accountcode || '',
          ItemCode: req.body.itemcode || ''
        }
      ],
      Status: req.body.status
    })
    .then(data => {
      res.json('Invoice created');
    })
    .catch(err => {
      res.json('Error! Please check your input is valid');
    });
});

module.exports = app;
