import { Header } from "@/components/sections/Header";
import { Footer } from "@/components/sections/Footer";

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main id="main">{children}</main>
      <Footer />
    </>
  );
}
