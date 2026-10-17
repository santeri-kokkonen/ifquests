import { useState } from "react";
import { Pizza, Droplets, Check } from "lucide-react";
import { toast } from "sonner";
import { useMove } from "./MoveProvider";
import { Confetti } from "./Confetti";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { moveRewards, canClaimMove } from "@/lib/move-rules";

const icons = { pizza: Pizza, "leak-sensor": Droplets };

export function MoveRewards() {
  const state = useMove();
  const [burst, setBurst] = useState(0);
  return (
    <section className="mt-9 border-t pt-6">
      {burst > 0 && <Confetti key={burst} />}
      <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-baseline">
        <h2 className="text-2xl font-light">Moving rewards</h2>
        <span className="min-w-0 text-sm font-medium text-primary">{state.total} MoveCredits</span>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">
        Complete safety checks to unlock each demo milestone once.
        MoveCredits measure progress and are not spent when you claim a reward.
      </p>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {moveRewards.map((r) => {
          const Icon = icons[r.id];
          const claimed = state.claimed.includes(r.id);
          return (
            <article key={r.id} className="flex flex-col rounded-xl border bg-card p-5">
              <div className="flex items-center justify-between">
                <Icon className="h-8 w-8 text-primary" strokeWidth={1.2} />
                <span className="text-xs text-muted-foreground">{r.cost} MoveCredits</span>
              </div>
              <h3 className="mt-5 text-lg font-medium">{r.name}</h3>
              <p className="mt-2 flex-1 text-sm text-muted-foreground">{r.detail}</p>
              <Progress className="mt-5" value={Math.min((state.total / r.cost) * 100, 100)} />
              <Button
                className="mt-4 w-full"
                disabled={claimed || !canClaimMove(r.id, state.completed, state.claimed)}
                onClick={() => {
                  state.claim(r.id);
                  setBurst((n) => n + 1);
                  toast.success(`${r.name} claimed`, {
                    description: "Demo milestone unlocked. No real booking or order.",
                  });
                }}
              >
                {claimed ? (
                  <>
                    <Check />
                    Claimed in demo
                  </>
                ) : state.total >= r.cost ? (
                  "Claim reward"
                ) : (
                  `${r.cost - state.total} MoveCredits to unlock`
                )}
              </Button>
              {claimed && (
                <p role="status" className="mt-3 text-xs text-success">
                  {r.id === "leak-sensor"
                    ? "Demo delivery reserved. No sensor is being shipped."
                    : `Demo voucher: MOVE-${r.id.toUpperCase()} · No real booking or order.`}
                </p>
              )}
              {r.id === "leak-sensor" && claimed && (
                <Button
                  variant="outline"
                  className="mt-3 whitespace-normal h-auto"
                  disabled={state.sensorArrived}
                  onClick={() => state.setSensorArrived(true)}
                >
                  {state.sensorArrived ? "Demo sensor delivered" : "Simulate sensor delivery"}
                </Button>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
