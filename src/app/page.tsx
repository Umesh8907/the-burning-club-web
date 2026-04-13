'use client';

import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { LandingHero } from "@/components/landing/LandingHero";
import { LandingFeatures } from "@/components/landing/LandingFeatures";
import { LandingCTA } from "@/components/landing/LandingCTA";
import { LandingFooter } from "@/components/landing/LandingFooter";

export default function Home() {
  return (
    <main className="min-h-screen bg-black">
      <LandingNavbar />
      <LandingHero />
      <div id="arsenal" className="bg-zinc-950">
        <LandingFeatures />
      </div>
      <LandingCTA />
      <LandingFooter />
    </main>
  );
}
