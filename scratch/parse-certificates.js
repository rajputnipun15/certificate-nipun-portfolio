const fs = require('fs');
const path = require('path');

const certDir = path.join(__dirname, '../public/certificates');
const files = fs.readdirSync(certDir);

console.log(`Found ${files.length} certificate files.`);

const certs = files.map((file, idx) => {
  const ext = path.extname(file).toLowerCase();
  const baseName = path.basename(file, ext);
  
  let title = baseName;
  let organization = "Coursera";
  let issueDate = "2024";
  let completionDate = "2024";
  let credentialId = "N/A";
  let verificationLink = "https://coursera.org/verify";
  let category = "Software Engineering";
  let skills = ["Software Engineering"];
  let featured = false;

  // Custom heuristics based on file names
  if (file.startsWith("Coursera")) {
    const parts = file.split(" ");
    const code = parts[1] ? parts[1].replace('.pdf', '') : '';
    organization = "Coursera";
    credentialId = code || `COURSERA-${idx+100}`;
    verificationLink = `https://coursera.org/verify/${code}`;
  } else if (file.startsWith("UC-")) {
    organization = "Udemy";
    credentialId = baseName;
    verificationLink = `https://udemy.com/uc/${baseName}`;
    category = "Web Development";
  } else if (file.includes("Getting Started with AI")) {
    title = "Getting Started with AI and Machine Learning";
    organization = "SkillUp / Simplilearn";
    category = "Artificial Intelligence";
    skills = ["Artificial Intelligence", "Machine Learning", "Python"];
    featured = true;
  } else if (file.includes("BI-20240710")) {
    title = "Business Intelligence & Data Analytics";
    organization = "Corporate Finance Institute";
    category = "Data Analytics";
    skills = ["Business Intelligence", "Data Analysis", "SQL"];
    featured = true;
  }

  return {
    id: `cert-${idx + 1}`,
    title,
    fileName: file,
    fileType: ext === '.pdf' ? 'pdf' : 'image',
    fileUrl: `/certificates/${encodeURIComponent(file)}`,
    organization,
    courseName: title,
    issueDate,
    completionDate,
    credentialId,
    verificationLink,
    category,
    skills,
    description: `Verified completion certificate for ${title} issued by ${organization}. Demonstrating mastery in ${skills.join(", ")}.`,
    featured,
    createdAt: new Date().toISOString()
  };
});

console.log(JSON.stringify(certs.slice(0, 5), null, 2));
