import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { InputOTPSlot } from "@/components/ui/input-otp";

describe("Nullable control data", () => {
  it("renders an empty OTP slot safely when its context is missing", () => {
    expect(() => render(<InputOTPSlot index={0} />)).not.toThrow();
  });
});