import Link from "next/link";
import { formatPostDate, type BlogPostMeta } from "@/lib/blog";
import styles from "./PostList.module.css";

type Props = {
  posts: BlogPostMeta[];
  /** Limit for homepage preview */
  limit?: number;
};

export function PostList({ posts, limit }: Props) {
  const list = typeof limit === "number" ? posts.slice(0, limit) : posts;

  return (
    <div className={styles.list}>
      {list.map((post, i) => (
        <Link
          key={post.slug}
          href={`/blog/${post.slug}`}
          className={styles.row}
          data-cursor="Open"
        >
          <span className={styles.index} aria-hidden>
            {String(i + 1).padStart(2, "0")}
          </span>
          <span className={styles.title}>{post.title}</span>
          <time className={styles.date} dateTime={post.date}>
            {formatPostDate(post.date)}
          </time>
          <div className={styles.meta}>
            <span className={styles.desc}>{post.description}</span>
            <span className={styles.read}>Read →</span>
          </div>
        </Link>
      ))}
    </div>
  );
}
