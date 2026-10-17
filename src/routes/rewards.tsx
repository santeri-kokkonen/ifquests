import { createFileRoute } from "@tanstack/react-router";
import { Bike, Compass, Package, Pizza, Sparkles, Truck } from "lucide-react";
import { Link } from "@tanstack/react-router";
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
  return (
    <AppShell>
      <p className="eyebrow">ALL YEAR ROUND</p>
      <h1 className="mt-2 text-4xl font-light">A balance that grows with you.</h1>
      <p className="mt-3 text-muted-foreground">
        ActiveCredits come from everyday activity. Your yearly safety checks live on the activity
        page. The moving sidequest keeps its own rewards.
      </p>
      <section className="mt-8 border-t pt-6">
        <div className="flex items-baseline justify-between">
          <h2 className="text-2xl font-light">Everyday rewards</h2>
          <span className="font-medium text-primary">{`${state.active} ActiveCredits`}</span>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          One balance, several ways to use it. Prices are illustrative demo values.
        </p>
        <div className="mt-5 grid gap-6 md:grid-cols-2">
          <article className="rounded-xl border bg-card p-5">
            <Truck className="h-8 w-8 text-primary" strokeWidth={1.2} />
            <h3 className="mt-4 text-lg font-medium">A rental van for your troubles</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              6000 ActiveCredits · A rental van for the boxes and furniture a car can’t carry.
            </p>
            <Button
              className="mt-5"
              disabled={!canRentVan(state.active, state.vanReserved)}
              onClick={state.rentVan}
            >
              <span key={String(state.vanReserved)}>
                {state.vanReserved ? "Rental van reserved" : "Buy with ActiveCredits"}
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
          <article className="rounded-xl border bg-card p-5">
            <Sparkles className="h-8 w-8 text-primary" strokeWidth={1.2} />
            <h3 className="mt-4 text-lg font-medium">Cleaning services</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              10000 ActiveCredits · Illustrative demo price, partner and service scope to be agreed.
            </p>
            <Button
              className="mt-5"
              disabled={state.cleaning || state.active < CLEANING_COST}
              onClick={state.redeemCleaning}
            >
              <span key={String(state.cleaning)}>
                {state.cleaning ? "Cleaning reserved in demo" : "Reserve final cleaning"}
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
          A few examples of what partners could offer your ActiveCredits. Illustrative demo offers —
          partners and scope to be agreed.
        </p>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <article className="rounded-xl border bg-card p-5">
            <Pizza className="h-8 w-8 text-primary" strokeWidth={1.2} />
            <h3 className="mt-4 text-lg font-medium">Pizza </h3>
            <p className="mt-1 text-xs text-muted-foreground">Pizza Oven Co. · Turku</p>
            <p className="mt-2 text-sm text-muted-foreground">
              1000 ActiveCredits · Two large pizzas for the price of one
            </p>
          </article>
          <article className="rounded-xl border bg-card p-5">
            <Package className="h-8 w-8 text-primary" strokeWidth={1.2} />
            <h3 className="mt-4 text-lg font-medium">Packing kit</h3>
            <p className="mt-1 text-xs text-muted-foreground">Boxly · Online</p>
            <p className="mt-2 text-sm text-muted-foreground">
              1000 ActiveCredits · Ten boxes, tape and bubble wrap, delivered to your door.
            </p>
          </article>
          <article className="rounded-xl border bg-card p-5">
            <Bike className="h-8 w-8 text-primary" strokeWidth={1.2} />
            <h3 className="mt-4 text-lg font-medium">A month of city bikes</h3>
            <p className="mt-1 text-xs text-muted-foreground">City Bikes · Turku region</p>
            <p className="mt-2 text-sm text-muted-foreground">
              3000 ActiveCredits · 30 days of rides, a low-effort way to keep the step goal going.
            </p>
          </article>
        </div>
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
