function updateTransactionHistory() {
  var transactionSheetId = '1gIYgG1lFh0hDAfY2iZ0U54QS36Q6On14avJuVbTEx1k'; 
  var liveStockSheetId = '1BmL8vqnrGGzFT-ZY0sGJ8MAAc3PfEVePgOPAn9xA8rs'; 
  var transactionSheetName = 'TransactionHistoryOfBookstore'; 
  var liveStockSheetName = 'ProductList';
  
  var transactionSheet = SpreadsheetApp.openById(transactionSheetId).getSheetByName(transactionSheetName);
  var liveStockSheet = SpreadsheetApp.openById(liveStockSheetId).getSheetByName(liveStockSheetName);
  
  var transactionData = transactionSheet.getDataRange().getValues();
  var lastRow = transactionData.length;
  
  var productId = transactionSheet.getRange(lastRow, 4).getValue(); 
  
  var liveStockData = liveStockSheet.getDataRange().getValues();
  var productDetails = {};
  
  for (var i = 1; i < liveStockData.length; i++) {
    if (liveStockData[i][0] == productId) { 
      productDetails = {
        currentStock: liveStockData[i][6], 
        category: liveStockData[i][3],
        language: liveStockData[i][4], 
        pricePerUnit: liveStockData[i][5] 
      };
      break;
    }
  }
  
  // Update the transaction sheet with product details
  transactionSheet.getRange(lastRow, 9).setValue(productDetails.currentStock);
  transactionSheet.getRange(lastRow, 6).setValue(productDetails.category);
  transactionSheet.getRange(lastRow, 7).setValue(productDetails.language); 
  transactionSheet.getRange(lastRow, 8).setValue(productDetails.pricePerUnit); 
  
  var lastTransactionHistoryID = transactionSheet.getRange(lastRow -1, 1).getValue(); 
  
  var number = parseInt(lastTransactionHistoryID.replace(/\D/g, '')) + 1;
  var newTransactionHistoryID = lastTransactionHistoryID.replace(/\d+/g, number);
  
  transactionSheet.getRange(lastRow, 1).setValue(newTransactionHistoryID); 
  
  Logger.log('Transaction history updated successfully.');
}
