// lib/posts.js - Update your existing file with these new functions

import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import gfm from "remark-gfm";

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

// New function to find related posts based on tags and content keywords
function findRelatedPosts(currentPostId, currentPostTags, allPosts) {
  // Convert tags to array if it's a string
  const tags =
    typeof currentPostTags === "string"
      ? currentPostTags.split(",").map((tag) => tag.trim().toLowerCase())
      : [];

  // Filter out the current post and find posts with similar tags
  return allPosts
    .filter((post) => post.id !== currentPostId)
    .map((post) => {
      let score = 0;

      // Check for shared tags - this is the strongest signal for relatedness
      const postTags =
        typeof post.tags === "string"
          ? post.tags.split(",").map((tag) => tag.trim().toLowerCase())
          : [];

      // Calculate tag overlap
      const sharedTags = tags.filter((tag) => postTags.includes(tag));
      score += sharedTags.length * 2; // Weight tag matches more heavily

      // Simple keyword matching from title/description
      const postKeywords = (post.title + " " + (post.desc || "")).toLowerCase();

      // Check for certain important keywords (customize for your content)
      const keywordsToCheck = ["lilin", "candle", "aromaterapi", "wax", "soy"];
      keywordsToCheck.forEach((keyword) => {
        if (
          postKeywords.includes(keyword) &&
          tags.some((tag) => tag.includes(keyword))
        ) {
          score += 1;
        }
      });

      return {
        ...post,
        relatednessScore: score,
      };
    })
    .filter((post) => post.relatednessScore > 0)
    .sort((a, b) => b.relatednessScore - a.relatednessScore)
    .slice(0, 3); // Get top 3 related posts
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

// Updated function to prevent nested links
function insertContextualLinks(content, allPosts, currentPostId) {
  // Create a map of keywords to posts for efficient lookup
  const keywordToPostMap = new Map();

  allPosts.forEach((post) => {
    if (post.id === currentPostId) return; // Skip current post

    // Extract main keywords from title
    const words = post.title.toLowerCase().split(/\s+/);
    words.forEach((word) => {
      // Only use significant words (longer than 3 chars)
      if (word.length > 3) {
        if (!keywordToPostMap.has(word)) {
          keywordToPostMap.set(word, []);
        }
        keywordToPostMap.get(word).push(post);
      }
    });

    // Also add full title as a phrase to match
    const normalizedTitle = post.title.toLowerCase();
    if (!keywordToPostMap.has(normalizedTitle)) {
      keywordToPostMap.set(normalizedTitle, []);
    }
    keywordToPostMap.get(normalizedTitle).push(post);
  });

  // Track which posts we've already linked to avoid duplicates
  const linkedPostIds = new Set();

  // Process content by paragraphs to maintain structure
  const paragraphs = content.split("\n\n");

  // Limit total inserted links
  const MAX_LINKS = 6;
  let insertedLinks = 0;

  const processedParagraphs = paragraphs.map((paragraph) => {
    // Skip if we've reached the max links or paragraph already has markdown links
    if (insertedLinks >= MAX_LINKS || paragraph.includes("](")) {
      return paragraph;
    }

    // Don't modify headings, code blocks, etc.
    if (
      paragraph.startsWith("#") ||
      paragraph.startsWith("```") ||
      paragraph.startsWith("!")
    ) {
      return paragraph;
    }

    // Create a map to track which parts of the paragraph are already linked
    // We'll use this to prevent overlapping or nested links
    const linkedRanges = [];

    // Sort keywords by length (descending) to prioritize longer phrases
    const sortedKeywords = Array.from(keywordToPostMap.keys()).sort(
      (a, b) => b.length - a.length
    );

    // Process each keyword
    for (const keyword of sortedKeywords) {
      // Only proceed if we haven't reached limit and haven't already linked this post
      const posts = keywordToPostMap.get(keyword);
      if (
        !posts ||
        !posts[0] ||
        insertedLinks >= MAX_LINKS ||
        linkedPostIds.has(posts[0].id)
      ) {
        continue;
      }

      // Case-insensitive search
      const lowerParagraph = paragraph.toLowerCase();
      let keywordIndex = lowerParagraph.indexOf(keyword);

      if (keywordIndex !== -1) {
        // Check if this range overlaps with any existing linked range
        const keywordEnd = keywordIndex + keyword.length;
        const overlaps = linkedRanges.some(
          ([start, end]) =>
            (keywordIndex >= start && keywordIndex < end) || // Start inside existing range
            (keywordEnd > start && keywordEnd <= end) || // End inside existing range
            (keywordIndex <= start && keywordEnd >= end) // Completely contains existing range
        );

        if (!overlaps) {
          // Get the actual cased version from the original paragraph
          const actualKeyword = paragraph.substring(
            keywordIndex,
            keywordIndex + keyword.length
          );

          // Create a link to the related post
          const post = posts[0]; // Use the first post that matches this keyword
          const replacement = `[${actualKeyword}](/posts/${post.id})`;

          // Replace the keyword with the link
          paragraph =
            paragraph.substring(0, keywordIndex) +
            replacement +
            paragraph.substring(keywordIndex + actualKeyword.length);

          // Update our tracking
          linkedRanges.push([keywordIndex, keywordIndex + replacement.length]);
          linkedPostIds.add(post.id);
          insertedLinks++;

          // Since we modified the paragraph, we need to adjust our indices
          // for any keywords we find later
          const lengthDiff = replacement.length - actualKeyword.length;
          for (let i = 0; i < linkedRanges.length; i++) {
            if (linkedRanges[i][0] > keywordIndex) {
              linkedRanges[i][0] += lengthDiff;
              linkedRanges[i][1] += lengthDiff;
            }
          }
        }
      }
    }

    return paragraph;
  });

  // Insert a "Read more" section if we didn't add any contextual links
  if (insertedLinks === 0 && allPosts.length > 1) {
    // Find a relevant post to recommend
    const recommendedPost = allPosts
      .filter((post) => post.id !== currentPostId)
      .sort(() => 0.5 - Math.random())[0]; // Random selection

    if (recommendedPost) {
      processedParagraphs.push(
        `\n\n> **Baca juga:** [${recommendedPost.title}](/posts/${recommendedPost.id})`
      );
    }
  }

  return processedParagraphs.join("\n\n");
}

export async function getPostData(id) {
  const fullPath = path.join(postsDirectory, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents);

  // Get all posts to find related content
  const allPosts = getSortedPostsData();

  // Find related posts based on tags and content
  const relatedPosts = findRelatedPosts(id, matterResult.data.tags, allPosts);

  // Insert contextual links within the content
  let enhancedContent = insertContextualLinks(
    matterResult.content,
    allPosts,
    id
  );
  console.log("Enhanced Content:", enhancedContent);

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
  };
}
