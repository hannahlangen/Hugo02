import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Generate PDF from Assessment Results
 * @param {Object} assessmentData - Assessment data including finalType, scores, etc.
 * @param {Object} userData - User data including name, email, country
 * @returns {Promise<void>}
 */
export const generateAssessmentPDF = async (assessmentData, userData, personalityType) => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - 2 * margin;
  let yPosition = margin;

  // Helper function to add new page if needed
  const checkPageBreak = (requiredSpace = 20) => {
    if (yPosition + requiredSpace > pageHeight - margin) {
      pdf.addPage();
      yPosition = margin;
      return true;
    }
    return false;
  };

  // Helper function to add text with word wrap
  const addText = (text, fontSize = 10, fontStyle = 'normal', color = [0, 0, 0]) => {
    pdf.setFontSize(fontSize);
    pdf.setFont('helvetica', fontStyle);
    pdf.setTextColor(...color);
    const lines = pdf.splitTextToSize(text, contentWidth);
    lines.forEach(line => {
      checkPageBreak();
      pdf.text(line, margin, yPosition);
      yPosition += fontSize * 0.5;
    });
    yPosition += 5;
  };

  // Header with gradient background (simulated with colored rectangle)
  pdf.setFillColor(59, 130, 246); // Blue
  pdf.rect(0, 0, pageWidth, 50, 'F');
  
  // Title
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(24);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Hugo Personality Assessment', margin, 25);
  
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Your Personal Personality Profile', margin, 35);
  
  yPosition = 60;

  // User Information
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Personal Information', margin, yPosition);
  yPosition += 10;

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Name: ${userData.name}`, margin, yPosition);
  yPosition += 7;
  pdf.text(`Email: ${userData.email}`, margin, yPosition);
  yPosition += 7;
  pdf.text(`Country: ${userData.country}`, margin, yPosition);
  yPosition += 7;
  pdf.text(`Assessment Date: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, margin, yPosition);
  yPosition += 15;

  // Personality Type
  checkPageBreak(40);
  pdf.setFillColor(240, 240, 240);
  pdf.rect(margin, yPosition - 5, contentWidth, 30, 'F');
  
  pdf.setFontSize(18);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(59, 130, 246);
  pdf.text(`${personalityType.name.en} (${assessmentData.finalType})`, margin + 5, yPosition + 5);
  
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'italic');
  pdf.setTextColor(100, 100, 100);
  pdf.text(personalityType.tagline.en, margin + 5, yPosition + 15);
  
  yPosition += 35;

  // Description
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  addText(personalityType.description.en);

  // Strengths
  checkPageBreak(30);
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(234, 179, 8); // Yellow
  pdf.text('⭐ Your Strengths', margin, yPosition);
  yPosition += 10;

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(0, 0, 0);
  personalityType.strengths.en.forEach((strength, index) => {
    checkPageBreak(10);
    const lines = pdf.splitTextToSize(`• ${strength}`, contentWidth - 5);
    lines.forEach(line => {
      pdf.text(line, margin + 3, yPosition);
      yPosition += 5;
    });
  });
  yPosition += 5;

  // Cultural Profile
  if (userData.culturalProfile) {
    checkPageBreak(40);
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(34, 197, 94); // Green
    pdf.text('🌍 Cultural Background', margin, yPosition);
    yPosition += 10;

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(0, 0, 0);
    addText(`You grew up in ${userData.country}, which has shaped your communication style and work preferences.`);

    // Hofstede Dimensions
    pdf.setFont('helvetica', 'bold');
    pdf.text('Hofstede Dimensions:', margin, yPosition);
    yPosition += 7;
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Power Distance: ${userData.culturalProfile.hofstede.powerDistance}`, margin + 5, yPosition);
    yPosition += 5;
    pdf.text(`Individualism: ${userData.culturalProfile.hofstede.individualism}`, margin + 5, yPosition);
    yPosition += 5;
    pdf.text(`Uncertainty Avoidance: ${userData.culturalProfile.hofstede.uncertaintyAvoidance}`, margin + 5, yPosition);
    yPosition += 10;
  }

  // Communication Style
  checkPageBreak(30);
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(168, 85, 247); // Purple
  pdf.text('💬 Communication DNA', margin, yPosition);
  yPosition += 10;

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(0, 0, 0);
  addText(`As a ${personalityType.name.en}, your communication style is characterized by clarity, purpose, and authenticity. You naturally adapt your approach based on the situation and the people you're interacting with.`);

  // Work Style
  checkPageBreak(30);
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(34, 197, 94); // Green
  pdf.text('💼 Work & Leadership Style', margin, yPosition);
  yPosition += 10;

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(0, 0, 0);
  
  pdf.setFont('helvetica', 'bold');
  pdf.text('How You Work Best:', margin, yPosition);
  yPosition += 7;
  pdf.setFont('helvetica', 'normal');
  addText('• Thrives in environments with clear goals and autonomy\n• Prefers structured yet flexible approaches\n• Values both collaboration and independent work\n• Motivated by meaningful challenges');

  // Team Contribution
  checkPageBreak(30);
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(99, 102, 241); // Indigo
  pdf.text('👥 Your Team Contribution', margin, yPosition);
  yPosition += 10;

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(0, 0, 0);
  addText('You bring unique value to any team through your natural abilities and perspective.');

  // Ideal Roles
  checkPageBreak(30);
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(245, 158, 11); // Amber
  pdf.text('🏆 Ideal Roles & Career Paths', margin, yPosition);
  yPosition += 10;

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(0, 0, 0);
  addText('Based on your personality type, you\'re likely to thrive in roles that leverage your natural strengths:');
  addText('• Strategic Leadership Positions\n• Project Management\n• Business Development\n• Consulting & Advisory');

  // Footer
  pdf.setFontSize(8);
  pdf.setTextColor(150, 150, 150);
  pdf.text('Generated by Hugo - Personality Assessment & Team Building Platform', margin, pageHeight - 10);
  pdf.text(`© ${new Date().getFullYear()} Hugo. All rights reserved.`, margin, pageHeight - 5);

  // Save PDF
  pdf.save(`Hugo_Assessment_${userData.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
};

/**
 * Alternative: Generate PDF from HTML element (for more complex layouts)
 * @param {HTMLElement} element - The HTML element to convert to PDF
 * @param {string} filename - The filename for the PDF
 * @returns {Promise<void>}
 */
export const generatePDFFromHTML = async (element, filename = 'assessment-result.pdf') => {
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false
  });

  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();
  const imgWidth = canvas.width;
  const imgHeight = canvas.height;
  const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
  const imgX = (pdfWidth - imgWidth * ratio) / 2;
  const imgY = 0;

  pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
  pdf.save(filename);
};
