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

describe("Partner offers live on the rewards page", () => {
  it("shows the three example partner offers with ActiveCredits prices", async () => {
    await renderPage("/rewards");
    expect(await screen.findByText("Partner offers")).toBeTruthy();
    expect(screen.getByText("Pizza night at your new place")).toBeTruthy();
    expect(screen.getByText("Packing kit")).toBeTruthy();
    expect(screen.getByText("A month of city bikes")).toBeTruthy();
    expect(screen.getByText(/250 ActiveCredits/)).toBeTruthy();
    expect(screen.getByText(/120 ActiveCredits/)).toBeTruthy();
    expect(screen.getByText(/400 ActiveCredits/)).toBeTruthy();
  });

  it("keeps partner offers off the moving sidequest page", async () => {
    await renderPage("/quests/moving");
    expect(await screen.findByText("Pizza for your crew")).toBeTruthy();
    expect(screen.queryByText("Partner offers")).toBeNull();
    expect(screen.queryByText("Pizza night at your new place")).toBeNull();
  });
});
