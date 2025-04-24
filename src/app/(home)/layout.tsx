import Footer from "@/components/landing/Footer";
import Header from "@/components/layout/Header";
import NextTopLoader from "nextjs-toploader";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NextTopLoader showSpinner={false} />
      <div className="flex flex-col h-full overflow-y-auto">
        <Header />
        <main className="flex-1 ">{children}</main>
        <Footer />
      </div>
    </>
  );
}
