// src/pages/home.tsx
import React from "react";
import { Link } from "wouter";
import { Button } from "../components/ui/button";
import logo from "../assets/Blue.svg";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur border-b border-border">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logo} alt="FINTRAK" className="h-6 w-auto" />
            <span className="sr-only">FINTRAK</span>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/inventory">
              <Button variant="ghost" size="sm">Inventory</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4">
        <h1 className="text-xl font-semibold mb-2">Home</h1>
        <p className="text-sm text-muted-foreground">
          Minimal placeholder to get the build passing. We can re-add calculators and data once paths are aligned.
        </p>
      </main>
    </div>
  );
}
