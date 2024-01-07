import jsPDF, { jsPDFAPI } from 'jspdf'; // Import the jsPDF object, not just types
import html2canvas from 'html2canvas';

const pdf = new jsPDF();

interface ConvertElementToPDFOptions {
  element: HTMLElement;
  filename?: string;
  margins?: Object;
  scale?: number;
  additionalStyle?: string;
}

const convertElementToPDF = async ({
  element,
  filename = 'download.pdf',
  margins = { top: 10, bottom: 10, left: 10, right: 10 },
  scale = 2,
  additionalStyle = '',
}: ConvertElementToPDFOptions): Promise<void> => {
   // Instantiate jsPDF object
  

  const canvas = await html2canvas(element, {
    scale,
    logging: false,
    allowTaint: true,
    //style: additionalStyle,
  });

  const imgData = canvas.toDataURL('image/png');
  const imgWidth = (canvas.width / scale) * 0.26458333; // Account for scaling and conversion
  const imgHeight = (canvas.height / scale) * 0.26458333;

  pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
  pdf.save(filename);
};

export default convertElementToPDF; // Export for use in components
