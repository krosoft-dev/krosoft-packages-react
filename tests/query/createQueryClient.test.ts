import i18next, { type i18n as I18nInstance } from "i18next";
import { afterEach, describe, expect, it, vi } from "vitest";
import { registerKrosoftLocales } from "../../src/i18n";
import { createQueryClient } from "../../src/query";

const toastError = vi.fn<(title: string, options: { id?: string; description?: string }) => void>();

vi.mock("sonner", () => ({
  toast: {
    error: (title: string, options: { id?: string; description?: string }) => {
      toastError(title, options);
    },
  },
}));

afterEach(() => {
  toastError.mockClear();
});

const createInstance = async (language: string): Promise<I18nInstance> => {
  const instance = i18next.createInstance();
  await instance.init({ lng: language, fallbackLng: "fr", resources: {}, interpolation: { escapeValue: false } });
  registerKrosoftLocales(instance);

  return instance;
};

const failingQuery = (queryClient: ReturnType<typeof createQueryClient>, meta?: Record<string, unknown>): Promise<unknown> =>
  queryClient
    .query({
      queryKey: ["failing", meta],
      queryFn: () => Promise.reject(new Error("Boom")),
      retry: false,
      meta,
    })
    .catch(() => undefined);

const failingMutation = (queryClient: ReturnType<typeof createQueryClient>, options: { onError?: () => void; meta?: Record<string, unknown> } = {}): Promise<unknown> =>
  queryClient
    .getMutationCache()
    .build(queryClient, { mutationFn: () => Promise.reject(new Error("Boom")), ...options })
    .execute(undefined)
    .catch(() => undefined);

describe("createQueryClient", () => {
  it("applique les options par défaut communes", () => {
    const options = createQueryClient().getDefaultOptions();

    expect(options.queries?.retry).toBe(1);
    expect(options.mutations?.retry).toBe(false);
  });

  it("fusionne les options surchargées avec les défauts", () => {
    const options = createQueryClient({ defaultOptions: { queries: { staleTime: 5000 }, mutations: { retry: 2 } } }).getDefaultOptions();

    expect(options.queries?.retry).toBe(1);
    expect(options.queries?.staleTime).toBe(5000);
    expect(options.mutations?.retry).toBe(2);
  });

  it("n'affiche aucun toast sans l'option errorToast", async () => {
    await failingQuery(createQueryClient());

    expect(toastError).not.toHaveBeenCalled();
  });

  it("affiche un toast par requête en échec, identifié par son hash", async () => {
    await failingQuery(createQueryClient({ errorToast: true }));

    expect(toastError).toHaveBeenCalledWith("Échec du chargement des données", expect.objectContaining({ description: "Boom", id: expect.any(String) as string }));
  });

  it("traduit le titre dans la langue de l'application", async () => {
    await failingQuery(createQueryClient({ errorToast: true, i18n: await createInstance("en") }));

    expect(toastError).toHaveBeenCalledWith("Failed to load data", expect.anything());
  });

  it("respecte meta.errorToast à false", async () => {
    await failingQuery(createQueryClient({ errorToast: true }), { errorToast: false });

    expect(toastError).not.toHaveBeenCalled();
  });

  it("affiche un toast pour une mutation sans onError", async () => {
    await failingMutation(createQueryClient({ errorToast: true }));

    expect(toastError).toHaveBeenCalledWith("L'opération a échoué", { description: "Boom" });
  });

  it("ne double pas le message d'une mutation qui gère son erreur", async () => {
    await failingMutation(createQueryClient({ errorToast: true }), { onError: () => undefined });

    expect(toastError).not.toHaveBeenCalled();
  });
});
