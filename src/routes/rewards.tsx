import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Bike, Compass, Gift, Package, Pizza, Sparkles, Truck } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { Confetti } from "@/components/Confetti";
import { AppShell } from "@/components/AppShell";
import { useMove } from "@/components/MoveProvider";
import { Button } from "@/components/ui/button";
import { CLEANING_COST, VAN_ACTIVE_COST, canRentVan } from "@/lib/move-rules";
import { pageHead } from "@/lib/page-head";
export const Route = createFileRoute("/rewards")({
  head: () =>
    pageHead(
      "Your rewards",
      "Everyday ActiveCredits you build all year, for a rental van or a fresh start at your new place.",
    ),
  component: Rewards,
});
function Rewards() {
  const state = useMove();
  const [burst, setBurst] = useState(0);
  const celebrate = () => setBurst((n) => n + 1);
  return (
    <AppShell>
      {burst > 0 && <Confetti key={burst} />}
      <p className="eyebrow">ALL YEAR ROUND</p>
      <h1 className="mt-2 text-4xl font-light">A balance that grows with you.</h1>
      <p className="mt-3 text-muted-foreground">
        Earn ActiveCredits through daily steps and safety checks on Home.
        Moving rewards use separate MoveCredits.
      </p>
      <section className="mt-8 border-t pt-6">
        <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-baseline">
          <h2 className="text-2xl font-light">Everyday rewards</h2>
          <span className="min-w-0 text-sm font-medium text-primary">{`${state.active.toLocaleString("en-US")} ActiveCredits`}</span>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          Explore example offers. Offer prices are illustrative; demo redemptions use the amounts shown below.
        </p>
        <div className="mt-5 grid gap-6 md:grid-cols-2">
          <article className="animate-rise rounded-xl border bg-card p-5">
            <Truck className="h-8 w-8 text-primary" strokeWidth={1.2} />
            <h3 className="mt-4 text-lg font-medium">A rental van for your troubles</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              6,000 ActiveCredits · A rental van for the boxes and furniture a car can’t carry.
            </p>
            <p className="mt-2 text-xs text-muted-foreground">Demo redemption: {VAN_ACTIVE_COST} ActiveCredits. No real booking.</p>
            <Button
              className="mt-5"
              disabled={!canRentVan(state.active, state.vanReserved)}
              onClick={() => {
                state.rentVan();
                celebrate();
                toast.success("Rental van reserved in demo", {
                  description: `${VAN_ACTIVE_COST} ActiveCredits used. Demo voucher: AC-VAN.`,
                });
              }}
            >
              <span key={String(state.vanReserved)}>
                {state.vanReserved ? "Rental van reserved in demo" : "Buy with ActiveCredits"}
              </span>
            </Button>
            {state.vanReserved ? (
              <p key="van-done" role="status" className="mt-3 text-sm text-success">
                {`${VAN_ACTIVE_COST} ActiveCredits used. Demo voucher: AC-VAN · No real booking.`}
              </p>
            ) : state.active < VAN_ACTIVE_COST ? (
              <p key="van-togo" className="mt-3 text-xs text-muted-foreground">
                {`${VAN_ACTIVE_COST - state.active} ActiveCredits to go.`}
              </p>
            ) : null}
          </article>
          <article className="animate-rise rounded-xl border bg-card p-5" style={{ animationDelay: "100ms" }}>
            <Sparkles className="h-8 w-8 text-primary" strokeWidth={1.2} />
            <h3 className="mt-4 text-lg font-medium">Cleaning services</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              10,000 ActiveCredits · Cleaning support for a fresh start in your new home.
            </p>
            <p className="mt-2 text-xs text-muted-foreground">Demo redemption: {CLEANING_COST} ActiveCredits. No real booking.</p>
            <Button
              className="mt-5"
              disabled={state.cleaning || state.active < CLEANING_COST}
              onClick={() => {
                state.redeemCleaning();
                celebrate();
                toast.success("Cleaning reserved in demo", {
                  description: `${CLEANING_COST} ActiveCredits used. No real cleaning is booked.`,
                });
              }}
            >
              <span key={String(state.cleaning)}>
                {state.cleaning ? "Cleaning reserved in demo" : "Buy with ActiveCredits"}
              </span>
            </Button>
            {state.cleaning && (
              <p role="status" className="mt-3 text-sm text-success">
                {`${CLEANING_COST} ActiveCredits used. No real cleaning is booked.`}
              </p>
            )}
          </article>
        </div>
      </section>
      <section className="mt-8 border-t pt-6">
        <h2 className="text-2xl font-light">Partner offers</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Example offers from a local pizzeria, packing supplier and bike rental service.
          These are not confirmed If partnerships and cannot be redeemed in this demo.
        </p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <article className="rounded-xl border bg-card p-5">
            <Pizza className="h-8 w-8 text-primary" strokeWidth={1.2} />
            <h3 className="mt-4 text-lg font-medium">Pizza</h3>
            <p className="mt-1 text-xs text-muted-foreground">Local pizzeria · Turku · Example offer</p>
            <p className="mt-2 text-sm text-muted-foreground">
              1,000 ActiveCredits · Two large pizzas for the price of one.
            </p>
          </article>
          <article className="rounded-xl border bg-card p-5">
            <Package className="h-8 w-8 text-primary" strokeWidth={1.2} />
            <h3 className="mt-4 text-lg font-medium">Packing kit</h3>
            <p className="mt-1 text-xs text-muted-foreground">Packing supplier · Home delivery · Example offer</p>
            <p className="mt-2 text-sm text-muted-foreground">
              1,000 ActiveCredits · Ten boxes, tape and bubble wrap, delivered to your door.
            </p>
          </article>
          <article className="rounded-xl border bg-card p-5">
            <Bike className="h-8 w-8 text-primary" strokeWidth={1.2} />
            <h3 className="mt-4 text-lg font-medium">A month of city bikes</h3>
            <p className="mt-1 text-xs text-muted-foreground">Bike rental service · Turku · Example offer</p>
            <p className="mt-2 text-sm text-muted-foreground">
              3,000 ActiveCredits · 30 days of cycling for an active everyday routine.
            </p>
          </article>
        </div>
      </section>
      <section className="mt-8 border-t pt-6">
        <h2 className="text-2xl font-light">Reward history</h2>
        {!state.vanReserved && !state.cleaning ? (
          <div className="animate-rise mt-4 flex flex-col items-center gap-3 rounded-xl border border-dashed bg-secondary/50 px-6 py-8 text-center">
            <span className="grid h-12 w-12 place-items-center rounded-full bg-card">
              <Gift className="h-6 w-6 text-primary" strokeWidth={1.5} />
            </span>
            <p className="text-sm text-muted-foreground">
              Your first reward is ahead. Build ActiveCredits on Home, then choose a reward above.
            </p>
            <Button asChild variant="outline" size="sm">
              <Link to="/activity">Go to Home</Link>
            </Button>
          </div>
        ) : (
          <ul className="mt-3 divide-y text-sm">
            {state.vanReserved && <li className="py-3">Rental van · {VAN_ACTIVE_COST} ActiveCredits used · Reserved in demo</li>}
            {state.cleaning && <li className="py-3">Cleaning services · {CLEANING_COST} ActiveCredits used · Reserved in demo</li>}
          </ul>
        )}
      </section>
      <Button asChild variant="link" className="mt-5 px-0">
        <Link to="/quests">
          <Compass />
          All sidequests
        </Link>
      </Button>
    </AppShell>
  );
}
