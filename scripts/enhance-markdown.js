// scripts/enhance-markdown.js
const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");

const postsDirectory = path.join(process.cwd(), "blog");

// Enhance a single markdown file
function enhanceMarkdownFile(filePath) {
  const fileContent = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(fileContent);

  // Check if we need to update
  let needsUpdate = false;
  const updatedData = { ...data };

  // Update the file if needed
  if (needsUpdate) {
    const updatedFileContent = matter.stringify(content, updatedData);
    fs.writeFileSync(filePath, updatedFileContent);
    console.log(`Enhanced: ${path.basename(filePath)}`);
    return true;
  }

  return false;
}

// Process all markdown files
function enhanceAllMarkdownFiles() {
  const fileNames = fs.readdirSync(postsDirectory);
  let updatedCount = 0;

  fileNames.forEach((fileName) => {
    if (fileName.endsWith(".md")) {
      const filePath = path.join(postsDirectory, fileName);
      const updated = enhanceMarkdownFile(filePath);
      if (updated) updatedCount++;
    }
  });

  console.log(`Enhanced ${updatedCount} of ${fileNames.length} markdown files`);
}

// Run the enhancement
enhanceAllMarkdownFiles();
