/// <reference types="vite-plugin-pwa/react" />
import { useEffect } from "react";
import { useKrosoftTranslation } from "@/i18n";
import { useRegisterSW } from "virtual:pwa-register/react";
import { showPwaUpdateToast } from "./pwaUpdateToast";

// Le navigateur ne revérifie le service worker qu'au chargement de la page. Une PWA
// installée pouvant rester ouverte des jours, on relance la vérification régulièrement.
const DEFAULT_CHECK_INTERVAL_MS = 60 * 60 * 1000;

export interface PwaUpdaterProps {
  /** Intervalle entre deux vérifications de mise à jour. Une heure par défaut. */
  checkIntervalMs?: number;
}

/**
 * Enregistre le service worker et propose la mise à jour à l'utilisateur.
 *
 * Le nouveau service worker reste en attente : c'est l'action « Actualiser » du toast
 * qui l'active et recharge la page, jamais un rechargement automatique en pleine saisie.
 * Le bouton « Ignorer » (ou le balayage sur mobile) reporte la mise à jour, reproposée
 * au prochain chargement tant qu'elle n'est pas appliquée.
 *
 * L'application hôte doit :
 *
 * - configurer `VitePWA({ registerType: "prompt" })` — en `autoUpdate`, le service
 *   worker prend la main tout seul et le toast n'a plus rien à proposer ;
 * - monter `<Sonner />` ;
 * - fournir les clés `pwa.updateAvailable`, `pwa.updateAction` et `pwa.updateDismiss`.
 *
 * ```tsx
 * import { PwaUpdater } from "@krosoft/react/pwa";
 *
 * <PwaUpdater />
 * ```
 *
 * Ne pas y associer `reloadOnServiceWorkerUpdate()` de `@krosoft/core/pwa` : cette
 * fonction est faite pour le mode `autoUpdate` et rechargerait les autres onglets
 * ouverts sans leur demander leur avis.
 */
export const PwaUpdater = ({ checkIntervalMs = DEFAULT_CHECK_INTERVAL_MS }: PwaUpdaterProps = {}): null => {
  const { t } = useKrosoftTranslation();

  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(_swUrl, registration) {
      if (!registration) return;

      setInterval(() => void registration.update(), checkIntervalMs);
    },
  });

  useEffect(() => {
    if (!needRefresh) return;

    showPwaUpdateToast({
      message: t("pwa.updateAvailable"),
      actionLabel: t("pwa.updateAction"),
      dismissLabel: t("pwa.updateDismiss"),
      onUpdate: () => {
        void updateServiceWorker(true);
      },
      onDismiss: () => {
        setNeedRefresh(false);
      },
    });
  }, [needRefresh, setNeedRefresh, t, updateServiceWorker]);

  return null;
};
