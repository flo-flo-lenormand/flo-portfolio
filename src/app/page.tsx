import HomeView from "@/components/views/home-view";

export default function Page() {
  return (
    <div className="h-screen flex items-center justify-center px-6 overflow-hidden">
      <div style={{ width: 460 }}>
        <HomeView />
      </div>
    </div>
  );
}
