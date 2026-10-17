import { createFileRoute, Link } from "@tanstack/react-router";
import { Umbrella, CloudLightning, Coins, FileText, Compass, Plus, Menu, ChevronRight } from "lucide-react";
import ifLogoAsset from "@/assets/if-logo.png.asset.json";
import { pageHead } from "@/lib/page-head";
import { useMove } from "@/components/MoveProvider";

export const Route = createFileRoute("/")({
  head: () => pageHead("If — My If", "Your If customer dashboard with Quests built in."),
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
  return (
    <div className="min-h-screen bg-secondary">
      <header className="relative flex items-center justify-center border-b bg-background py-3">
        <img src={ifLogoAsset.url} alt="If" width={48} height={48} className="h-12 w-12" />
        <span className="absolute right-5 flex flex-col items-center text-xs">
          <Menu className="h-7 w-7" strokeWidth={1.2} />
          Menu
        </span>
      </header>
      <main className="mx-auto max-w-md px-5 pb-16 pt-10">
        <h1 className="text-3xl font-light">Hi, Timo-Antti</h1>
        <div className="mt-8 grid grid-cols-2 gap-4">
          {tiles.map(({ label, icon: Icon }) => (
            <div key={label} className="flex aspect-[5/4] flex-col items-center justify-center gap-4 rounded-xl bg-background">
              <span className="grid h-16 w-16 place-items-center rounded-full bg-secondary">
                <Icon className="h-8 w-8 text-primary" strokeWidth={1.2} />
              </span>
              <span className="text-base">{label}</span>
            </div>
          ))}
        </div>
        <Link
          to="/activity"
          className="mt-4 flex items-center gap-4 rounded-xl bg-primary p-5 text-primary-foreground"
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
        <div className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-muted py-4 text-primary">
          <Plus strokeWidth={1.5} /> Buy new insurance
        </div>
      </main>
    </div>
  );
}
