import jsPDF from 'jspdf';

export interface CertificateData {
  studentName: string;
  courseName: string;
  completionDate: string;
  certificateNumber: string;
  instructorName?: string;
  organizationName?: string;
}

export interface CertificateTemplate {
  id: string;
  name: string;
  backgroundColor: string;
  borderColor: string;
  textColor: string;
  accentColor: string;
  fontFamily: string;
  hasWatermark: boolean;
  hasBorder: boolean;
  hasSeal: boolean;
}

export const certificateTemplates: CertificateTemplate[] = [
  {
    id: '1',
    name: 'Classic Academic',
    backgroundColor: '#FFFFFF',
    borderColor: '#1E3A8A',
    textColor: '#1F2937',
    accentColor: '#D4AF37',
    fontFamily: 'serif',
    hasWatermark: true,
    hasBorder: true,
    hasSeal: true
  },
  {
    id: '2',
    name: 'Modern Corporate',
    backgroundColor: '#F8FAFC',
    borderColor: '#2563EB',
    textColor: '#1F2937',
    accentColor: '#3B82F6',
    fontFamily: 'sans-serif',
    hasWatermark: false,
    hasBorder: true,
    hasSeal: true
  },
  {
    id: '3',
    name: 'Premium Gold',
    backgroundColor: '#FEF7E0',
    borderColor: '#D4AF37',
    textColor: '#92400E',
    accentColor: '#B8860B',
    fontFamily: 'serif',
    hasWatermark: true,
    hasBorder: true,
    hasSeal: true
  },
  {
    id: '4',
    name: 'Minimalist Clean',
    backgroundColor: '#FFFFFF',
    borderColor: '#6B7280',
    textColor: '#374151',
    accentColor: '#9CA3AF',
    fontFamily: 'sans-serif',
    hasWatermark: false,
    hasBorder: false,
    hasSeal: false
  }
];

export class PDFCertificateGenerator {
  private doc: jsPDF;
  private template: CertificateTemplate;
  private data: CertificateData;

  constructor(template: CertificateTemplate, data: CertificateData) {
    this.doc = new jsPDF('landscape', 'mm', 'a4');
    this.template = template;
    this.data = data;
  }

  generate(): jsPDF {
    this.setupPage();
    this.drawBorder();
    this.drawWatermark();
    this.drawHeader();
    this.drawContent();
    this.drawSignatures();
    this.drawSeal();
    this.drawCertificateNumber();
    
    return this.doc;
  }

  private setupPage(): void {
    this.doc.setFillColor(this.template.backgroundColor);
    this.doc.rect(0, 0, 297, 210, 'F');
  }

  private drawBorder(): void {
    if (!this.template.hasBorder) return;

    this.doc.setDrawColor(this.template.borderColor);
    this.doc.setLineWidth(2);
    this.doc.rect(10, 10, 277, 190);
    
    // Inner border
    this.doc.setLineWidth(0.5);
    this.doc.rect(15, 15, 267, 180);
  }

  private drawWatermark(): void {
    if (!this.template.hasWatermark) return;

    this.doc.setTextColor(this.template.accentColor);
    this.doc.setFontSize(60);
    this.doc.setFont(this.template.fontFamily, 'normal');
    this.doc.setTextColor(255, 255, 255, 0.1);
    this.doc.text('CERTIFICATE', 148.5, 105, { align: 'center', angle: 45 });
  }

  private drawHeader(): void {
    // Top accent bar
    this.doc.setFillColor(this.template.borderColor);
    this.doc.rect(20, 20, 257, 8, 'F');

    // Main title
    this.doc.setTextColor(this.template.textColor);
    this.doc.setFontSize(24);
    this.doc.setFont(this.template.fontFamily, 'bold');
    this.doc.text('Certificate of Completion', 148.5, 45, { align: 'center' });

    // Subtitle
    this.doc.setFontSize(12);
    this.doc.setFont(this.template.fontFamily, 'normal');
    this.doc.setTextColor(this.template.accentColor);
    this.doc.text(this.template.name, 148.5, 55, { align: 'center' });

    // Decorative line
    this.doc.setDrawColor(this.template.accentColor);
    this.doc.setLineWidth(1);
    this.doc.line(80, 60, 217, 60);
  }

  private drawContent(): void {
    const centerX = 148.5;
    const startY = 80;

    // Certificate text
    this.doc.setTextColor(this.template.textColor);
    this.doc.setFontSize(12);
    this.doc.setFont(this.template.fontFamily, 'normal');
    this.doc.text('This is to certify that', centerX, startY, { align: 'center' });

    // Student name
    this.doc.setFontSize(18);
    this.doc.setFont(this.template.fontFamily, 'bold');
    this.doc.setTextColor(this.template.accentColor);
    this.doc.text(this.data.studentName, centerX, startY + 20, { align: 'center' });

    // Course completion text
    this.doc.setFontSize(12);
    this.doc.setFont(this.template.fontFamily, 'normal');
    this.doc.setTextColor(this.template.textColor);
    this.doc.text('has successfully completed the course', centerX, startY + 35, { align: 'center' });

    // Course name
    this.doc.setFontSize(14);
    this.doc.setFont(this.template.fontFamily, 'bold');
    this.doc.setTextColor(this.template.accentColor);
    this.doc.text(this.data.courseName, centerX, startY + 50, { align: 'center' });

    // Completion date
    this.doc.setFontSize(10);
    this.doc.setFont(this.template.fontFamily, 'normal');
    this.doc.setTextColor(this.template.textColor);
    this.doc.text(`Completed on: ${this.data.completionDate}`, centerX, startY + 65, { align: 'center' });
  }

  private drawSignatures(): void {
    const startY = 140;
    const leftX = 60;
    const rightX = 237;

    // Left signature
    this.doc.setDrawColor(this.template.textColor);
    this.doc.setLineWidth(0.5);
    this.doc.line(leftX - 20, startY, leftX + 20, startY);

    this.doc.setFontSize(10);
    this.doc.setFont(this.template.fontFamily, 'bold');
    this.doc.setTextColor(this.template.textColor);
    this.doc.text(this.data.instructorName || 'Course Instructor', leftX, startY + 10, { align: 'center' });

    this.doc.setFontSize(8);
    this.doc.setFont(this.template.fontFamily, 'normal');
    this.doc.setTextColor(this.template.accentColor);
    this.doc.text('Course Director', leftX, startY + 15, { align: 'center' });

    // Right signature
    this.doc.line(rightX - 20, startY, rightX + 20, startY);
    this.doc.setFontSize(10);
    this.doc.setFont(this.template.fontFamily, 'bold');
    this.doc.setTextColor(this.template.textColor);
    this.doc.text(this.data.organizationName || 'Academic Dean', rightX, startY + 10, { align: 'center' });

    this.doc.setFontSize(8);
    this.doc.setFont(this.template.fontFamily, 'normal');
    this.doc.setTextColor(this.template.accentColor);
    this.doc.text('Academic Dean', rightX, startY + 15, { align: 'center' });
  }

  private drawSeal(): void {
    if (!this.template.hasSeal) return;

    const centerX = 148.5;
    const centerY = 140;

    // Outer circle
    this.doc.setFillColor(this.template.accentColor);
    this.doc.circle(centerX, centerY, 15, 'F');

    // Inner circle
    this.doc.setFillColor('#FFFFFF');
    this.doc.circle(centerX, centerY, 12, 'F');

    // SEAL text
    this.doc.setFontSize(8);
    this.doc.setFont(this.template.fontFamily, 'bold');
    this.doc.setTextColor(this.template.accentColor);
    this.doc.text('SEAL', centerX, centerY + 2, { align: 'center' });
  }

  private drawCertificateNumber(): void {
    this.doc.setFontSize(8);
    this.doc.setFont('monospace', 'normal');
    this.doc.setTextColor(this.template.accentColor);
    this.doc.text(`Certificate #: ${this.data.certificateNumber}`, 148.5, 190, { align: 'center' });
  }

  download(filename?: string): void {
    const defaultFilename = `certificate_${this.data.studentName.replace(/\s+/g, '_')}_${Date.now()}.pdf`;
    this.doc.save(filename || defaultFilename);
  }
}

export const generateCertificate = (templateId: string, data: CertificateData): jsPDF => {
  const template = certificateTemplates.find(t => t.id === templateId) || certificateTemplates[0];
  const generator = new PDFCertificateGenerator(template, data);
  return generator.generate();
};

export const downloadCertificate = (templateId: string, data: CertificateData, filename?: string): void => {
  const template = certificateTemplates.find(t => t.id === templateId) || certificateTemplates[0];
  const generator = new PDFCertificateGenerator(template, data);
  generator.generate();
  generator.download(filename);
}; 