function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
      .setTitle('Datos de Cartas')
      .setFaviconUrl('https://www.google.com/images/products/sheets-icon.png');
}

function getData() {
  try {
    var spreadsheetId = '17vCpeBdnX314mp8MqR3FHVEtaqPAo_HXi3uBOa-ex2Q';
    var ss = SpreadsheetApp.openById(spreadsheetId);
    var sheet = ss.getSheetByName('TablaDinamica2');
    
    if (!sheet) {
      throw new Error('No se encontró la hoja Cartas');
    }

    // Obtener datos de tablas dinámicas si existen
    var pivotTables = sheet.getPivotTables();
    var allData = [];
    
    if (pivotTables && pivotTables.length > 0) {
      // Procesar cada tabla dinámica
      pivotTables.forEach(function(pivotTable) {
        var pivotRange = pivotTable.getRange();
        var pivotData = pivotRange.getDisplayValues(); // Obtiene los valores mostrados
        allData = allData.concat(pivotData);
      });
    }

    // Obtener datos regulares
    var dataRange = sheet.getDataRange();
    var displayValues = dataRange.getDisplayValues(); // Obtiene los valores como se muestran, incluyendo fórmulas calculadas
    
    // Obtener información sobre filtros
    var filter = sheet.getFilter();
    if (filter) {
      var criteriaRange = filter.getRange();
      var filteredData = [];
      
      // Procesar solo las filas visibles (no filtradas)
      for (var i = 0; i < displayValues.length; i++) {
        if (!filter.isRowFiltered(i + 1)) { // +1 porque los índices de fila comienzan en 1
          filteredData.push(displayValues[i]);
        }
      }
      displayValues = filteredData;
    }

    // Combinar todos los datos únicos
    var finalData = displayValues;
    if (allData.length > 0) {
      finalData = finalData.concat(allData);
    }

    // Eliminar filas duplicadas y vacías
    finalData = finalData.filter(function(row) {
      return row.some(function(cell) {
        return cell !== '';
      });
    });

    Logger.log('Número total de filas de datos: ' + finalData.length);
    
    return finalData;
    
  } catch (error) {
    Logger.log('Error en getData: ' + error.toString());
    throw error;
  }
}

// Función auxiliar para obtener datos de tablas dinámicas
function getPivotTableData(sheet) {
  var pivotTables = sheet.getPivotTables();
  var pivotData = [];
  
  if (pivotTables && pivotTables.length > 0) {
    pivotTables.forEach(function(pivotTable) {
      var range = pivotTable.getRange();
      var values = range.getDisplayValues();
      pivotData = pivotData.concat(values);
    });
  }
  
  return pivotData;
}

// Función de prueba
function testGetData() {
  try {
    var data = getData();
    Logger.log('Test exitoso - Datos obtenidos: ' + data.length + ' filas');
    Logger.log('Muestra de datos primera fila: ' + JSON.stringify(data[0]));
  } catch (error) {
    Logger.log('Test fallido: ' + error.toString());
  }
}