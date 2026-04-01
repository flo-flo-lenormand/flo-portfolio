import { getAllArticles, getArticleBySlug } from "@/lib/articles";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

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
      title: `${article.title} - Flo Lenormand`,
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

  const date = new Date(article.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <article className="pt-8">
      <Link
        href="/"
        className="text-sm text-gray-400 hover:text-gray-600 transition-colors mb-8 inline-block"
      >
        &larr; Back
      </Link>

      <header className="mb-10">
        <h1 className="text-[28px] font-semibold text-gray-900 leading-tight tracking-[-0.02em] mb-3">
          {article.title}
        </h1>
        <time className="text-sm text-gray-400">{date}</time>
      </header>

      <div
        className="prose"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />
    </article>
  );
}
