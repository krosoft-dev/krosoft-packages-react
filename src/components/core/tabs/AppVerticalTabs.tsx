import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { TabConfig } from "@/types/TabConfig";
import { ConstructionIcon } from "lucide-react";
import { useKrosoftTranslation } from "@/i18n";
import { useSearchParams } from "react-router-dom";

export interface AppVerticalTabsProps<T = unknown> {
  tabs: TabConfig<T>[];
  item?: T | null;
}

export const AppVerticalTabs = ({ tabs, item }: AppVerticalTabsProps): React.JSX.Element => {
  const { t } = useKrosoftTranslation();
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

  const renderContent = () => {
    const tab = tabs.find(tab => tab.value === activeTab);
    if (!tab) return null;
    return tab.component ? tab.component() : renderDefaultContent();
  };

  const renderDefaultContent = () => {
    return (
      <div className="p-4 lg:p-6">
        <div className="flex items-center justify-center h-64 text-gray-500">
          <div className="text-center">
            <ConstructionIcon className="h-12 w-12 mx-auto mb-4 text-amber-500" />
            <p className="text-lg font-medium">{t("states.underConstruction")}</p>
            <p className="text-sm text-gray-400">{t("states.comingSoon")}</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col md:flex-row h-full min-w-0  ">
      <div className="w-64 lg:w-80 flex-shrink-0 hidden md:block border-r border-gray-200 dark:border-gray-700 pr-4">
        <ScrollArea className="h-full">
          <div className="space-y-1">
            {tabs.map((tab, index) => (
              <div
                key={index}
                className={`px-2 py-2 rounded-control text-sm transition-colors flex items-center gap-2 ${
                  tab.disabled
                    ? "text-gray-400 cursor-not-allowed opacity-50"
                    : activeTab === tab.value
                      ? "crm-color-styled font-medium cursor-pointer"
                      : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 cursor-pointer"
                }`}
                onClick={() => !tab.disabled && handleTabChange(tab.value)}
              >
                {tab.icon && <tab.icon className="size-4" />}
                <span className="flex-1">{t(tab.titleKey)}</span>
                {tab.count && <span className="text-xs text-gray-500">({tab.count(item)})</span>}
                {!tab.component && <ConstructionIcon className="size-4 text-amber-500" />}
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      <div className="md:hidden w-full border-b pb-4 mb-4">
        <Select value={activeTab} onValueChange={handleTabChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder={t("select.section")} />
          </SelectTrigger>
          <SelectContent>
            {tabs.map((tab, index) => (
              <SelectItem key={index} value={tab.value} disabled={tab.disabled}>
                <div className="flex items-center gap-2">
                  {tab.icon && <tab.icon className="size-4" />}
                  <span>{t(tab.titleKey)}</span>
                  {tab.count && <span className="text-xs text-gray-500">({tab.count(item)})</span>}
                  {!tab.component && <ConstructionIcon className="size-4 text-amber-500" />}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex-1 md:px-4 min-w-0 overflow-auto">{renderContent()}</div>
    </div>
  );
};
