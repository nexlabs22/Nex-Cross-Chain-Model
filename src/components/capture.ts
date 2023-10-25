// captureHtmlAsImage.ts
import html2canvas from 'html2canvas';

const captureHtmlAsImage = async (htmlContent: string): Promise<string | null> => {
  try {
    const div = document.createElement('div');
    div.innerHTML = htmlContent;
    document.body.appendChild(div);

    const canvas = await html2canvas(div);

    // Convert the canvas to an image data URL
    const imgDataUrl = canvas.toDataURL('image/png');

    // Clean up by removing the temporary div
    document.body.removeChild(div);

    return imgDataUrl;
  } catch (error) {
    console.error('Error capturing HTML as image:', error);
    return null;
  }
};

export default captureHtmlAsImage;
