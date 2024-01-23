import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import logo from '@assets/images/xlogo_s.png'

class PDFUtils<T> {
    private pdf: jsPDF;

    constructor() {
        this.pdf = new jsPDF();
    }

    setConfig() {
        // You can set additional configurations for the PDF here if needed
        // Example: this.pdf.setFillColor(255, 255, 255);
    }

    async exportToPDF(data: T[], columns: (keyof T)[], columnMapping: Record<keyof T, string>, fileName: string, chartComponentId: string) {
        await this.addHeader('pdfHeader')
        //this.createSettingTable(data, columns, columnMapping);
        
        await this.addChartImage(chartComponentId);
        await this.createTable(data, columns, columnMapping);
        this.pdf.save(`${fileName}.pdf`);
    }

    private async createTable(data: T[], columns: (keyof T)[], columnMapping: Record<string, string>) {
        const colToExclude = ['initialAmount', 'monthlyInvestment', 'selectedStartMonth', 'selectedStartYear', 'selectedEndMonth', 'selectedEndYear'];
        const tableData = data.map((item) =>
            columns
                .filter((col) => !colToExclude.includes(col.toString()))
                .map((col) => item[col])
        );


        const header = columns
            .filter((col) => !colToExclude.includes(col.toString()))
            .map((col) => columnMapping[col as string] || col) as string[];
        const table = [header, ...tableData];

        const columnsToAlignRight: string[] = ['percentageGain', 'totalGain', 'total', 'totalInvested'];

        const startX = 1;
        const startY = 155;

        (this.pdf as any).autoTable({
            head: [header],
            body: tableData,
            startY,
            didParseCell: (data: any) => {
                const columnsToAlignRightIndex = columnsToAlignRight.map((col) => columns.indexOf(col as keyof T))
                if (data.row.index >= 0) {
                    if (columnsToAlignRightIndex.includes(data.column.index)) {
                        data.cell.styles.halign = 'right';
                    }
                }
                if (data.row.index >= 0 && data.row.section === 'body') {
                    const gainPercentageIndex = columns.indexOf('percentageGain' as keyof T);
                    if (data.column.index === gainPercentageIndex) {
                        const gainPercentage = parseFloat(String(tableData[data.row.index][gainPercentageIndex]));
                        const textColor = gainPercentage > 0 ? '#089981' : gainPercentage < 0 ? "#F23645" : 80;
                        data.cell.styles.textColor = textColor;
                    }
                }
            },
        });



        return table;
    }
    private createSettingTable(data: T[], columns: (keyof T)[], columnMapping: Record<string, string>) {
        const colToExclude = ['date', 'value', 'percentageGain', 'totalInvested', 'totalGain', 'total']
        const tableData = [columns
            .filter((col) => !colToExclude.includes(col.toString()))
            .map((col) => data[0][col])] as any[][];


        const header = columns
            .filter((col) => !colToExclude.includes(col.toString()))
            .map((col) => columnMapping[col as string] || col) as string[];

        const table = [header, tableData[0]];

        (this.pdf as any).autoTable({
            head: [header],
            body: tableData,
            theme: 'plain',
            didParseCell: (data: any) => {
                if (data.row.index >= 0) {
                    if (data.column.index >= 0) {
                        data.cell.styles.halign = 'center';
                    }
                }
            },
        });



        return table;
    }
    private async addChartImage(chartComponentId: string) {
        const chartComponent = document.getElementById(chartComponentId);
        if (chartComponent) {
            const canvas = await html2canvas(chartComponent);
            const imgData = canvas.toDataURL('image/png');
            this.pdf.addImage(imgData, 'PNG', 5, 48, 200, 100); // Adjust the coordinates and dimensions as needed
        }
    }

    private async addHeader(headerComponentId: string) {
        const headerComponent = document.getElementById(headerComponentId);
        if (headerComponent) {
            const canvas = await html2canvas(headerComponent);
            const imgData = canvas.toDataURL('image/png');
            this.pdf.addImage(imgData, 'PNG', 1, 1, 210, 45); // Adjust the coordinates and dimensions as needed
        }
    }



}

export default PDFUtils;
