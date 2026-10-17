import { QueryClient } from "@tanstack/react-query";
import {
  createMemoryHistory,
  createRouter,
  RouterProvider,
} from "@tanstack/react-router";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { routeTree } from "@/routeTree.gen";
import { Route as rootRoute } from "@/routes/__root";

async function renderPage(path: string) {
  // Component tests mount in a div; the real document shell belongs to SSR/browser checks.
  rootRoute.options.shellComponent = ({ children }) => <>{children}</>;
  const router = createRouter({
    routeTree,
    history: createMemoryHistory({ initialEntries: [path] }),
    context: { queryClient: new QueryClient() },
  });
  await router.load();
  return render(<RouterProvider router={router} />);
}

describe("Move rewards live only in the moving sidequest", () => {
  it("shows only crew pizza and a leak sensor on the moving sidequest page", async () => {
    await renderPage("/quests/moving");
    expect(await screen.findByText("Pizza for your crew")).toBeTruthy();
    expect(screen.getByText("A leak sensor")).toBeTruthy();
    expect(screen.queryByText("A rental van for your troubles")).toBeNull();
  });

  it("keeps the moving sidequest's own rewards off the everyday rewards page", async () => {
    await renderPage("/rewards");
    expect(await screen.findByText("Cleaning services")).toBeTruthy();
    expect(screen.queryByText("Moving rewards")).toBeNull();
    expect(screen.queryByText("Pizza for your crew")).toBeNull();
    expect(screen.queryByText("A leak sensor")).toBeNull();
    expect(screen.queryByText("300 MoveCredits")).toBeNull();
  });

  it("rents a van for ActiveCredits on the rewards page", async () => {
    await renderPage("/rewards");
    expect(await screen.findByText("A rental van for your troubles")).toBeTruthy();
    expect(screen.getByText(/6,000 ActiveCredits/)).toBeTruthy();
    expect(screen.getAllByRole("button", { name: "Buy with ActiveCredits" })).toHaveLength(2);
});

describe("Yearly safety checks live on the activity page", () => {
  it("lists both yearly checks under 'More than a step count'", async () => {
    await renderPage("/activity");
    expect(await screen.findByText("More than a step count")).toBeTruthy();
    expect(screen.getByText("Smoke alarm test")).toBeTruthy();
    expect(screen.getByText("Sensor battery check")).toBeTruthy();
  });

  it("keeps the yearly checks off the everyday rewards page", async () => {
    await renderPage("/rewards");
    expect(await screen.findByText("Cleaning services")).toBeTruthy();
    expect(screen.queryByText("More than a step count")).toBeNull();
    expect(screen.queryByText("Smoke alarm test")).toBeNull();
    expect(screen.queryByText("Sensor battery check")).toBeNull();
  });
});
});
