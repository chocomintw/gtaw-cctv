// app/components/cctv-header.tsx
"use client";

import { Search, Shield, Bell, Sun, Moon } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useCCTVStore } from "../stores/cctv-store";
import { useTheme } from "next-themes";

export default function CCTVHeader() {
  const { filter, setFilter } = useCCTVStore();
  const { theme, setTheme } = useTheme();

  return (
    <header className="glass-card rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 animate-in fade-in slide-in-from-top-4 duration-700">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-600/20">
          <Shield size={28} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 tracking-tight">
            GTA:World CCTV Lookup
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 text-sm">
            Easily find CCTV locations and details.
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
        <div className="relative w-full sm:w-80 group">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
          <Input
            placeholder="Search locations, IDs, or types..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="pl-10 bg-neutral-50 dark:bg-zinc-800/50 border-neutral-200 dark:border-zinc-700 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all h-11"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-11 w-11 rounded-xl border-neutral-200 dark:border-zinc-700 hover:bg-neutral-50 dark:hover:bg-zinc-800 text-neutral-600 dark:text-neutral-400"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
          <Button variant="outline" size="icon" className="h-11 w-11 rounded-xl border-neutral-200 dark:border-zinc-700 hover:bg-neutral-50 dark:hover:bg-zinc-800 text-neutral-600 dark:text-neutral-400">
            <Bell size={18} />
          </Button>
        </div>
      </div>
    </header>
  );
}
