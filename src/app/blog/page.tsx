import type { Metadata } from "next";
import { getAllPosts } from "@/lib/blog";
import { PostList } from "@/components/blog/PostList";
import { site } from "@/content/site";
import styles from "./blog.module.css";

export const metadata: Metadata = {
  title: "Blog",
  description: `Notes on building full-stack products, NestJS APIs, and systems, by ${site.name}.`,
  alternates: { canonical: "/blog" },
};

export default function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <section className={styles.page} aria-labelledby="blog-index-title">
      <div className={styles.head}>
        <p className={styles.eyebrow}>(Writing)</p>
        <h1 id="blog-index-title" className={styles.title}>
          Blog ({String(posts.length).padStart(2, "0")})
        </h1>
        <p className={styles.lede}>
          Product notes, NestJS APIs, and the problems behind the features.
        </p>
      </div>
      <PostList posts={posts} />
    </section>
  );
}
