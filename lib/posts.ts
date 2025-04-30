// lib/posts.js - Updated for multilingual support

import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import gfm from "remark-gfm";
import { insertContextualLinks, findRelatedPosts } from "./functions";
import { parseFAQSection, parseHowToSection } from "./parser";

// Base blog directory
const blogBaseDirectory = path.join(process.cwd(), "blog");

// Get all supported languages
export function getSupportedLanguages() {
  // Read all directories under /blog
  return fs
    .readdirSync(blogBaseDirectory, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);
}

// Get posts for a specific language
export function getSortedPostsData(lang = "en") {
  const langDirectory = path.join(blogBaseDirectory, lang);

  // Check if language directory exists
  if (!fs.existsSync(langDirectory)) {
    return [];
  }

  // Get file names under /blog/[lang]
  const fileNames = fs.readdirSync(langDirectory);
  const allPostsData = fileNames.map((fileName) => {
    // Remove ".md" from file name to get id
    const id = fileName.replace(/\.md$/, "");

    // Read markdown file as string
    const fullPath = path.join(langDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents);

    // Combine the data with the id and language
    return {
      id,
      lang,
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

// Get all posts across all languages
export function getAllPostsData() {
  const languages = getSupportedLanguages();
  let allPosts = [];

  languages.forEach((lang) => {
    const langPosts = getSortedPostsData(lang);
    allPosts = [...allPosts, ...langPosts];
  });

  return allPosts;
}

export function getAllPostIds() {
  const languages = getSupportedLanguages();
  let allPostIds = [];

  languages.forEach((lang) => {
    const langDirectory = path.join(blogBaseDirectory, lang);
    const fileNames = fs.readdirSync(langDirectory);

    const langPostIds = fileNames.map((fileName) => {
      return {
        params: {
          lang,
          id: fileName.replace(/\.md$/, ""),
        },
      };
    });

    allPostIds = [...allPostIds, ...langPostIds];
  });

  return allPostIds;
}

// Insert suggestion to read related articles
function insertRelatedPostLinks(content, relatedPosts, lang) {
  if (!relatedPosts || relatedPosts.length === 0) return content;

  // Create markdown for related posts section - adjust heading based on language
  let heading = "### Related Articles";
  if (lang === "id") heading = "### Artikel Terkait";
  if (lang === "zh") heading = "### 相关文章";

  let relatedLinksMarkdown = `\n\n${heading}\n`;
  relatedPosts.forEach((post) => {
    relatedLinksMarkdown += `* [${post.title}](/${post.lang}/posts/${post.id})\n`;
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

export async function getPostData(id, lang = "id") {
  // Define the fallback language order
  const languageFallbacks = [lang, ...getSupportedLanguages()]; // Try requested language first, then English, then Chinese

  let fileContents;
  let usedLanguage = lang;
  let fullPath;

  // Try each language in the fallback sequence
  for (const currentLang of languageFallbacks) {
    try {
      fullPath = path.join(blogBaseDirectory, currentLang, `${id}.md`);
      fileContents = fs.readFileSync(fullPath, "utf8");
      usedLanguage = currentLang; // Store which language was successfully found
      break; // Exit the loop if file is found
    } catch (error) {
      if (error.code === "ENOENT") {
        continue; // Try next language
      } else {
        throw error; // Rethrow if it's a different error
      }
    }
  }

  // If file is still not found after all fallbacks
  if (!fileContents) {
    throw new Error(
      `Post ${id} not found in any language: ${languageFallbacks.join(", ")}`
    );
  }

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents);

  // Get all posts in the same language to find related content
  const allPosts = getSortedPostsData(usedLanguage);

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
  enhancedContent = insertRelatedPostLinks(
    enhancedContent,
    relatedPosts,
    usedLanguage
  );

  // Use remark to convert markdown into HTML string
  const processedContent = await remark()
    .use(html)
    .use(gfm)
    .process(enhancedContent);
  const contentHtml = processedContent.toString();

  // Combine the data with the id, language, and contentHtml
  return {
    id,
    lang: usedLanguage, // Return the language that was actually used
    contentHtml,
    ...matterResult.data,
    relatedPosts,
    faq,
    howTo,
    // translatedFrom: usedLanguage !== lang ? usedLanguage : undefined, // Indicate if content was from a fallback language
  };
}
