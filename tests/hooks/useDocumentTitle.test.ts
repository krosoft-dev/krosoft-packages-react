import { renderHook } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useDocumentTitle } from "../../src/hooks/ui/useDocumentTitle";

vi.mock("react-i18next", () => {
  const translations: Record<string, string> = {
    "pages.home": "Accueil",
    "pages.settings": "Paramètres",
    "pages.dashboard": "Tableau de bord",
  };
  return {
    useTranslation: () => ({
      t: (key: string) => translations[key] ?? key,
      ready: true,
      i18n: { exists: (key: string) => key in translations },
    }),
  };
});

describe("useDocumentTitle", () => {
  const originalTitle = "Titre Original";

  beforeEach(() => {
    document.title = originalTitle;
  });

  afterEach(() => {
    document.title = "";
  });

  it("définit le titre du document avec la traduction et le titre de l'application", () => {
    renderHook(() => {
      useDocumentTitle("pages.home", undefined, "MonApp");
    });

    expect(document.title).toBe("Accueil | MonApp");
  });

  it("inclut le suffix dans le titre quand il est fourni", () => {
    renderHook(() => {
      useDocumentTitle("pages.home", "Détails", "MonApp");
    });

    expect(document.title).toBe("Accueil - Détails | MonApp");
  });

  it("utilise une chaîne vide comme titre d'application quand appTitle n'est pas fourni", () => {
    renderHook(() => {
      useDocumentTitle("pages.home");
    });

    expect(document.title).toBe("Accueil");
  });

  it("utilise une chaîne vide comme titre d'application quand appTitle est undefined", () => {
    renderHook(() => {
      useDocumentTitle("pages.home", undefined, undefined);
    });

    expect(document.title).toBe("Accueil");
  });

  it("inclut le suffix même sans titre d'application", () => {
    renderHook(() => {
      useDocumentTitle("pages.home", "Détails");
    });

    expect(document.title).toBe("Accueil - Détails");
  });

  it("restaure le titre précédent lors du démontage", () => {
    const { unmount } = renderHook(() => {
      useDocumentTitle("pages.home", undefined, "MonApp");
    });

    expect(document.title).toBe("Accueil | MonApp");

    unmount();

    expect(document.title).toBe(originalTitle);
  });

  it("met à jour le titre quand titleKey change", () => {
    const { rerender } = renderHook(
      ({ titleKey }) => {
        useDocumentTitle(titleKey, undefined, "MonApp");
      },
      { initialProps: { titleKey: "pages.home" } },
    );

    expect(document.title).toBe("Accueil | MonApp");

    rerender({ titleKey: "pages.settings" });

    expect(document.title).toBe("Paramètres | MonApp");
  });

  it("met à jour le titre quand suffix change", () => {
    const { rerender } = renderHook(
      ({ suffix }) => {
        useDocumentTitle("pages.home", suffix, "MonApp");
      },
      {
        initialProps: { suffix: undefined as string | undefined },
      },
    );

    expect(document.title).toBe("Accueil | MonApp");

    rerender({ suffix: "Édition" });

    expect(document.title).toBe("Accueil - Édition | MonApp");
  });

  it("met à jour le titre quand appTitle change", () => {
    const { rerender } = renderHook(
      ({ appTitle }) => {
        useDocumentTitle("pages.home", undefined, appTitle);
      },
      { initialProps: { appTitle: "MonApp" } },
    );

    expect(document.title).toBe("Accueil | MonApp");

    rerender({ appTitle: "AutreApp" });

    expect(document.title).toBe("Accueil | AutreApp");
  });

  it("retourne la clé quand aucune traduction n'est trouvée", () => {
    renderHook(() => {
      useDocumentTitle("pages.inconnue", undefined, "MonApp");
    });

    expect(document.title).toBe("pages.inconnue | MonApp");
  });
});
