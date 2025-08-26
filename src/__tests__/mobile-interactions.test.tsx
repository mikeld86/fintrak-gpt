import { describe, it, expect } from "vitest";
import { renderToString } from "react-dom/server";
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

describe("mobile interaction styles", () => {
  it("Button includes touch manipulation styles", () => {
    const html = renderToString(<Button>Test</Button>);
    expect(html).toContain("touch-manipulation");
    expect(html).toContain("-webkit-tap-highlight-color:transparent");
  });

  it("Input includes touch manipulation styles", () => {
    const html = renderToString(<Input />);
    expect(html).toContain("touch-manipulation");
    expect(html).toContain("-webkit-tap-highlight-color:transparent");
  });
});
