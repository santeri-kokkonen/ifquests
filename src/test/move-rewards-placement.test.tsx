import { QueryClient } from "@tanstack/react-query";
import {
  createMemoryHistory,
  createRouter,
  RouterProvider,
} from "@tanstack/react-router";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { routeTree } from "@/routeTree.gen";

async function renderPage(path: string) {
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
    expect(screen.queryByText("One trailer hour")).toBeNull();
  });

  it("keeps the moving sidequest's own rewards off the everyday rewards page", async () => {
    await renderPage("/rewards");
    expect(await screen.findByText("Old-flat final cleaning")).toBeTruthy();
    expect(screen.queryByText("Move rewards")).toBeNull();
    expect(screen.queryByText("Pizza for your crew")).toBeNull();
    expect(screen.queryByText("A leak sensor")).toBeNull();
    expect(screen.queryByText("300 MoveCredits")).toBeNull();
  });

  it("sells a trailer hour for ActiveCredits on the rewards page", async () => {
    await renderPage("/rewards");
    expect(await screen.findByText("One trailer hour")).toBeTruthy();
    expect(screen.getByText(/150 ActiveCredits/)).toBeTruthy();
    expect(screen.getByRole("button", { name: "Buy with ActiveCredits" })).toBeTruthy();
});

describe("Yearly safety checks live on the activity page", () => {
  it("lists both yearly checks under 'More than a step count'", async () => {
    await renderPage("/activity");
    expect(await screen.findByText("More than a step count")).toBeTruthy();
    expect(screen.getByText("Yearly smoke alarm test")).toBeTruthy();
    expect(screen.getByText("Sensor battery check")).toBeTruthy();
  });

  it("keeps the yearly checks off the everyday rewards page", async () => {
    await renderPage("/rewards");
    expect(await screen.findByText("Old-flat final cleaning")).toBeTruthy();
    expect(screen.queryByText("More than a step count")).toBeNull();
    expect(screen.queryByText("Yearly smoke alarm test")).toBeNull();
    expect(screen.queryByText("Sensor battery check")).toBeNull();
  });
});
});
