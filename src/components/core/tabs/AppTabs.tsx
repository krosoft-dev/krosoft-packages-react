import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { TabConfig } from "@/types/TabConfig";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { cn } from "@/helpers/tailwind.helper";

export interface AppTabsProps<T = unknown> {
  tabs: TabConfig<T>[];
  itemId?: string | null;
  item?: T | null;
  fit?: boolean;
}

export function AppTabs({ tabs, itemId, item, fit }: AppTabsProps): React.JSX.Element {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  // L'onglet de l'URL peut ne pas exister dans la liste : lien obsolète, ou onglet retiré selon
  // les droits de l'utilisateur. On retombe alors sur le premier onglet plutôt que de n'afficher aucun contenu.
  const requestedTab = searchParams.get("tab");
  const activeTab = tabs.find(tab => tab.value === requestedTab)?.value ?? tabs[0]?.value;

  const handleTabChange = (value: string) => {
    const newSearchParams = new URLSearchParams();
    newSearchParams.set("tab", value);
    setSearchParams(newSearchParams);
  };

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange}>
      <TabsList className={cn("w-full justify-start", fit && "sm:w-fit")}>
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
