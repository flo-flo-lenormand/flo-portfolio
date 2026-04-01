import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About - Flo Lenormand",
};

export default function About() {
  return (
    <div className="pt-8">
      <h1 className="text-[36px] font-extrabold text-gray-900 leading-tight tracking-tight mb-8">About</h1>

      <div className="space-y-5 text-gray-800 leading-relaxed">
        <p>
          I&apos;m Flo, a product designer at Meta. I currently work at Meta
          Superintelligence Labs (MSL), designing AI agent experiences. Before
          that I spent six years on Messenger and Instagram - first building
          safety systems to protect people from scams, harassment, and unwanted
          interactions, then working on media experiences and how photos and
          videos get shared in conversations.
        </p>

        <p>
          I started in design the unusual way. I studied French literature at the
          Sorbonne, then switched to product design at EnsAD (Arts D&eacute;coratifs)
          in Paris. My first time in San Francisco was as an intern at SpotAngels,
          a tiny parking app. I came back later as their only designer and we got
          featured by Apple three times in one year. My parents were very proud,
          which is the only metric that matters.
        </p>

        <p>
          I care about craft and the details most people don&apos;t notice.
          I build functional prototypes with SwiftUI, Next.js, and Claude Code
          because I think the best way to explain an idea is to let people touch
          it. I also run an initiative at Meta called &quot;Designers Ship
          Diffs&quot; where I teach designers to write and ship code directly.
        </p>

        <p>
          Outside of work I live in France with my partner Emma (also a designer,
          which means we argue about spacing at dinner) and our daughter Michelle.
          I surf when there are waves, hike when there aren&apos;t, and
          occasionally build AI agents that sell my family&apos;s old clothes
          online.
        </p>

        <p className="text-gray-500 text-sm mt-8">
          If you want to talk about any of this, I&apos;m{" "}
          <a
            href="https://www.threads.net/@flo_lenormand"
            className="underline decoration-gray-200 underline-offset-2 hover:decoration-gray-500 transition-colors"
          >
            @flo_lenormand on Threads
          </a>{" "}
          or you can{" "}
          <a
            href="mailto:florent.lenormand@icloud.com"
            className="underline decoration-gray-200 underline-offset-2 hover:decoration-gray-500 transition-colors"
          >
            email me
          </a>
          .
        </p>
      </div>
    </div>
  );
}
