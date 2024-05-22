import ExcelJS from 'exceljs'
import type { Worksheet } from 'exceljs'
import { jsonToTableData, obtainFiscalCredit, obtainFiscalDebit, obtainExportation, obtainExemptExpenses, obtainTransitoryFees, obtainWithholdingFees, obtainUniqueFee } from './sii_formulas';
import type { SiiF29YearData } from './schema';
import path from 'path'

export async function excelGeneration(data: SiiF29YearData[]) {
  try {
    // Path to the Excel file in the public directory
    const filePath = path.join(__dirname, 'master_template.xlsx');
    console.log(filePath);
    return await generateExcel(data, filePath);
  } catch (error) {
    console.error('Error:', error);
  }
}

async function generateExcel(data: SiiF29YearData[], fileName: any) {
  const workbook = new ExcelJS.Workbook();
  
  console.log('Wenas');
  await workbook.xlsx.readFile(fileName);
  console.log('Chaos');
  const supportSheetName = 'BRUTO'
  const worksheetSupport = workbook.addWorksheet(supportSheetName)

  // Add the support information
  worksheetSupport.addRow(['año', 'mes', 'code', 'value'])
  worksheetSupport.addRows(jsonToTableData(data))

  // Fill the cells with the aggregate data
  const dataSheetName = 'DATOS'
  const worksheetData = workbook.getWorksheet(dataSheetName);

  if (worksheetData !== undefined) {
    saveFiscalDebt(data, worksheetData)
    savePPM(data, worksheetData)
    saveTransitoryFees(data, worksheetData)
    saveWithholdingFees(data, worksheetData)
    // Next Table
    saveFiscalCredit(data, worksheetData)
    saveExemptExpenses(data, worksheetData)
    saveUniqueFee(data, worksheetData)
  }

  // Save the workbook
  return await workbook.xlsx.writeBuffer();
}

function saveFiscalDebt(data: SiiF29YearData[], worksheet: Worksheet) {
  const offsetRow = 14
  const offsetColumn = 5
  data.map(monthData => {
    const cellData = obtainFiscalDebit(monthData.information)
    worksheet.getCell(offsetRow + monthData.month, offsetColumn).value = cellData
  })
}

function savePPM(data: SiiF29YearData[], worksheet: Worksheet) {
  // Pagos provisionales mensuales (62)
  const offsetRow = 14
  const offsetColumn = 6
  data.map(monthData => {
    const cellData = obtainExemptExpenses(monthData.information)
    worksheet.getCell(offsetRow + monthData.month, offsetColumn).value = cellData
  })
}

function saveWithholdingFees(data: SiiF29YearData[], worksheet: Worksheet) {
  // Responds 'Retencion de honorarios'
  const offsetRow = 14
  const offsetColumn = 7
  data.map(monthData => {
    const cellData = obtainWithholdingFees(monthData.information)
    worksheet.getCell(offsetRow + monthData.month, offsetColumn).value = cellData
  })
}

function saveTransitoryFees(data: SiiF29YearData[], worksheet: Worksheet) {
  // Respond for Impuestos transitorios [153 + 49]
  const offsetRow = 14
  const offsetColumn = 8
  data.map(monthData => {
    const cellData = obtainTransitoryFees(monthData.information)
    worksheet.getCell(offsetRow + monthData.month, offsetColumn).value = cellData
  })
}

function saveFiscalCredit(data: SiiF29YearData[], worksheet: Worksheet) {
  const offsetRow = 35
  const offsetColumn = 5
  data.map(monthData => {
    const cellData = obtainFiscalCredit(monthData.information) + obtainExportation(monthData.information)
    worksheet.getCell(offsetRow + monthData.month, offsetColumn).value = cellData
  })
}

function saveExemptExpenses(data: SiiF29YearData[], worksheet: Worksheet) {
  // Respond for 'Gastos exentos'
  const offsetRow = 35
  const offsetColumn = 6
  data.map(monthData => {
    const cellData = obtainExemptExpenses(monthData.information)
    worksheet.getCell(offsetRow + monthData.month, offsetColumn).value = cellData
  })
}

function saveUniqueFee(data: SiiF29YearData[], worksheet: Worksheet) {
  // Respond for 'Impuesto único'
  const offsetRow = 35
  const offsetColumn = 9
  data.map(monthData => {
    const cellData = obtainUniqueFee(monthData.information)
    worksheet.getCell(offsetRow + monthData.month, offsetColumn).value = cellData
  })
}