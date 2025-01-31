/* eslint-disable @typescript-eslint/no-explicit-any */
import pdfMake from "pdfmake/build/pdfmake"
import { PageOrientation, TDocumentDefinitions } from "pdfmake/interfaces"
import pdfFonts from "pdfmake/build/vfs_fonts"
import { toast } from "react-toastify"
import { StyledToast } from "@/components/layout/StyledToast"
import { logoBase64 } from "@/constants/logoBase"
import domtoimage from "dom-to-image"
import { DCASettings } from "@/types/dca"

const exportDCATable = async (
  tableData: any,
  pageOrientation: PageOrientation,
  fileName: string,
  userDetails: DCASettings,
  isChecked?: boolean
) => {
  pdfMake.vfs = pdfFonts.vfs
  const isTestPage = isChecked === undefined ? false : true
  const reportType = isChecked ? "Using DCA strategy" : "All at Once"
  let dataUrl1 = ""
  const headerComponent = document.getElementById("chartId")
  if (headerComponent) {
    await domtoimage
      .toPng(headerComponent)
      .then(function (dataUrl: string) {
        dataUrl1 = dataUrl
      })
      .catch(function (error) {
        console.error("Error capturing image:", error)
      })
  }

  const docDefinition: TDocumentDefinitions = {
    pageOrientation: pageOrientation,
    content: [
      {
        columns: [
          {
            width: "*",
            margin: [0, 10, 0, 5],
            text: `Started at: ${userDetails.selectedStartMonth} ${userDetails.selectedStartYear}`,
          },
          {
            width: "*",
            margin: [0, 10, 0, 5],
            text: `Ended at: ${userDetails.selectedEndMonth} ${userDetails.selectedEndYear}`,
          },
        ],
        alignment: "center",
      },
      {
        columns: [
          {
            width: "*",
            margin: [0, 5, 0, 20],
            text: `Initial Investment: ${userDetails.initialAmount}`,
          },
          isTestPage
            ? isChecked
              ? {
                  width: "*",
                  margin: [0, 5, 0, 20],
                  text: `Monthly Investment: ${userDetails.monthlyInvestment}`,
                }
              : ""
            : {
                width: "*",
                margin: [0, 5, 0, 20],
                text: `Monthly Investment: ${userDetails.monthlyInvestment}`,
              },
        ],
        alignment: "center",
      },
      {
        image: dataUrl1,
        fit: [500, 200],
        alignment: "center",
      },
      {
        margin: [0, 20, 0, 0], // Top margin before the table
        text: "", // Empty text for spacing
      },
      {
        table: {
          headerRows: 1,
          body: tableData,
        },
        fontSize: 10,
        marginLeft: 37,
      },
    ],
    header: (currentPage: number, pageCount: number) => {
      return {
        columns: [
          // Left side: Company logo
          {
            image: `data:image/png;base64,${logoBase64}`,
            fit: [30, 30],
            margin: [30, 10, 0, 0],
            alignment: "left",
          },
          // Center: DCA Report heading and subheading
          {
            stack: [
              { text: "DCA Report", fontSize: 18, alignment: "center" },
              isTestPage
                ? {
                    text: `(${reportType})`,
                    fontSize: 12,
                    color: "gray",
                    italics: true,
                    alignment: "center",
                  }
                : "",
            ],
            alignment: "center",
            margin: [0, 10],
          },
          // Right side: Page numbers
          {
            text: `Page ${currentPage} of ${pageCount}`,
            alignment: "right",
            fontSize: 10,
            margin: [0, 15, 30, 0],
          },
        ],
      }
    },
    pageMargins: [50, 50, 50, 50],
  }

  // const timestampstring = new Date().toISOString().replace(/[-:]/g, '').split('.')[0].split('T').join('')
  // const fileName = `NEX-TX-HISTORY-${timestampstring}`

  pdfMake.createPdf(docDefinition).download(`${fileName}.pdf`, () => {
    toast.dismiss()
    StyledToast({
      type: "success",
      message: "PDF Downloaded!",
    })
  })
}

export default exportDCATable
