import type { Metadata } from "next";
import { messages } from "@/lib/chat-data";

export const metadata: Metadata = {
  title: "About - Flo Lenormand",
};

export default function About() {
  return (
    <div className="pt-8">
      <div className="space-y-5">
        {messages.map((message, index) => {
          const prevMessage = messages[index - 1];
          const isNewGroup = !prevMessage || prevMessage.sender !== message.sender;
          const isFlo = message.sender === "flo";

          return (
            <div
              key={message.id}
              className={`flex gap-6 items-baseline${isNewGroup && index !== 0 ? " mt-8" : ""}`}
            >
              <span className="text-xs text-gray-400 uppercase tracking-widest w-8 shrink-0 leading-relaxed pt-px">
                {isNewGroup ? (isFlo ? "Flo" : "Mum") : ""}
              </span>
              <div>
                <p className="text-base md:text-lg text-gray-800 leading-relaxed">
                  {message.text}
                </p>
                {message.reaction && (
                  <span className="text-sm text-gray-400 mt-1 block">
                    {message.reaction.emoji}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-16 pt-8 border-t border-gray-200">
        <p className="text-sm text-gray-500 mb-1">
          if this resonated, i&apos;d love to hear from you.
        </p>
        <a
          href="mailto:florent.lenormand@icloud.com"
          className="text-sm text-gray-700 underline decoration-gray-300 underline-offset-2 hover:decoration-gray-600 transition-colors"
        >
          florent.lenormand@icloud.com
        </a>
      </div>
    </div>
  );
}
