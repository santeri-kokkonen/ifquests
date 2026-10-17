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
  it("shows all three milestone rewards on the moving sidequest page", async () => {
    renderPage("/quests/moving");
    expect(await screen.findByText("One trailer hour")).toBeTruthy();
    expect(screen.getByText("Pizza for your crew")).toBeTruthy();
    expect(screen.getByText("A leak sensor")).toBeTruthy();
  });

  it("keeps move rewards off the everyday rewards page", async () => {
    renderPage("/rewards");
    expect(await screen.findByText("Old-flat final cleaning")).toBeTruthy();
    expect(screen.queryByText("One trailer hour")).toBeNull();
    expect(screen.queryByText("Pizza for your crew")).toBeNull();
    expect(screen.queryByText("A leak sensor")).toBeNull();
  });
});
