import Link from "next/link";
import { getAllArticles } from "@/lib/articles";

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
  });
}

export default function Home() {
  const articles = getAllArticles();

  return (
    <div className="pt-8">
      {/* Intro */}
      <section className="mb-16">
        <p className="text-base md:text-lg text-gray-600 leading-relaxed max-w-xl">
          Product Designer at Meta, designing AI agents.
          <br />
          I write about design, AI, and the things I get wrong.
        </p>
      </section>

      {/* Articles */}
      <section>
        <div className="space-y-6">
          {articles.map((article) => {
            const isExternal = !!article.external;
            const Component = isExternal ? "a" : Link;
            const props = isExternal
              ? {
                  href: article.external!,
                  target: "_blank" as const,
                  rel: "noopener noreferrer",
                }
              : { href: `/writing/${article.slug}` };

            return (
              <article key={article.slug} className="group">
                <Component
                  {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string })}
                  className="block"
                >
                  <div className="flex items-baseline justify-between gap-4">
                    <h2 className="text-base text-gray-900 group-hover:text-gray-600 transition-colors leading-snug">
                      {article.title}
                      {isExternal && (
                        <span className="text-gray-400 text-sm ml-1">
                          &#8599;
                        </span>
                      )}
                    </h2>
                    <time className="text-sm text-gray-400 whitespace-nowrap shrink-0">
                      {formatDate(article.date)}
                    </time>
                  </div>
                  {article.description && (
                    <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                      {article.description}
                    </p>
                  )}
                </Component>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
