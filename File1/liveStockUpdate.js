// @ts-nocheck

function updateLiveStock() {
  // IDs and sheet names
  var transactionSheetId = '1gIYgG1lFh0hDAfY2iZ0U54QS36Q6On14avJuVbTEx1k'; 
  var liveStockSheetId = '1BmL8vqnrGGzFT-ZY0sGJ8MAAc3PfEVePgOPAn9xA8rs'; 
  var transactionSheetName = 'TransactionHistoryOfBookstore'; 
  var liveStockSheetName = 'ProductList';
  
  var transactionSheet = SpreadsheetApp.openById(transactionSheetId).getSheetByName(transactionSheetName);
  var liveStockSheet = SpreadsheetApp.openById(liveStockSheetId).getSheetByName(liveStockSheetName);
  
  var transactionData = transactionSheet.getDataRange().getValues();
  var liveStockData = liveStockSheet.getDataRange().getValues();
   
  var liveStockMap = {};
  for (var i = 1; i < liveStockData.length; i++) { 
    var productId = liveStockData[i][0];
    liveStockMap[productId] = i;
  }

  // Loop through the transaction data and update the current stock levels
  for (var i = 1; i < transactionData.length; i++) { 
    var productIdOfTransactionSheet = transactionData[i][3]; 
    var afterRestocked = transactionData[i][12]; 

    if (liveStockMap[productIdOfTransactionSheet] !== undefined) {
      var rowIndex = liveStockMap[productIdOfTransactionSheet];
      var currentStock = afterRestocked;

      // Update the live stock value in the specific cell
      liveStockSheet.getRange(rowIndex + 1, 7).setValue(currentStock); 
    }
  }
  
  Logger.log('Live stock updated successfully.');
}
