import HomeView from "@/components/views/home-view";

export default function Page() {
  return (
    <div className="flex items-center justify-center overflow-hidden px-2 sm:px-6" style={{ height: "100svh" }}>
      <div className="w-full text-center" style={{ maxWidth: 460 }}>
        <HomeView />
      </div>
    </div>
  );
}
