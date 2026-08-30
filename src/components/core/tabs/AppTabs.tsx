import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { TabConfig } from "@/types/TabConfig";
import { useEffect, useRef } from "react";
import { useKrosoftTranslation } from "@/i18n";
import { useSearchParams } from "react-router-dom";
import { cn } from "@/helpers/tailwind.helper";

export interface AppTabsProps<T = unknown> {
  tabs: TabConfig<T>[];
  itemId?: string | null;
  item?: T | null;
  fit?: boolean;
  // Nom du paramètre d'URL qui porte l'onglet actif. Configurable pour permettre des AppTabs
  // imbriqués : chaque niveau doit utiliser un nom distinct (ex. "tab" / "subtab") sinon les
  // deux se synchronisent sur la même valeur et la navigation casse.
  paramName?: string;
}

export function AppTabs({ tabs, itemId, item, fit, paramName = "tab" }: AppTabsProps): React.JSX.Element {
  const { t } = useKrosoftTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  // L'onglet de l'URL peut ne pas exister dans la liste : lien obsolète, ou onglet retiré selon
  // les droits de l'utilisateur. On retombe alors sur le premier onglet plutôt que de n'afficher aucun contenu.
  const requestedTab = searchParams.get(paramName);
  const activeTab = tabs.find(tab => tab.value === requestedTab)?.value ?? tabs[0]?.value;

  const handleTabChange = (value: string) => {
    // On repart des params existants au lieu d'un objet vide : sinon changer d'onglet effacerait
    // tous les autres query params (filtres, et surtout l'onglet d'un AppTabs parent en cas d'imbrication).
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set(paramName, value);
    setSearchParams(newSearchParams);
  };

  // La liste défile horizontalement quand les onglets ne tiennent pas dans la largeur : sans ce
  // recentrage, un onglet actif situé hors écran (lien profond ?tab=…, ou beaucoup d'onglets sur
  // mobile) resterait invisible. "nearest" ne bouge rien quand l'onglet est déjà visible.
  const listRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const activeTrigger = listRef.current?.querySelector<HTMLElement>('[data-state="active"]');
    activeTrigger?.scrollIntoView?.({ behavior: "smooth", block: "nearest", inline: "nearest" });
  }, [activeTab]);

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange}>
      <TabsList ref={listRef} className={cn("w-full justify-start", fit && "sm:w-fit")}>
        {tabs.map(tab => (
          <TabsTrigger key={tab.value} value={tab.value} className="gap-2" disabled={tab.disabled}>
            {tab.icon ? (
              <span className="hidden sm:inline">
                <tab.icon className="size-4" />
              </span>
            ) : null}
            <span className="text-xs sm:text-sm">{t(tab.titleKey) ?? ""}</span>
            {tab.count ? <span className="text-gray-500 text-xs">({tab.count(item)})</span> : null}
          </TabsTrigger>
        ))}
      </TabsList>

      {tabs.map(tab => (
        <TabsContent key={tab.value} value={tab.value} className="mt-4">
          {tab.component ? tab.component(itemId) : null}
        </TabsContent>
      ))}
    </Tabs>
  );
}
