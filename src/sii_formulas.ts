import type { SiiF29YearData, DataSheetRowDataProps } from "./schema";

// export const exampleData = JSON.parse(jsonString) as SiiF29YearData[];

const obtainSingleCode = (data: DataSheetRowDataProps[], code: number): number => {
    const filteredCodeItem = data.find((item) => item.code === code)
    return filteredCodeItem?.value || 0
}

const obtainByCodes = (data: DataSheetRowDataProps[], codes: number[]): number => {
  const filteredCodes = data.filter((item) => codes.includes(item.code))
  return filteredCodes.reduce((prev, item) => prev + item.value, 0)
}

export const obtainFiscalDebit = (data: DataSheetRowDataProps[]): number => {
  // Responds to 'Débito fiscal'
  const fiscalDebtCode = 548
  return obtainSingleCode(data, fiscalDebtCode)
}

export const obtainFiscalCredit = (data: DataSheetRowDataProps[]): number => {
  // Responds to 'Crédito fiscal'
  const codes = [520, 762, 766, 525, 528, 532]
  return obtainByCodes(data, codes)
}

export const obtainExportation = (data: DataSheetRowDataProps[]): number => {
  const codes = [535, 553]
  return obtainByCodes(data, codes)
}

export const obtainExemptExpenses = (data: DataSheetRowDataProps[]): number => {
    // Responds to 'Gastos exentos'
    const codes = [562, 514, 521]
    return obtainByCodes(data, codes)
}

export const obtainPPM = (data: DataSheetRowDataProps[]): number => {
    // Responds to 'PPM' or 'Pagos Provisionales Mensuales'
    const code = 62
    return obtainSingleCode(data, code)
}

export const obtainWithholdingFees = (data: DataSheetRowDataProps[]): number => {
    // Responds 'Retencion de honorarios'
    const code = 151
    return obtainSingleCode(data, code)
}

export const obtainTransitoryFees = (data: DataSheetRowDataProps[]): number => {
    // Responds 'Retencion de honorarios'
    const codes = [49, 153]
    return obtainByCodes(data, codes)
}

export const obtainUniqueFee = (data: DataSheetRowDataProps[]): number => {
    // Responds 'Impuesto único'
    const code = 48
    return obtainSingleCode(data, code)
}


export const jsonToTableData = (data: SiiF29YearData[]): number[][] => {
  return data.map(monthData => monthData.information.map(info => [monthData.year, monthData.month, info.code, info.value])).flat()
}

// [155, 54, 56]