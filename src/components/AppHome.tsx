import Sidebar from "./Sidebar";

export default async function AppHome() {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8"></main>
    </div>
  );
}
