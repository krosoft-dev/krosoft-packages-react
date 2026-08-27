import { render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { PwaUpdater } from "../../src/pwa/PwaUpdater";

interface UpdateToastOptions {
  duration: number;
  closeButton: boolean;
  dismissible: boolean;
  action: { label: string; onClick: () => void };
  onDismiss: () => void;
}

const toast = vi.fn<(message: string, options: UpdateToastOptions) => void>();
const updateServiceWorker = vi.fn();
const setNeedRefresh = vi.fn();
let needRefresh = false;
let registeredOptions: { onRegisteredSW?: (swUrl: string, registration?: { update: () => void }) => void } = {};

vi.mock("sonner", () => ({
  toast: (message: string, options: UpdateToastOptions) => {
    toast(message, options);
  },
}));

vi.mock("react-i18next", () => {
  const translations: Record<string, string> = {
    "pwa.updateAvailable": "Une nouvelle version est disponible.",
    "pwa.updateAction": "Actualiser",
  };
  return {
    useTranslation: () => ({
      t: (key: string) => translations[key] ?? key,
      ready: true,
      i18n: { exists: (key: string) => key in translations },
    }),
  };
});

vi.mock("virtual:pwa-register/react", () => ({
  useRegisterSW: (options: typeof registeredOptions) => {
    registeredOptions = options;
    return { needRefresh: [needRefresh, setNeedRefresh], updateServiceWorker };
  },
}));

beforeEach(() => {
  needRefresh = false;
  registeredOptions = {};
  vi.clearAllMocks();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("PwaUpdater", () => {
  it("ne propose rien tant qu'aucune version n'attend", () => {
    render(<PwaUpdater />);

    expect(toast).not.toHaveBeenCalled();
  });

  it("propose la mise à jour quand une version attend", () => {
    needRefresh = true;

    render(<PwaUpdater />);

    expect(toast).toHaveBeenCalledOnce();
    expect(toast.mock.calls[0][0]).toBe("Une nouvelle version est disponible.");
  });

  it("laisse le toast fermable et sans expiration", () => {
    needRefresh = true;

    render(<PwaUpdater />);

    const options = toast.mock.calls[0][1];
    expect(options.duration).toBe(Infinity);
    expect(options.closeButton).toBe(true);
    expect(options.dismissible).toBe(true);
  });

  it("active le service worker en attente quand l'utilisateur accepte", () => {
    needRefresh = true;

    render(<PwaUpdater />);
    toast.mock.calls[0][1].action.onClick();

    expect(updateServiceWorker).toHaveBeenCalledWith(true);
  });

  it("oublie la proposition quand l'utilisateur ferme le toast", () => {
    needRefresh = true;

    render(<PwaUpdater />);
    toast.mock.calls[0][1].onDismiss();

    expect(setNeedRefresh).toHaveBeenCalledWith(false);
  });

  it("revérifie périodiquement, une PWA installée pouvant rester ouverte des jours", () => {
    vi.useFakeTimers();
    const update = vi.fn();

    render(<PwaUpdater checkIntervalMs={1000} />);
    registeredOptions.onRegisteredSW?.("/sw.js", { update });

    vi.advanceTimersByTime(3000);

    expect(update).toHaveBeenCalledTimes(3);
  });

  it("ignore un enregistrement sans registration", () => {
    render(<PwaUpdater />);

    expect(() => registeredOptions.onRegisteredSW?.("/sw.js", undefined)).not.toThrow();
  });
});
