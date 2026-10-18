import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { formatPostDate, type BlogPost } from "@/lib/blog";
import { site } from "@/content/site";
import { siteUrl } from "@/content/seo";
import styles from "./PostArticle.module.css";

export function PostArticle({ post }: { post: BlogPost }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      "@type": "Person",
      name: site.name,
      url: siteUrl,
    },
    mainEntityOfPage: `${siteUrl}/blog/${post.slug}`,
    keywords: post.tags.join(", "),
  };

  return (
    <article className={styles.article}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Link href="/blog" className={styles.back} data-cursor="Open">
        ← All posts
      </Link>
      <div className={styles.meta}>
        <time dateTime={post.date}>{formatPostDate(post.date)}</time>
        {post.tags.length > 0 ? (
          <div className={styles.tags}>
            {post.tags.map((tag) => (
              <span key={tag} className={styles.tag}>
                {tag}
              </span>
            ))}
          </div>
        ) : null}
      </div>
      <h1 className={styles.title}>{post.title}</h1>
      {post.description ? (
        <p className={styles.description}>{post.description}</p>
      ) : null}
      <div className={styles.prose}>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
      </div>
    </article>
  );
}
