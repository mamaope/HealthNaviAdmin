export const formatMessage = (message) => {
  if (!message) return "";

  let formattedMsg = message;

  // bold text 
  formattedMsg = formattedMsg.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  
  // italic text 
  formattedMsg = formattedMsg.replace(/\*([^\*]+)\*/g, "<em>$1</em>");
  
  // underline text
  formattedMsg = formattedMsg.replace(/__((?!\s)[^_]+(?<!\s))__/g, "<u>$1</u>");

  // Process special alert sections
  formattedMsg = formattedMsg.replace(/ALERT:(.*?)(\n\n|\n(?=\*\*)|\n(?=[A-Z])|\n(?=\d+\.)|$)/gs, (match, alertContent) => {
    return `<div class="alert-section"><strong>ALERT:</strong>${alertContent}</div>`;
  });

  // Process numbered lists first
  let inNumberedList = false;
  let listContent = "";
  
  const lines = formattedMsg.split("\n");
  const processedLines = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const numberedListMatch = line.match(/^\s*(\d+)\.\s+(.*)/);
    
    if (numberedListMatch) {
      if (!inNumberedList) {
        inNumberedList = true;
        listContent = `<li>${numberedListMatch[2]}</li>`;
      } else {
        listContent += `<li>${numberedListMatch[2]}</li>`;
      }
    } else if (line.trim().match(/^\s*[-*•]\s+(.+)/)) {
      // Handle bullet points outside of numbered lists
      const bulletContent = line.trim().match(/^\s*[-*•]\s+(.+)/)[1];
      processedLines.push(`<ul><li>${bulletContent}</li></ul>`);
    } else {
      if (inNumberedList) {
        processedLines.push(`<ol>${listContent}</ol>`);
        inNumberedList = false;
        listContent = "";
      }
      processedLines.push(line);
    }
  }
  
  // Close any open lists
  if (inNumberedList) {
    processedLines.push(`<ol>${listContent}</ol>`);
  }
  
  formattedMsg = processedLines.join("\n");

  // Handle bullet points that were missed (convert to proper HTML lists)
  formattedMsg = formattedMsg.replace(/(?<!<\/li>\n)<ul><li>(.*?)<\/li><\/ul>/g, (match, content) => {
    return `<ul><li>${content}</li></ul>`;
  });
  
  // Combine adjacent bullet points into a single list
  formattedMsg = formattedMsg.replace(/<\/ul>\n<ul>/g, "");

  // Fix bullet points within section headings
  formattedMsg = formattedMsg.replace(/<div class="section-heading">(.+?)<\/div>\n<ul>/g, 
    '<div class="section-heading">$1</div><ul>');

  // section headings to format
  const headings = [
    "Question",
    "Questions",
    "Rationale",
    "Reasoning",
    "Analysis",
    "Assessment",
    "Diagnosis",
    "Impression",
    "Next [Ss]teps",
    "Plan",
    "Treatment Plan",
    "Further [Ii]nvestigations",
    "Recommendations", 
    "Additional Tests",
    "Differential Diagnosis",
    "Follow-up",
    "Prognosis",
    "Further Management",
  ];

  // Format section headings
  const headingRegex = new RegExp(`(${headings.join("|")}):`, "gi");
  formattedMsg = formattedMsg.replace(
    headingRegex,
    '<div class="section-heading"><strong>$1:</strong></div>'
  );

  // Replace newlines with <br/> for proper spacing
  formattedMsg = formattedMsg.replace(/\n\n/g, "<br/>");
  formattedMsg = formattedMsg.replace(/\n/g, "<br/>");

  return formattedMsg;
}; 
