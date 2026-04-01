import type { Sender } from "@/lib/chat-data";

type Reaction = {
  emoji: string;
  by: Sender;
};

type ChatBubbleProps = {
  text: string;
  sender: Sender;
  isLastInGroup: boolean;
  reaction?: Reaction;
};

export default function ChatBubble({
  text,
  sender,
  isLastInGroup,
  reaction,
}: ChatBubbleProps) {
  const isFlo = sender === "flo";

  const bubbleClasses = [
    "max-w-[75%] px-4 py-2 text-sm leading-relaxed",
    isFlo
      ? "ml-auto bg-bubble-blue text-white"
      : "mr-auto bg-bubble-gray text-bubble-gray-text",
    isLastInGroup
      ? isFlo
        ? "rounded-[18px] rounded-tr-[4px]"
        : "rounded-[18px] rounded-tl-[4px]"
      : isFlo
      ? "rounded-[18px] rounded-tr-[14px]"
      : "rounded-[18px] rounded-tl-[14px]",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={`flex flex-col ${isFlo ? "items-end" : "items-start"}`}>
      <div className={bubbleClasses}>{text}</div>
      {reaction && (
        <div className="text-xs bg-gray-100 border border-gray-200 rounded-full px-2 py-0.5 inline-flex items-center mt-1">
          {reaction.emoji}
        </div>
      )}
    </div>
  );
}
