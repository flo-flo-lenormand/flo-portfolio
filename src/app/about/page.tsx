import type { Metadata } from "next";
import ChatBubble from "@/components/ChatBubble";
import { messages } from "@/lib/chat-data";

export const metadata: Metadata = {
  title: "About - Flo Lenormand",
};

export default function About() {
  return (
    <div className="pt-8">
      <div className="space-y-1">
        {messages.map((message, index) => {
          const nextMessage = messages[index + 1];
          const isLastInGroup =
            !nextMessage || nextMessage.sender !== message.sender;
          const prevMessage = messages[index - 1];
          const isFirstInGroup =
            !prevMessage || prevMessage.sender !== message.sender;

          return (
            <div
              key={message.id}
              className={isFirstInGroup && index !== 0 ? "pt-3" : ""}
            >
              <ChatBubble
                text={message.text}
                sender={message.sender}
                isLastInGroup={isLastInGroup}
                reaction={message.reaction}
              />
            </div>
          );
        })}
      </div>

      <div className="mt-12 pt-8 border-t border-gray-200">
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
