export type Sender = "flo" | "mum";

export type Message = {
  id: string;
  sender: Sender;
  text: string;
  reaction?: {
    emoji: string;
    by: Sender;
  };
};

export const messages: Message[] = [
  {
    id: "1",
    sender: "mum",
    text: "funny that you're my son and i still don't understand one bit of what you do. at least when I garden, I can see what I'm doing. With you I can't.",
  },
  {
    id: "2",
    sender: "flo",
    text: "i design message bubbles mum.",
  },
  {
    id: "3",
    sender: "mum",
    text: "what do you mean?",
  },
  {
    id: "4",
    sender: "flo",
    text: "well, i started with safety. my job was to make sure conversations stay safe on Messenger and Instagram Direct. i designed systems that stop the worst from happening before someone has to live through it.",
  },
  {
    id: "5",
    sender: "mum",
    text: "I always tell people you protect them on Amstragram",
  },
  {
    id: "6",
    sender: "flo",
    text: "then i designed media on Messenger. how photos and videos live inside a conversation. the way you react to an image. the way a video feels when you open it.",
    reaction: { emoji: "👍", by: "mum" },
  },
  {
    id: "7",
    sender: "flo",
    text: "funny, i once built a physics engine for emoji reactions. SpriteKit on iOS, Metal shaders on long press. the prototype made the whole project get approved. craft is the fastest way to make people care.",
  },
  {
    id: "8",
    sender: "mum",
    text: "i have no idea what you're talking about",
  },
  {
    id: "9",
    sender: "mum",
    text: "but now you work on AI.. what does design have to do with any of that?",
  },
  {
    id: "10",
    sender: "flo",
    text: "yeah that's a great question. robots are entering the chat and they can do impressive things. i'm working hard to make sure they solve actual problems.",
  },
  {
    id: "11",
    sender: "flo",
    text: "honestly.. what design means in this space keeps changing. and i love that",
  },
  {
    id: "12",
    sender: "mum",
    text: "funny to see where you ended up when I remember being so worried about you at school..",
  },
  {
    id: "13",
    sender: "flo",
    text: "yeah.. i remember. but i guess i needed some time to find what i cared about. art school did that, i graduated top of my class.",
  },
  {
    id: "14",
    sender: "mum",
    text: "yeah and after an art school you went to fix parking.. i never really understood why",
  },
  {
    id: "15",
    sender: "flo",
    text: "it was such a great opportunity. it got me to San Francisco, i was solo designer and Apple featured us three times!",
  },
  {
    id: "16",
    sender: "mum",
    text: "featured? i thought they were going to buy you",
    reaction: { emoji: "😂", by: "flo" },
  },
  {
    id: "17",
    sender: "mum",
    text: "anyways, let me know when you, Emma and Michelle are around, we have so many vegetables in the garden to eat!",
  },
];
