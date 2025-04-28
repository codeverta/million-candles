// lib/posts.js - Update your existing file with these new functions

import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import gfm from "remark-gfm";
import { insertContextualLinks, findRelatedPosts } from "./functions";
import { parseFAQSection, parseHowToSection } from "./parser";

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
