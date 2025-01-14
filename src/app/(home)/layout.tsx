import Footer from "@/components/Footer";
import Header from "@/components/Header";
import SyncUserWithConvex from "@/components/SyncUserWithConvex";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <main className="grow">{children}</main>
      <Footer />
    </div>
  );
}
