import "@testing-library/jest-dom/vitest";
import { beforeEach, vi } from "vitest";

// jsdom does not serve Vite URL imports; provide a valid stylesheet URL in route tests.
vi.mock("../styles.css?url", () => ({ default: "/src/styles.css" }));

beforeEach(() => window.localStorage.clear());

Object.defineProperty(window, "scrollTo", {
  writable: true,
  value: () => {},
});

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});
