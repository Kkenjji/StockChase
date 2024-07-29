function retrieveHistory() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("TransactionHistoryOfBookstore");
  // Logger.log(sheet.getName());
  var allSheets = [];

  // for (var i = 0; i < sheets.length; i++) { // find all dataset based on year
  //   var sheetName = parseInt(sheets[i].getName());
  //   if (isNaN(sheetName)) {
  //     continue;
  //   }
  //   if (sheetName >= startYear && sheetName <= endYear) {
  //     yearSheets.push(sheetName);
  //   }
  // }

  allSheets.push(sheet);

  // allSheets.sort(function(a, b) { // sort in ascending order
  //   return a - b;
  // });

  // allSheets.forEach(entry => Logger.log(entry));

  return allSheets;
}

function getDataEntries(startDate, endDate) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var allSheets = retrieveHistory();
  var dataEntries = [];

  allSheets.forEach(s => Logger.log(s.getName()));

  allSheets.forEach(function(sheet) {
    if (sheet) {
      var data = sheet.getDataRange().getValues();
      var headers = data.shift(); // Remove header row

      data.forEach(function(row) {
        var dateStr = row[1] + '/' + row[2]; // assuming 'Year' in first column and 'Month' in second
        var date = new Date(dateStr);

        if (date >= startDate && date <= endDate) {
          dataEntries.push(row);
        }
      });
    }
  });

  // dataEntries.forEach(row => Logger.log(row));

  return dataEntries;
}

function summarize(interval) {
  var dateRange = getDateFor(interval);
  var data = getDataEntries(dateRange.startDate, dateRange.endDate);
  
  Logger.log(data.length);

  data.sort((a, b) => {
    if (a[3] < b[3]) return -1;
    if (a[3] > b[3]) return 1;
    return 0;
  })
  
  if (data.length === 0) {
    Logger.log("No data available for the selected interval");
    return;
  }

  // data.forEach(row => Logger.log(row));

  data.forEach(function(row) {
    var productID = row[3];
    var productName = row[4];
    var month = row[1] + "/" + row[2];
    var initialCount = row[8];
    var unitsSold = row[9];
    var endingCount = row[10];
    var salesPercentage = (unitsSold / initialCount * 100).toFixed(4);

    for (var i = 0; i < row.length; i++) {
      row[i] = null;
    }

    row[0] = productID;
    row[1] = productName;
    row[2] = month;
    row[3] = initialCount;
    row[4] = unitsSold;
    row[5] = endingCount;
    row[6] = salesPercentage;
  });

  // data.forEach(row => Logger.log(row));

  // for (var productID in summary) {
  //   if (summary.hasOwnProperty(productID)) {
  //     Logger.log(productID);
  //     Logger.log("Product ID: " + productID);
  //     Logger.log("Product Name: " + summary[productID].productName);
  //     Logger.log("Initial Count: " + summary[productID].initialCount);
  //     Logger.log("Ending Count: " + summary[productID].endingCount);
  //   }
  // }

  var headers = ["Product ID", "Product Name", "Interval", "Initial Count", "Units Sold", "Ending Count", "Sales Percentage"];

  var monthlySheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("MonthlyStockData");
  if (!monthlySheet) {
    monthlySheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet("MonthlyStockData");
  } else {
    monthlySheet.clearContents();
  }

  monthlySheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  monthlySheet.getRange(2, 1, data.length, data[0].length).setValues(data);
}

function runSummarize() {
  return summarize("monthly");
}
