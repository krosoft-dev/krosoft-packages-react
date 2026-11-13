import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useCopyToClipboard } from "../../../src/hooks/behavior/useCopyToClipboard";

const showSuccess = vi.fn();
const showError = vi.fn();
const writeText = vi.fn<(text: string) => Promise<void>>();

vi.mock("@/i18n", () => ({
  useKrosoftTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock("@/hooks/ui/useNotifications", () => ({
  useNotifications: () => ({ showSuccess, showError }),
}));

beforeEach(() => {
  Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText } });
});

afterEach(() => {
  vi.clearAllMocks();
});

const copyWith = async (options: Parameters<typeof useCopyToClipboard>[0], text = "valeur"): Promise<boolean> => {
  const { result } = renderHook(() => useCopyToClipboard(options));
  let succeeded = false;
  await act(async () => {
    succeeded = await result.current.copy(text);
  });
  return succeeded;
};

describe("useCopyToClipboard", () => {
  it("copie le texte et notifie le succès avec la clé par défaut", async () => {
    writeText.mockResolvedValue(undefined);

    const succeeded = await copyWith(undefined, "abc");

    expect(succeeded).toBe(true);
    expect(writeText).toHaveBeenCalledWith("abc");
    expect(showSuccess).toHaveBeenCalledWith("copy.copied");
    expect(showError).not.toHaveBeenCalled();
  });

  it("utilise les clés passées en option", async () => {
    writeText.mockResolvedValue(undefined);

    await copyWith({ successKey: "markdown.linkCopied", errorKey: "markdown.linkCopyError" });

    expect(showSuccess).toHaveBeenCalledWith("markdown.linkCopied");
  });

  it("notifie l'échec et renvoie faux quand le presse-papiers est refusé", async () => {
    const error = new Error("denied");
    writeText.mockRejectedValue(error);

    const succeeded = await copyWith({ errorKey: "codeBlock.copyFailed" });

    expect(succeeded).toBe(false);
    expect(showSuccess).not.toHaveBeenCalled();
    expect(showError).toHaveBeenCalledWith("codeBlock.copyFailed", undefined, error);
  });

  it("n'affiche pas de succès avec silentSuccess mais renvoie vrai", async () => {
    writeText.mockResolvedValue(undefined);

    const succeeded = await copyWith({ silentSuccess: true });

    expect(succeeded).toBe(true);
    expect(showSuccess).not.toHaveBeenCalled();
  });

  it("notifie toujours l'échec avec silentSuccess", async () => {
    writeText.mockRejectedValue("refus");

    const succeeded = await copyWith({ silentSuccess: true });

    expect(succeeded).toBe(false);
    expect(showError).toHaveBeenCalledWith("copy.copyFailed", undefined, null);
  });
});
