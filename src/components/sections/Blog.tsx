import Link from "next/link";
import { getAllPosts } from "@/lib/blog";
import { PostList } from "@/components/blog/PostList";
import styles from "./Blog.module.css";

export function Blog() {
  const posts = getAllPosts();
  if (posts.length === 0) return null;

  return (
    <section
      className={styles.section}
      id="blog"
      aria-labelledby="blog-title"
    >
      <div className={styles.head}>
        <h2 id="blog-title" className={styles.title}>
          Writing ({String(posts.length).padStart(2, "0")})
        </h2>
        <Link href="/blog" className={styles.all} data-cursor="Open">
          All posts →
        </Link>
      </div>
      <PostList posts={posts} limit={3} />
    </section>
  );
}
