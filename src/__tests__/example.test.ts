import { describe, expect, it } from "vitest";
import { formatCurrency } from "@/lib/utils";

describe("formatCurrency", () => {
  it("formats numbers into USD currency", () => {
    expect(formatCurrency(1234.56)).toBe("$1,234.56");
  });
});
