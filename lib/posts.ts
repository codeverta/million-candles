// lib/posts.js
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import gfm from "remark-gfm";
import {
  buildKeywordPostMap,
  addInternalLinks,
  addContextualLinks,
} from "./internalLinks";

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

export async function getPostData(id) {
  const fullPath = path.join(postsDirectory, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents);

  // Get all posts and build keyword map for internal linking
  const allPosts = getSortedPostsData();
  const keywordMap = buildKeywordPostMap();

  // Add internal links to the content
  // You can choose between addInternalLinks (section-based) or addContextualLinks (inline)
  const contentWithLinks = addContextualLinks(
    matterResult.content,
    id,
    allPosts,
    keywordMap,
    3 // Maximum number of links to add
  );

  // Use remark to convert markdown into HTML string
  const processedContent = await remark()
    .use(html)
    .use(gfm)
    .process(contentWithLinks);

  const contentHtml = processedContent.toString();

  // Combine the data with the id and contentHtml
  return {
    id,
    contentHtml,
    ...matterResult.data,
  };
}

// Optional: Add this function if you want to preprocess all posts at build time
export async function preprocessAllPosts() {
  const allPosts = getSortedPostsData();
  const keywordMap = buildKeywordPostMap();

  for (const post of allPosts) {
    const fullPath = path.join(postsDirectory, `${post.id}.md`);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const matterResult = matter(fileContents);

    // Add internal links
    const contentWithLinks = addContextualLinks(
      matterResult.content,
      post.id,
      allPosts,
      keywordMap,
      3
    );

    // Write back to the file if content changed
    if (contentWithLinks !== matterResult.content) {
      const updatedFileContent = matter.stringify(
        contentWithLinks,
        matterResult.data
      );
      fs.writeFileSync(fullPath, updatedFileContent);
      console.log(`Updated internal links in: ${post.id}`);
    }
  }

  console.log("Finished preprocessing all posts with internal links");
}
