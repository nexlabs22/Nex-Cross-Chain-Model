/* eslint-disable @typescript-eslint/no-explicit-any */
import { jsPDF } from "jspdf"
import "jspdf-autotable"
import domtoimage from "dom-to-image"

class PDFUtils<T> {
  private pdf: jsPDF

  constructor() {
    this.pdf = new jsPDF()
  }

  setConfig() {
    // You can set additional configurations for the PDF here if needed
    // Example: this.pdf.setFillColor(255, 255, 255);
  }

  async exportToPDF(
    data: T[],
    columns: (keyof T)[],
    columnMapping: Record<keyof T, string>,
    fileName: string
  ) {
    await this.addHeader("pdfHeader")
    await this.createTable(data, columns, columnMapping)
    this.pdf.save(`${fileName}.pdf`)
  }

  private async createTable(
    data: T[],
    columns: (keyof T)[],
    columnMapping: Record<string, string>
  ) {
    const colToExclude = [
      "initialAmount",
      "monthlyInvestment",
      "selectedStartMonth",
      "selectedStartYear",
      "selectedEndMonth",
      "selectedEndYear",
    ]
    const tableData = data.map((item) =>
      columns
        .filter((col) => !colToExclude.includes(col.toString()))
        .map((col) => item[col])
    )

    const header = columns
      .filter((col) => !colToExclude.includes(col.toString()))
      .map((col) => columnMapping[col as string] || col) as string[]
    const table = [header, ...tableData]
    const columnsToAlignRight: string[] = [
      "percentageGain",
      "totalGain",
      "total",
      "totalInvested",
    ]
    const startY = 155

    ;(this.pdf as any).autoTable({
      head: [header],
      body: tableData,
      startY,
      didParseCell: (data: any) => {
        const columnsToAlignRightIndex = columnsToAlignRight.map((col) =>
          columns.indexOf(col as keyof T)
        )
        if (data.row.index >= 0) {
          if (columnsToAlignRightIndex.includes(data.column.index)) {
            data.cell.styles.halign = "right"
          }
        }
        if (data.row.index >= 0 && data.row.section === "body") {
          const gainPercentageIndex = columns.indexOf(
            "percentageGain" as keyof T
          )
          if (data.column.index === gainPercentageIndex) {
            const gainPercentage = parseFloat(
              String(tableData[data.row.index][gainPercentageIndex])
            )
            console.log(gainPercentage)
            const textColor =
              gainPercentage > 0
                ? "#089981"
                : gainPercentage < 0
                ? "#F23645"
                : "#f9fafb"
            console.log(textColor)
            data.cell.styles.textColor = textColor
          }
        }
      },
    })

    return table
  }

  private async addHeader(headerComponentId: string) {
    const headerComponent = document.getElementById(headerComponentId)
    console.log(headerComponent)
    if (headerComponent) {
      domtoimage
        .toPng(headerComponent)
        .then(
          function (dataUrl: string) {
            console.log(dataUrl)
          }.bind(this)
        )
        .catch(function (error: any) {
          console.error("Error capturing image:", error)
        })
    }
  }
}

export default PDFUtils
