// 1. Create a structured folder organization for multilingual content
// Example structure:
// /blog
//   /id (Indonesian content)
//     post-1.md
//     post-2.md
//   /en (English content)
//     post-1.md
//     post-2.md
//   /es (Spanish content)
//     post-1.md
//     post-2.md

// 2. Update your lib/posts.js to support language selection

import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import gfm from "remark-gfm";
import { insertContextualLinks, findRelatedPosts } from "./functions";
import { parseFAQSection, parseHowToSection } from "./parser";

// Define available languages
export const LANGUAGES = {
  id: "Bahasa Indonesia",
  en: "English",
  // Add more languages as needed
};

// Default language
export const DEFAULT_LANGUAGE = "id";

// Get posts directory based on language
function getPostsDirectory(language = DEFAULT_LANGUAGE) {
  return path.join(process.cwd(), "blog", language);
}

// Get all available languages for a specific post
export function getAvailableLanguagesForPost(postId) {
  const availableLanguages = {};

  Object.keys(LANGUAGES).forEach((langCode) => {
    const langDir = getPostsDirectory(langCode);
    const postPath = path.join(langDir, `${postId}.md`);

    if (fs.existsSync(postPath)) {
      availableLanguages[langCode] = LANGUAGES[langCode];
    }
  });

  return availableLanguages;
}

// Get all posts data with language support
export function getSortedPostsData(language = DEFAULT_LANGUAGE) {
  const postsDirectory = getPostsDirectory(language);

  // Check if language directory exists
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  // Get file names under language directory
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames.map((fileName) => {
    // Remove ".md" from file name to get id
    const id = fileName.replace(/\.md$/, "");

    // Read markdown file as string
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents);

    // Get available translations
    const availableLanguages = getAvailableLanguagesForPost(id);

    // Combine the data with the id and language info
    return {
      id,
      language,
      availableLanguages,
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

// Get all post IDs with language support
export function getAllPostIds() {
  let allPostIds = [];

  // Collect post IDs from all language directories
  Object.keys(LANGUAGES).forEach((language) => {
    const postsDirectory = getPostsDirectory(language);

    // Skip if language directory doesn't exist
    if (!fs.existsSync(postsDirectory)) {
      return;
    }

    const fileNames = fs.readdirSync(postsDirectory);
    const langPostIds = fileNames.map((fileName) => {
      return {
        params: {
          id: fileName.replace(/\.md$/, ""),
          language,
        },
      };
    });

    allPostIds = [...allPostIds, ...langPostIds];
  });

  return allPostIds;
}

// Insert suggestion to read related articles with localized text
function insertRelatedPostLinks(content, relatedPosts, language) {
  if (!relatedPosts || relatedPosts.length === 0) return content;

  // Localized heading text
  const relatedArticlesText = {
    id: "Artikel Terkait",
    en: "Related Articles",
    // Add more translations as needed
  };

  // Use the localized heading or fallback to English
  const heading = relatedArticlesText[language] || relatedArticlesText.en;

  // Create markdown for related posts section
  let relatedLinksMarkdown = `\n\n### ${heading}\n`;
  relatedPosts.forEach((post) => {
    relatedLinksMarkdown += `* [${post.title}](/posts/${language}/${post.id})\n`;
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

// Get post data with language support
export async function getPostData(id, language = DEFAULT_LANGUAGE) {
  const postsDirectory = getPostsDirectory(language);
  const fullPath = path.join(postsDirectory, `${id}.md`);

  // If the post doesn't exist in the requested language, try falling back to default
  if (!fs.existsSync(fullPath) && language !== DEFAULT_LANGUAGE) {
    const defaultPath = path.join(
      getPostsDirectory(DEFAULT_LANGUAGE),
      `${id}.md`
    );

    if (fs.existsSync(defaultPath)) {
      return getPostData(id, DEFAULT_LANGUAGE);
    }

    throw new Error(`Post ${id} not found in any language`);
  }

  const fileContents = fs.readFileSync(fullPath, "utf8");

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents);

  // Get all posts in the current language to find related content
  const allPosts = getSortedPostsData(language);

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

  // Insert related posts section with localized text
  enhancedContent = insertRelatedPostLinks(
    enhancedContent,
    relatedPosts,
    language
  );

  // Use remark to convert markdown into HTML string
  const processedContent = await remark()
    .use(html)
    .use(gfm)
    .process(enhancedContent);
  const contentHtml = processedContent.toString();

  // Get available translations for this post
  const availableLanguages = getAvailableLanguagesForPost(id);

  // Combine the data with the id, language, and contentHtml
  return {
    id,
    language,
    availableLanguages,
    contentHtml,
    ...matterResult.data,
    relatedPosts,
    faq,
    howTo,
  };
}
