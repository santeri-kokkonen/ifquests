import { createFileRoute } from "@tanstack/react-router";
import { Compass, Sparkles, Truck } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { useMove } from "@/components/MoveProvider";
import { Button } from "@/components/ui/button";
import { CLEANING_COST, TRAILER_ACTIVE_COST, canBuyTrailer } from "@/lib/move-rules";
import { pageHead } from "@/lib/page-head";
export const Route = createFileRoute("/rewards")({
  head: () =>
    pageHead(
      "Your rewards",
      "Everyday ActiveCredits you build all year, for a trailer hour or the old flat’s final clean.",
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
            <h3 className="mt-4 text-lg font-medium">A trailer for your troubles</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              6000 ActiveCredits · For the boxes that won’t fit in a car.
            </p>
            <Button
              className="mt-5"
              disabled={!canBuyTrailer(state.active, state.trailerActive)}
              onClick={state.buyTrailer}
            >
              <span key={String(state.trailerActive)}>
                {state.trailerActive ? "Trailer hour reserved" : "Buy with ActiveCredits"}
              </span>
            </Button>
            {state.trailerActive ? (
              <p key="trailer-done" role="status" className="mt-3 text-sm text-success">
                {`${TRAILER_ACTIVE_COST} ActiveCredits used. Demo voucher: AC-TRAILER · No real booking.`}
              </p>
            ) : state.active < TRAILER_ACTIVE_COST ? (
              <p key="trailer-togo" className="mt-3 text-xs text-muted-foreground">
                {`${TRAILER_ACTIVE_COST - state.active} ActiveCredits to go.`}
              </p>
            ) : null}
          </article>
          <article className="rounded-xl border bg-card p-5">
            <Sparkles className="h-8 w-8 text-primary" strokeWidth={1.2} />
            <h3 className="mt-4 text-lg font-medium">Final cleaning</h3>
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
      <Button asChild variant="link" className="mt-5 px-0">
        <Link to="/quests">
          <Compass />
          All sidequests
        </Link>
      </Button>
    </AppShell>
  );
}
