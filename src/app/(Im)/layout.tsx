import Header from "@/components/Header";
import TopBar from "@/components/TopBar";

export default function RSLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
     <div className="flex flex-col md:flex-row h-screen">
      <div className="md:w-1/5 w-full">
        <Header />
      </div>
      <div className="flex-1 flex flex-col">
        <TopBar />
        <div className="flex-1 px-4 py-2 overflow-auto bg-gray-50">
          {children}
        </div>
      </div>
    </div>
  );
}