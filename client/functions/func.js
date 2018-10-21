formatData = apiInfo => {
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
      console.log(data[name]['dates'][date].invoices.length);
      data[name]['dates'][date].invoices.pop();
      console.log('laters');
      console.log(data[name]['dates'][date].invoices.length);
      data[name]['dates'][date].total = 0;
      data[name].total = 0;
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
  return data;
};

module.exports = {
  formatData
};
