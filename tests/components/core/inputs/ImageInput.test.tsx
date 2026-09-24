import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ImageInput } from "../../../../src/components/core/inputs/ImageInput";

const showError = vi.fn();

vi.mock("@/i18n", () => ({
  useKrosoftTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock("@/hooks/ui/useNotifications", () => ({
  useNotifications: () => ({ showError, showSuccess: vi.fn() }),
}));

const createFile = (name: string, type: string, size = 1024): File => {
  const file = new File(["x"], name, { type });
  Object.defineProperty(file, "size", { value: size });
  return file;
};

const drop = (file: File): boolean => {
  const dropzone = screen.getByTestId("image-input-dropzone");
  const dataTransfer = { files: [file] };
  const dragOver = fireEvent.dragOver(dropzone, { dataTransfer });
  fireEvent.drop(dropzone, { dataTransfer });
  return dragOver;
};

afterEach(() => {
  cleanup();
  showError.mockClear();
});

describe("ImageInput", () => {
  it("sélectionne l'image déposée", () => {
    const onChange = vi.fn();
    render(<ImageInput onChange={onChange} />);

    const file = createFile("photo.png", "image/png");
    drop(file);

    expect(onChange).toHaveBeenCalledWith(file);
  });

  it("annule le comportement par défaut du dragover pour que le navigateur n'ouvre pas le fichier", () => {
    render(<ImageInput onChange={vi.fn()} />);

    const notCancelled = drop(createFile("photo.png", "image/png"));

    expect(notCancelled).toBe(false);
  });

  it("affiche le libellé de dépôt pendant le survol", () => {
    render(<ImageInput onChange={vi.fn()} />);

    fireEvent.dragOver(screen.getByTestId("image-input-dropzone"));

    expect(screen.getByText("image.drop")).toBeTruthy();
  });

  it("refuse un fichier déposé dont le type n'est pas accepté", () => {
    const onChange = vi.fn();
    render(<ImageInput onChange={onChange} />);

    drop(createFile("doc.pdf", "application/pdf"));

    expect(onChange).not.toHaveBeenCalled();
    expect(showError).toHaveBeenCalledWith("states.errorTitle", "image.invalidType");
  });

  it("refuse un fichier déposé trop volumineux", () => {
    const onChange = vi.fn();
    render(<ImageInput onChange={onChange} maxSizeMB={1} />);

    drop(createFile("photo.png", "image/png", 2 * 1024 * 1024));

    expect(onChange).not.toHaveBeenCalled();
    expect(showError).toHaveBeenCalledWith("states.errorTitle", "image.tooLarge");
  });
});
