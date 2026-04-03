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
    return {
      title: `${article.title} - Flo`,
      description: article.description,
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
