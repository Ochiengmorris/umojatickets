import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";

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
