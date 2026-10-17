import { createFileRoute, Link } from "@tanstack/react-router";
import { Umbrella, CloudLightning, Coins, FileText, Compass, Plus, Menu, ChevronRight, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import ifLogoAsset from "@/assets/if-logo.png.asset.json";
import { pageHead } from "@/lib/page-head";
import { useMove } from "@/components/MoveProvider";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";

export const Route = createFileRoute("/")({
  head: () => pageHead("My If", "Your If start menu with daily activity and home safety sidequests."),
  component: IfHome,
});

const tiles = [
  { label: "Insurance", icon: Umbrella },
  { label: "Claims", icon: CloudLightning },
  { label: "Bills", icon: Coins },
  { label: "Documents", icon: FileText },
];

function IfHome() {
  const state = useMove();
  const [section, setSection] = useState<string | null>(null);
  return (
    <div className="min-h-screen bg-secondary">
      <header className="relative flex items-center justify-center border-b bg-background py-3">
        <img src={ifLogoAsset.url} alt="If" width={48} height={48} className="h-12 w-12" />
        <Button variant="ghost" onClick={() => setSection("Menu")} className="absolute right-5 h-auto flex-col text-xs">
          <Menu className="h-7 w-7" strokeWidth={1.2} />
          Menu
        </Button>
      </header>
      <main className="mx-auto max-w-md px-5 pb-16 pt-10">
        <h1 className="text-3xl font-light">Hello, Dear Customer</h1>
        <div className="mt-8 grid grid-cols-2 gap-4">
          {tiles.map(({ label, icon: Icon }, i) => (
            <Button variant="ghost" onClick={() => setSection(label)} key={label} style={{ animationDelay: `${i * 80}ms` }} className="animate-rise flex h-auto aspect-[5/4] flex-col items-center justify-center gap-4 rounded-xl bg-background">
              <span className="grid h-16 w-16 place-items-center rounded-full bg-secondary">
                <Icon className="h-8 w-8 text-primary" strokeWidth={1.2} />
              </span>
              <span className="text-base">{label}</span>
            </Button>
          ))}
        </div>
        <Link
          to="/activity"
          className="animate-rise mt-4 flex items-center gap-4 rounded-xl bg-primary p-5 text-primary-foreground"
          style={{ animationDelay: "320ms" }}
        >
          <span className="grid h-14 w-14 place-items-center rounded-full bg-background/15">
            <Compass className="h-8 w-8" strokeWidth={1.2} />
          </span>
          <span className="flex-1">
            <span className="block text-lg font-medium">Quests</span>
            <span className="text-sm opacity-90">
              Daily steps and sidequests · {state.active} ActiveCredits
            </span>
          </span>
          <ChevronRight />
        </Link>
        <Button variant="secondary" onClick={() => setSection("Buy new insurance")} className="mt-4 h-auto w-full gap-2 rounded-xl py-4 text-primary">
          <Plus strokeWidth={1.5} /> Buy new insurance
        </Button>
        <button
          type="button"
          onClick={() => {
            state.resetDemo();
            toast.success("Demo reset", {
              description: "All progress cleared. Ready for a fresh walkthrough.",
            });
          }}
          className="mx-auto mt-8 flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset demo
        </button>
      </main>
      <Sheet open={section !== null} onOpenChange={(open) => { if (!open) setSection(null); }}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-md">
          <SheetHeader>
            <SheetTitle>{section}</SheetTitle>
            <SheetDescription>{section === "Menu" ? "My If" : "This section is not connected in the demo. Explore daily steps and home safety checks in Quests instead."}</SheetDescription>
          </SheetHeader>
          {section === "Menu" ? <nav aria-label="Start menu" className="mt-6 flex flex-col gap-2">
            {([{ to: "/activity", label: "Quests home" }, { to: "/quests", label: "Sidequests" }, { to: "/rewards", label: "Rewards" }] as const).map((item) =>
              <Button asChild variant="outline" key={item.to}><Link to={item.to} onClick={() => setSection(null)}>{item.label}<ChevronRight /></Link></Button>)}
          </nav> : <Button asChild className="mt-6"><Link to="/activity" onClick={() => setSection(null)}>Open Quests<ChevronRight /></Link></Button>}
        </SheetContent>
      </Sheet>
    </div>
  );
}
