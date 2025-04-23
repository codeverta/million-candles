// lib/posts.js - Update your existing file with these new functions

import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import gfm from "remark-gfm";
import { insertContextualLinks, findRelatedPosts } from "./functions";

const postsDirectory = path.join(process.cwd(), "blog");

export function getSortedPostsData() {
  // Get file names under /posts
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames.map((fileName) => {
    // Remove ".md" from file name to get id
    const id = fileName.replace(/\.md$/, "");

    // Read markdown file as string
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents);

    // Combine the data with the id
    return {
      id,
      ...matterResult.data,
    };
  });
  // Sort posts by date
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

export function getAllPostIds() {
  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames.map((fileName) => {
    return {
      params: {
        id: fileName.replace(/\.md$/, ""),
      },
    };
  });
}

// Insert suggestion to read related articles
function insertRelatedPostLinks(content, relatedPosts) {
  if (!relatedPosts || relatedPosts.length === 0) return content;

  // Create markdown for related posts section
  let relatedLinksMarkdown = "\n\n### Artikel Terkait\n";
  relatedPosts.forEach((post) => {
    relatedLinksMarkdown += `* [${post.title}](/posts/${post.id})\n`;
  });

  // Add a horizontal rule before recommended posts
  relatedLinksMarkdown = "\n\n---" + relatedLinksMarkdown;

  // Find a good place to insert links - before the last paragraph or at the end
  const paragraphs = content.split("\n\n");

  if (paragraphs.length > 3) {
    // Insert before the last paragraph (which might be a conclusion)
    const insertPosition = paragraphs.length - 1;
    paragraphs.splice(insertPosition, 0, relatedLinksMarkdown);
    return paragraphs.join("\n\n");
  } else {
    // If post is short, just append at the end
    return content + relatedLinksMarkdown;
  }
}

// lib/posts.js - Add these parsing functions

// Parse FAQ sections from markdown content
function parseFAQSection(content) {
  // First, find the FAQ section
  const faqSectionRegex = /##\s+(FAQ|Frequently Asked Questions)/i;
  const faqSectionMatch = content.match(faqSectionRegex);

  if (!faqSectionMatch) return null;

  // Get the starting index of the FAQ section
  const faqStartIndex = faqSectionMatch.index;

  // Find the next section heading (if any)
  const nextSectionRegex = /\n##\s+/g;
  nextSectionRegex.lastIndex = faqStartIndex + faqSectionMatch[0].length;
  const nextSectionMatch = nextSectionRegex.exec(content);

  // Get the content between FAQ heading and next section (or end of string)
  const endIndex = nextSectionMatch ? nextSectionMatch.index : content.length;
  const faqSection = content.substring(faqStartIndex, endIndex);

  // Now extract questions and answers
  const items = [];
  const qaRegex = /###\s*(.*?)\s*\n([\s\S]*?)(?=###|##|$)/g;
  let qaMatch;

  while ((qaMatch = qaRegex.exec(faqSection)) !== null) {
    // Skip the first match if it's just the "## FAQ" heading with no content
    if (qaMatch[1].match(/^\s*(FAQ|Frequently Asked Questions)\s*$/i)) continue;

    const question = qaMatch[1].trim().replace(/^Q:\s*/i, "");
    const answer = qaMatch[2].trim();

    if (question && answer) {
      items.push({ question, answer });
    }
  }

  return items.length > 0 ? items : null;
}
// Parse HowTo sections from markdown content
function parseHowToSection(content: string) {
  // Look for sections that start with ## How to
  const howToRegex = /## (?:How to|Cara) (.*?)(?=##|$)/i;
  const howToMatch = content.match(howToRegex);

  if (!howToMatch) return null;

  const howToTitle = howToMatch[1].trim();
  const howToContent = howToMatch[0].trim();

  // Extract description (first paragraph after title)
  const descriptionMatch = howToContent.match(
    /## How to .*?\n\n(.*?)(?=\n\n|$)/
  );
  const description = descriptionMatch ? descriptionMatch[1].trim() : "";

  // Extract steps - assuming they start with "### Langkah X:" or "### X."
  const steps = [];
  const stepRegex = /### (?:Langkah )?(\d+)[:.](.*?)(?=### (?:Step )?|$)/gs;
  let stepMatch;

  while ((stepMatch = stepRegex.exec(howToContent)) !== null) {
    const stepName = stepMatch[2].trim().split("\n")[0];
    const stepText = stepMatch[2].trim().split("\n").slice(1).join("\n").trim();

    // Extract image if there's any in markdown format
    const imageMatch = stepText.match(/!\[.*?\]\((.*?)\)/);
    const image = imageMatch ? imageMatch[1] : null;

    steps.push({
      name: stepName,
      text: stepText,
      image,
    });
  }

  // Look for supplies/tools sections
  const suppliesMatch = howToContent.match(
    /### (?:Supplies|Materials) Needed:?\n([\s\S]*?)(?=###|$)/i
  );
  const supplies = suppliesMatch
    ? suppliesMatch[1]
        .trim()
        .split("\n")
        .filter(
          (line) => line.trim().startsWith("*") || line.trim().startsWith("-")
        )
        .map((line) => line.replace(/^\s*[*-]\s*/, "").trim())
    : [];

  const toolsMatch = howToContent.match(
    /### Tools Needed:?\n([\s\S]*?)(?=###|$)/i
  );
  const tools = toolsMatch
    ? toolsMatch[1]
        .trim()
        .split("\n")
        .filter(
          (line) => line.trim().startsWith("*") || line.trim().startsWith("-")
        )
        .map((line) => line.replace(/^\s*[*-]\s*/, "").trim())
    : [];

  // Look for time estimation
  const timeMatch = howToContent.match(/Time: (.*?)(?=\n|$)/i);
  const time = timeMatch ? convertToISO8601Duration(timeMatch[1].trim()) : null;

  // This is what we'll return if we found steps
  if (steps.length > 0) {
    return {
      title: `How to ${howToTitle}`,
      description,
      steps,
      supplies,
      tools,
      totalTime: time,
    };
  }

  return null;
}

// Helper function to convert human-readable time to ISO 8601 duration format
function convertToISO8601Duration(timeString: string) {
  // Simple conversion for common formats like "30 minutes", "2 hours", etc.
  const minutesMatch = timeString.match(/(\d+)\s*(?:min|minute|minutes)/i);
  if (minutesMatch) {
    return `PT${minutesMatch[1]}M`;
  }

  const hoursMatch = timeString.match(/(\d+)\s*(?:hr|hour|hours)/i);
  if (hoursMatch) {
    return `PT${hoursMatch[1]}H`;
  }

  const hoursAndMinutesMatch = timeString.match(
    /(\d+)\s*(?:hr|hour|hours).*?(\d+)\s*(?:min|minute|minutes)/i
  );
  if (hoursAndMinutesMatch) {
    return `PT${hoursAndMinutesMatch[1]}H${hoursAndMinutesMatch[2]}M`;
  }

  // Default to 30 minutes if we can't parse
  return "PT30M";
}

// Modify your existing getPostData function to include FAQ and HowTo data
export async function getPostData(id) {
  const fullPath = path.join(postsDirectory, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents);

  // Get all posts to find related content
  const allPosts = getSortedPostsData();

  // Find related posts based on tags and content
  const relatedPosts = findRelatedPosts(id, matterResult.data.tags, allPosts);

  // Parse FAQ and HowTo sections from content
  const faq = parseFAQSection(matterResult.content);
  const howTo = parseHowToSection(matterResult.content);

  // Insert contextual links within the content
  let enhancedContent = insertContextualLinks(
    matterResult.content,
    allPosts,
    id
  );

  // Insert related posts section
  enhancedContent = insertRelatedPostLinks(enhancedContent, relatedPosts);

  // Use remark to convert markdown into HTML string
  const processedContent = await remark()
    .use(html)
    .use(gfm)
    .process(enhancedContent);
  const contentHtml = processedContent.toString();

  // Combine the data with the id and contentHtml
  return {
    id,
    contentHtml,
    ...matterResult.data,
    relatedPosts, // Include related posts data for use in the component
    faq, // Include FAQ data if exists
    howTo, // Include HowTo data if exists
  };
}
