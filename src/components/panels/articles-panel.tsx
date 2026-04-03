"use client";

interface Article {
  slug: string;
  title: string;
  date: string;
  description?: string;
  external?: string;
}

interface ArticlesPanelProps {
  articles: Article[];
  onClose: () => void;
}

export default function ArticlesPanel({
  articles,
  onClose,
}: ArticlesPanelProps) {
  return (
    <div
      className="h-full flex flex-col relative"
      style={{
        width: 550,
        backgroundImage: "url(/background-panel-mum.png)",
        backgroundSize: "cover",
        backgroundPosition: "left center",
        transform: "scaleX(-1)",
      }}
    >
      {/* Inner wrapper flipped back so content reads normally */}
      <div className="h-full flex flex-col" style={{ transform: "scaleX(-1)" }}>
        {/* Close button - top left, mirrored from mum panel */}
        <div className="flex justify-start p-4" style={{ paddingLeft: 140 }}>
          <button
            onClick={onClose}
            className="cursor-pointer"
          >
            <img src="/close-article.png" alt="Close" style={{ width: 24, height: 24 }} />
          </button>
        </div>

        {/* Article list - scrollable */}
        <div
          className="flex-1 overflow-y-auto px-8"
          style={{ scrollbarWidth: "none", paddingTop: "30vh", paddingBottom: "30vh" }}
        >
          <div className="flex flex-col gap-8 ml-auto" style={{ maxWidth: 354 }}>
            {articles.map((article) => {
              const href = article.external || `/writing/${article.slug}`;
              const isExternal = !!article.external;

              return (
                <a
                  key={article.slug}
                  href={href}
                  {...(isExternal
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className="block group"
                  style={{
                    transitionProperty: "transform",
                    transitionDuration: "150ms",
                    transitionTimingFunction: "ease-out",
                  }}
                >
                  <h3
                    className="font-medium text-black leading-snug"
                    style={{ fontSize: 18 }}
                  >
                    {article.title}
                    {isExternal && (
                      <span className="text-black/30 text-sm ml-1">↗</span>
                    )}
                  </h3>
                  {article.description && (
                    <p
                      className="text-black/50 mt-1 leading-relaxed overflow-hidden"
                      style={{
                        fontSize: 14,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical" as const,
                      }}
                    >
                      {article.description}
                    </p>
                  )}
                </a>
              );
            })}
          </div>
        </div>

        {/* Top fade gradient - only covers content area, not close button or paper edge */}
        <div
          className="absolute top-0 right-0 pointer-events-none"
          style={{
            height: 300,
            width: "70%",
            background: "linear-gradient(to bottom, white 20%, transparent 100%)",
          }}
        />

        {/* Bottom fade gradient - only covers content area, not paper edge */}
        <div
          className="absolute bottom-0 right-0 pointer-events-none"
          style={{
            height: 300,
            width: "70%",
            background: "linear-gradient(to top, white 20%, transparent 100%)",
          }}
        />
      </div>
    </div>
  );
}
