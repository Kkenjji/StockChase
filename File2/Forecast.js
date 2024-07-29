function predictNextMonthStock(productId, spareStockPercentage) {
  var sheetName = 'MonthlyStockData';
  var range = 'A2:G';

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(sheetName);
  var dataRange = sheet.getRange(range);
  var dataValues = dataRange.getValues();

  var data = dataValues.map(function(row) {
    return {
      productId: row[0],
      month: row[2],
      initialCount: row[3],
      unitsSold: row[4],
      endingCount: row[5],
      salesPercentage: row[6]
    };
  });

  var filteredData = data.filter(function(record) {
    return record.productId === productId;
  });

  if (filteredData.length === 0) {
    Logger.log('No data found for Product ID: ' + productId);
    return;
  }

  function calculateSales(entry) {
    return entry.initialCount - entry.endingCount;
  }

  var salesData = filteredData.map(entry => calculateSales(entry));
  var initialCountData = filteredData.map(entry => entry.initialCount);

  var n = salesData.length;
  var sumX = salesData.reduce((a, b) => a + b, 0);
  var sumY = initialCountData.reduce((a, b) => a + b, 0);
  var sumXY = salesData.map((x, i) => x * initialCountData[i]).reduce((a, b) => a + b, 0);
  var sumX2 = salesData.map(x => x * x).reduce((a, b) => a + b, 0);

  var m = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  var b = (sumY - m * sumX) / n;

  var lastMonthSales = calculateSales(filteredData[filteredData.length - 1]);
  var predictedStock = Math.round((m * lastMonthSales + b) * (1 + spareStockPercentage / 100));

  Logger.log('Predicted Initial Stock for Next Month for Product ID ' + productId + ': ' + predictedStock);
  return predictedStock;
}

function createProductSummary() {
  runSummarize();
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var monthlyStockSheet = spreadsheet.getSheetByName('MonthlyStockData');
  var productSummarySheet = spreadsheet.getSheetByName('ProductSummary');

  // If ProductSummary sheet already exists, clear it. Otherwise, create it.
  if (productSummarySheet) {
    productSummarySheet.clear();
  } else {
    productSummarySheet = spreadsheet.insertSheet('ProductSummary');
  }

  // Get data from MonthlyStockData sheet
  var dataRange = monthlyStockSheet.getDataRange();
  var data = dataRange.getValues();

  // Create a header for ProductSummary sheet
  var header = ['Product ID', 'Product Name', 'Suggested Stock Count For Next Month'];
  productSummarySheet.appendRow(header);

  // Create an object to store the latest suggested stock count for each product
  var productSummary = {};

  // Iterate through the data and populate the product summary object
  for (var i = 1; i < data.length; i++) {
    var productId = data[i][0];
    var productName = data[i][1];
    var suggestedStockCount = predictNextMonthStock(productId, 10); // Adjust index based on your sheet structure

    // Store the suggested stock count if it's the latest one encountered
    productSummary[productId] = {
      productName: productName,
      suggestedStockCount: suggestedStockCount
    };
  }

  // Write the product summary data to the ProductSummary sheet
  for (var productId in productSummary) {
    var productData = productSummary[productId];
    var row = [productId, productData.productName, productData.suggestedStockCount];
    productSummarySheet.appendRow(row);
  }

  Logger.log('ProductSummary sheet created successfully.');
}
