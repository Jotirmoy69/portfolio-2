import { Header } from "@/components/sections/Header";
import { Hero } from "@/components/sections/Hero";
import { Marquee } from "@/components/sections/Marquee";
import { SelectedWork } from "@/components/sections/SelectedWork";
import { UpClose } from "@/components/sections/UpClose";
import { Statement } from "@/components/sections/Statement";
import { Services } from "@/components/sections/Services";
import { Blog } from "@/components/sections/Blog";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      <a href="#work" className="sr-only">
        Skip to content
      </a>
      <Header />
      <main id="main">
        <Hero />
        <Marquee />
        <SelectedWork />
        <UpClose />
        <Statement />
        <Services />
        <Blog />
      </main>
      <Footer />
    </>
  );
}
