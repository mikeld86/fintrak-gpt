import { describe, expect, it } from "vitest";
import fs from "fs";
import path from "path";

describe("dark mode variables", () => {
  it("pulls ring color from the base scope", () => {
    const cssPath = path.resolve(__dirname, "../index.css");
    const css = fs.readFileSync(cssPath, "utf8");

    const rootMatch = /:root\s*\{([^}]+)\}/.exec(css);
    expect(rootMatch).not.toBeNull();
    expect(rootMatch![1]).toContain("--ring: var(--primary);");

    const darkMatch = /\.dark\s*\{([^}]+)\}/.exec(css);
    expect(darkMatch).not.toBeNull();
    expect(darkMatch![1]).not.toContain("--ring");
  });
});
