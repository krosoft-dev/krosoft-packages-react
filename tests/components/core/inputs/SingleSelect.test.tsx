import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SingleSelect } from "../../../../src/components/core/inputs/SingleSelect";

const options = [
  { value: "cron", label: "Planification" },
  { value: "fileWatcher", label: "Surveillance de fichiers", disabled: true },
];

const openPanel = (): void => {
  fireEvent.click(screen.getByRole("combobox"));
};

const itemOf = (label: string): Element => screen.getByText(label).closest("[cmdk-item]") as Element;

afterEach(() => {
  cleanup();
});

describe("SingleSelect", () => {
  it("searchable : marque les options désactivées et ignore leur clic", () => {
    const onChange = vi.fn();
    render(<SingleSelect searchable options={options} value={undefined} onChange={onChange} />);

    openPanel();
    const item = itemOf("Surveillance de fichiers");

    expect(item.getAttribute("aria-disabled")).toBe("true");

    fireEvent.click(item);

    expect(onChange).not.toHaveBeenCalled();
  });

  it("searchable : une option active reste sélectionnable", () => {
    const onChange = vi.fn();
    render(<SingleSelect searchable options={options} value={undefined} onChange={onChange} />);

    openPanel();
    fireEvent.click(itemOf("Planification"));

    expect(onChange).toHaveBeenCalledWith("cron");
  });
});
