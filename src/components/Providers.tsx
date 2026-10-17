"use client";

import type { ReactNode } from "react";
import { MotionProvider } from "@/components/motion/MotionContext";
import { LenisProvider } from "@/components/motion/LenisProvider";
import { Preloader } from "@/components/motion/Preloader";
import { Cursor } from "@/components/motion/Cursor";
import { ContactProvider } from "@/components/contact/ContactContext";
import { ContactModal } from "@/components/contact/ContactModal";
import { SquiCircleFilterStatic } from "@/components/ui/skiper63";
import { SkiperGooeyFilterProvider } from "@/components/ui/skiper64";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <MotionProvider>
      <LenisProvider>
        <ContactProvider>
          <SquiCircleFilterStatic />
          <SkiperGooeyFilterProvider />
          <Preloader />
          <Cursor />
          <ContactModal />
          {children}
        </ContactProvider>
      </LenisProvider>
    </MotionProvider>
  );
}
