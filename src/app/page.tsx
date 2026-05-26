import HomeView from "@/components/views/home-view";

export default function Page() {
  return (
    <div className="flex items-center justify-center overflow-hidden px-1 sm:px-6" style={{ height: "100svh" }}>
      <h1 className="sr-only">
        Flo Lenormand - Product Designer, AI Agents at Meta Superintelligence Labs
      </h1>
      <p className="sr-only">
        Florent (Flo) Lenormand is a Product Designer at Meta Superintelligence
        Labs in San Francisco, designing AI agents. Previously, Florent
        Lenormand designed safety features on Instagram and expressiveness on
        Messenger.
      </p>
      <div className="w-full text-center" style={{ maxWidth: 460 }}>
        <HomeView />
      </div>
    </div>
  );
}
