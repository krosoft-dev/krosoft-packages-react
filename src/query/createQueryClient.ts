import { getErrorMessage } from "@krosoft/core/helpers";
import { type DefaultOptions, MutationCache, QueryCache, QueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { type I18nTranslator, translateKrosoft } from "../i18n/translateKrosoft";

export interface CreateQueryClientOptions {
  /**
   * Surcharge des options par défaut, fusionnée avec celles du package
   * (`queries.retry: 1`, `mutations.retry: false`).
   */
  defaultOptions?: DefaultOptions;
  /**
   * Affiche un toast d'erreur global (Sonner) pour toute requête en échec et pour
   * toute mutation sans `onError` déclaré dans `useMutation`. Faux par défaut :
   * à activer seulement si les écrans n'affichent pas déjà leurs propres erreurs.
   *
   * Une requête ou une mutation s'en exclut avec `meta: { errorToast: false }`.
   */
  errorToast?: boolean;
  /**
   * Instance i18next de l'application, pour traduire les titres des toasts.
   * Sans elle, les titres restent dans le français embarqué du package.
   */
  i18n?: I18nTranslator;
}

const DEFAULT_OPTIONS: DefaultOptions = {
  queries: {
    retry: 1,
  },
  mutations: {
    retry: false,
  },
};

const isToastDisabled = (meta: Record<string, unknown> | undefined): boolean => meta?.errorToast === false;

/**
 * Crée le `QueryClient` partagé des applications Krosoft.
 *
 * ```ts
 * import i18n from "@/lib/i18n";
 * import { createQueryClient } from "@krosoft/react/query";
 *
 * export const queryClient = createQueryClient({ errorToast: true, i18n });
 * ```
 */
export const createQueryClient = ({ defaultOptions, errorToast = false, i18n }: CreateQueryClientOptions = {}): QueryClient => {
  const mergedDefaultOptions: DefaultOptions = {
    ...defaultOptions,
    queries: { ...DEFAULT_OPTIONS.queries, ...defaultOptions?.queries },
    mutations: { ...DEFAULT_OPTIONS.mutations, ...defaultOptions?.mutations },
  };

  if (!errorToast) {
    return new QueryClient({ defaultOptions: mergedDefaultOptions });
  }

  return new QueryClient({
    defaultOptions: mergedDefaultOptions,
    queryCache: new QueryCache({
      onError: (error, query) => {
        if (isToastDisabled(query.meta)) {
          return;
        }

        // L'identifiant de la requête évite d'empiler un toast par tentative (perte de réseau, session expirée…).
        toast.error(translateKrosoft(i18n, "query.errorTitle"), { id: query.queryHash, description: getErrorMessage(error) });
      },
    }),
    mutationCache: new MutationCache({
      onError: (error, _variables, _context, mutation) => {
        // Une mutation qui gère son erreur dans `useMutation` affiche déjà son message : on ne le double pas.
        // Un `onError` passé seulement à `mutate()` n'est pas visible ici : utiliser `meta: { errorToast: false }`.
        if (mutation.options.onError || isToastDisabled(mutation.meta)) {
          return;
        }

        toast.error(translateKrosoft(i18n, "query.mutationErrorTitle"), { description: getErrorMessage(error) });
      },
    }),
  });
};
