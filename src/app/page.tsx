import { getAllArticles } from "@/lib/articles";
import HomeContent from "./home-content";

export default function Home() {
  const articles = getAllArticles();
  return <HomeContent articles={articles} />;
}
