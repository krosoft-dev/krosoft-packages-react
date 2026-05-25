import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ConstructionIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";

export interface AppVerticalTab {
  value: string;
  titleKey: string;
  icon?: React.ElementType;
  component?: () => React.JSX.Element;
  disabled?: boolean;
}

export interface AppVerticalTabsProps {
  tabs: AppVerticalTab[];
}

export const AppVerticalTabs = ({ tabs }: AppVerticalTabsProps): React.JSX.Element => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || tabs[0]?.value;

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
            <p className="text-lg font-medium">Section en cours de développement</p>
            <p className="text-sm text-gray-400">Cette fonctionnalité sera bientôt disponible</p>
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
            {tabs.map((item, index) => (
              <div
                key={index}
                className={`px-2 py-2 rounded-2xl text-sm transition-colors flex items-center gap-2 ${
                  item.disabled
                    ? "text-gray-400 cursor-not-allowed opacity-50"
                    : activeTab === item.value
                      ? "crm-color-styled font-medium cursor-pointer"
                      : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 cursor-pointer"
                }`}
                onClick={() => !item.disabled && handleTabChange(item.value)}
              >
                {item.icon && <item.icon className="size-4" />} 
                <span className="flex-1">{t(item.titleKey)}</span>
                {!item.component && <ConstructionIcon className="size-4 text-amber-500" />}
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      <div className="md:hidden w-full border-b pb-4 mb-4">
        <Select value={activeTab} onValueChange={handleTabChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Sélectionner une section" />
          </SelectTrigger>
          <SelectContent>
            {tabs.map((item, index) => (
              <SelectItem key={index} value={item.value} disabled={item.disabled}>
                <div className="flex items-center gap-2">
                  {item.icon && <item.icon className="size-4" />}
                  <span>{t(item.titleKey)}</span>
                  {!item.component && <ConstructionIcon className="size-4 text-amber-500" />}
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
