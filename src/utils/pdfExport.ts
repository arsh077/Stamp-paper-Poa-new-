import jsPDF from 'jspdf';
import { toPng } from 'html-to-image';

export async function exportToPdf(
  elementId: string,
  fileName: string = 'Form_TM48_Stamp_Paper.pdf',
  onProgress?: (status: string) => void
): Promise<boolean> {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error('Target element not found for PDF export:', elementId);
    return false;
  }

  try {
    onProgress?.('Preparing high-resolution 1-page render...');

    onProgress?.('Capturing stamp paper and draft layers at 300 DPI...');
    const dataUrl = await toPng(element, {
      pixelRatio: 2.5,
      backgroundColor: '#f8f5eb',
      cacheBust: true,
      skipAutoScale: true,
      filter: (node) => {
        // Exclude elements marked as no-print
        if (node instanceof HTMLElement && node.classList.contains('no-print')) {
          return false;
        }
        return true;
      },
    });

    onProgress?.('Generating A4 Single-Page PDF...');

    // Standard A4 dimensions in mm: 210 x 297
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    const pdfWidth = 210;
    const pdfHeight = 297;

    // Add exactly one single page
    pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');

    onProgress?.('Downloading PDF file...');
    pdf.save(fileName);

    return true;
  } catch (error) {
    console.error('Failed to export PDF:', error);
    return false;
  }
}

export function printStampPaper(elementId: string) {
  const element = document.getElementById(elementId);
  if (!element) return;

  window.print();
}
