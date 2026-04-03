import { getAllArticles } from "@/lib/articles";
import PortfolioShell from "./portfolio-shell";

export default function Page() {
  const articles = getAllArticles().map((a) => ({
    slug: a.slug,
    title: a.title,
    date: a.date,
    description: a.description,
    external: a.external,
  }));

  return <PortfolioShell articles={articles} />;
}
