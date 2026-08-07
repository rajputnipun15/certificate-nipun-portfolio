const fs = require('fs');
const path = require('path');
const { PDFDocument, StandardFonts, rgb } = require('pdf-lib');

async function generateResumePDF() {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595.28, 841.89]); // A4 Size
  const { width, height } = page.getSize();

  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

  let y = height - 40;

  // Header Title
  page.drawText('Nipun Kumar Kushwah', {
    x: 40,
    y: y,
    size: 22,
    font: fontBold,
    color: rgb(0.1, 0.2, 0.5),
  });

  y -= 18;

  // Subheader Links
  page.drawText('Linkedin: linkedin.com/in/nipunkumarkush', { x: 40, y: y, size: 9, font: fontRegular });
  page.drawText('Email: rajputnipun15@gmail.com', { x: 340, y: y, size: 9, font: fontRegular });

  y -= 14;
  page.drawText('Github: github.com/rajputnipun15', { x: 40, y: y, size: 9, font: fontRegular });
  page.drawText('Mobile: 7500560748', { x: 340, y: y, size: 9, font: fontRegular });

  y -= 18;
  page.drawLine({ start: { x: 40, y: y }, end: { x: 555, y: y }, thickness: 1, color: rgb(0.3, 0.3, 0.3) });

  // Section Generator Helper
  const addSectionHeader = (title) => {
    y -= 20;
    page.drawText(title, { x: 40, y: y, size: 12, font: fontBold, color: rgb(0.1, 0.2, 0.5) });
    y -= 6;
    page.drawLine({ start: { x: 40, y: y }, end: { x: 555, y: y }, thickness: 0.5, color: rgb(0.7, 0.7, 0.7) });
    y -= 14;
  };

  // SKILLS
  addSectionHeader('SKILLS');
  page.drawText('• Languages: C++, Javascript', { x: 45, y: y, size: 9, font: fontRegular }); y -= 13;
  page.drawText('• Frameworks: Node.js, Express.js, React.js, jQuery, Bootstrap', { x: 45, y: y, size: 9, font: fontRegular }); y -= 13;
  page.drawText('• Tools/Platforms: MySQL, MongoDB, Linux, Git, GitHub, VS Code, AWS (EC2, S3 – Basics)', { x: 45, y: y, size: 9, font: fontRegular }); y -= 13;
  page.drawText('• Soft Skills: Problem-Solving Skills, Team Collaboration, Adaptability, Multitasking', { x: 45, y: y, size: 9, font: fontRegular }); y -= 6;

  // PROJECTS
  addSectionHeader('PROJECTS');
  page.drawText('Autonomous AI Vehicle Website | (Github)', { x: 45, y: y, size: 10, font: fontBold, color: rgb(0.1, 0.2, 0.5) });
  page.drawText("Dec' 25", { x: 500, y: y, size: 9, font: fontBold }); y -= 13;
  page.drawText('• Designed and developed a full-stack MERN website featuring a futuristic luxury vehicle interface with a dark premium UI.', { x: 55, y: y, size: 8.5, font: fontRegular }); y -= 11;
  page.drawText('• Implemented glassmorphism effects, 3D hover animations, mouse-based tilt, parallax scrolling, and smooth transitions.', { x: 55, y: y, size: 8.5, font: fontRegular }); y -= 11;
  page.drawText('• Built a fully responsive, clean, and minimal layout to demonstrate creative front-end design and interactive UI/UX skills.', { x: 55, y: y, size: 8.5, font: fontRegular }); y -= 11;
  page.drawText('Tech: React.js, Node.js, Express.js, MongoDB, JavaScript, Tailwind CSS, Google Gemini API', { x: 55, y: y, size: 8.5, font: fontBold }); y -= 15;

  page.drawText('Autonomous-QA-Agent | (Github)', { x: 45, y: y, size: 10, font: fontBold, color: rgb(0.1, 0.2, 0.5) });
  page.drawText("Sept' 24", { x: 500, y: y, size: 9, font: fontBold }); y -= 13;
  page.drawText('• Developed an Autonomous QA Agent that autonomously tests web applications using browser exploration.', { x: 55, y: y, size: 8.5, font: fontRegular }); y -= 11;
  page.drawText('• Used JavaScript and Playwright to simulate human-like web interactions and generate structured quality insights.', { x: 55, y: y, size: 8.5, font: fontRegular }); y -= 11;
  page.drawText('Tech: JavaScript (Node.js), Playwright, Browser Automation, DOM Interaction, Git & GitHub', { x: 55, y: y, size: 8.5, font: fontBold }); y -= 6;

  // TRAINING
  addSectionHeader('TRAINING');
  page.drawText('Pregrad | Certificate', { x: 45, y: y, size: 10, font: fontBold, color: rgb(0.1, 0.2, 0.5) });
  page.drawText("Jun' 24- Sep' 24", { x: 470, y: y, size: 9, font: fontBold }); y -= 13;
  page.drawText('MERN Stack Development Training', { x: 55, y: y, size: 9, font: fontBold }); y -= 11;
  page.drawText('• Completed hands-on MERN Stack training covering React.js for frontend development, Node.js & Express.js for backend REST APIs.', { x: 55, y: y, size: 8.5, font: fontRegular }); y -= 11;
  page.drawText('• Built full-stack applications with CRUD operations, frontend–backend integration, and basic authentication workflows.', { x: 55, y: y, size: 8.5, font: fontRegular }); y -= 11;
  page.drawText('• Used industry tools like Postman, Git/GitHub, npm, and VS Code for API testing, version control, and development.', { x: 55, y: y, size: 8.5, font: fontRegular }); y -= 6;

  // CERTIFICATES
  addSectionHeader('CERTIFICATES');
  page.drawText('• UI|UX Designing (Certificate)', { x: 45, y: y, size: 9, font: fontRegular }); page.drawText("Dec' 25", { x: 500, y: y, size: 8.5, font: fontRegular }); y -= 12;
  page.drawText('• Cloud Computing with AWS (Certificate)', { x: 45, y: y, size: 9, font: fontRegular }); page.drawText("Sept' 24", { x: 500, y: y, size: 8.5, font: fontRegular }); y -= 12;
  page.drawText('• The Complete Full-Stack Web Development Bootcamp (Certificate)', { x: 45, y: y, size: 9, font: fontRegular }); page.drawText("Jan' 23", { x: 500, y: y, size: 8.5, font: fontRegular }); y -= 6;

  // ACHIEVEMENTS
  addSectionHeader('ACHIEVEMENTS');
  page.drawText('Wission Organisation x TechFest:', { x: 45, y: y, size: 9, font: fontBold }); y -= 12;
  page.drawText('• Coordinated communication between faculty, volunteers, and participants to ensure seamless collaboration.', { x: 55, y: y, size: 8.5, font: fontRegular }); y -= 11;
  page.drawText('• Managed schedules and on-ground activities to ensure smooth and timely fest execution.', { x: 55, y: y, size: 8.5, font: fontRegular }); y -= 13;
  page.drawText('TetraByte Hackathon:', { x: 45, y: y, size: 9, font: fontBold }); y -= 12;
  page.drawText('• Built a functional prototype within a limited timeframe.', { x: 55, y: y, size: 8.5, font: fontRegular }); y -= 11;
  page.drawText('• Applied problem-solving and debugging skills in a team environment.', { x: 55, y: y, size: 8.5, font: fontRegular }); y -= 6;

  // EDUCATION
  addSectionHeader('EDUCATION');
  page.drawText('Lovely Professional University', { x: 45, y: y, size: 9.5, font: fontBold, color: rgb(0.1, 0.2, 0.5) }); page.drawText('Punjab, India', { x: 480, y: y, size: 8.5, font: fontRegular }); y -= 12;
  page.drawText('Bachelor of Technology - Computer Science and Engineering: CGPA: 6.9', { x: 55, y: y, size: 8.5, font: fontRegular }); page.drawText("Aug' 22 – Present", { x: 465, y: y, size: 8.5, font: fontRegular }); y -= 14;

  page.drawText('M.D International School', { x: 45, y: y, size: 9.5, font: fontBold, color: rgb(0.1, 0.2, 0.5) }); page.drawText('Bijnor, U.P', { x: 490, y: y, size: 8.5, font: fontRegular }); y -= 12;
  page.drawText('Intermediate; Percentage: 75.8', { x: 55, y: y, size: 8.5, font: fontRegular }); page.drawText("Mar' 21 – May' 22", { x: 468, y: y, size: 8.5, font: fontRegular }); y -= 14;

  page.drawText('M.M Public School', { x: 45, y: y, size: 9.5, font: fontBold, color: rgb(0.1, 0.2, 0.5) }); page.drawText('Bijnor, U.P', { x: 490, y: y, size: 8.5, font: fontRegular }); y -= 12;
  page.drawText('Matriculation; Percentage: 88.4', { x: 55, y: y, size: 8.5, font: fontRegular }); page.drawText("Mar' 19 – May' 20", { x: 468, y: y, size: 8.5, font: fontRegular });

  const pdfBytes = await pdfDoc.save();
  const outputPath = path.join(__dirname, '../public/Nipun_Kumar_Kushwah_Resume.pdf');
  fs.writeFileSync(outputPath, pdfBytes);
  console.log('Resume PDF created successfully at:', outputPath);
}

generateResumePDF().catch(console.error);
