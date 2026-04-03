import { getAllArticles, getArticleBySlug } from "@/lib/articles";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ArticleContent from "./article-content";

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  const articles = getAllArticles();
  return articles
    .filter((a) => !a.external)
    .map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const article = await getArticleBySlug(slug);
    const url = `/writing/${slug}`;
    return {
      title: `${article.title} - Flo`,
      description: article.description,
      alternates: { canonical: url },
      openGraph: {
        title: article.title,
        description: article.description,
        type: "article",
        url,
        images: [{ url: "/avatar.jpg", width: 1200, height: 630, alt: article.title }],
      },
      twitter: {
        card: "summary_large_image",
        title: article.title,
        description: article.description,
        images: ["/avatar.jpg"],
      },
    };
  } catch {
    return { title: "Not Found" };
  }
}

export default async function ArticlePage({
  params,
}: {
  params: Params;
}) {
  const { slug } = await params;
  let article;
  try {
    article = await getArticleBySlug(slug);
  } catch {
    notFound();
  }

  if (article.published === false) {
    notFound();
  }

  return (
    <ArticleContent
      title={article.title}
      content={article.content}
    />
  );
}
