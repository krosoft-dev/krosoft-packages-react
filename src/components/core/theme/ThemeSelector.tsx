import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useTheme, type ThemeOption } from "@/hooks/ui/useTheme";

interface ThemeSelectorProps {
  themeOptions: readonly ThemeOption[];
  variant?: "select" | "mini";
}

export function ThemeSelector({ themeOptions, variant = "select" }: ThemeSelectorProps) {
  const { theme, handleThemeChange, currentThemeOption, nextThemeOption, cycleTheme } = useTheme(themeOptions);

  if (variant === "mini") {
    const CurrentIcon = currentThemeOption?.icon;

    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={cycleTheme}
              className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
              {CurrentIcon && <CurrentIcon className="size-4" />}
              <span className="sr-only">Thème actuel : {currentThemeOption?.label}</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom" align="center">
            Passer en {nextThemeOption?.label}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <div className="space-y-2">
      <Select value={theme} onValueChange={handleThemeChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Sélectionner un thème" />
        </SelectTrigger>
        <SelectContent>
          {themeOptions.map(option => {
            const Icon = option.icon;
            return (
              <SelectItem key={option.value} value={option.value}>
                <div className="flex items-center gap-2">
                  <Icon className="size-4" />
                  {option.label}
                </div>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
      {currentThemeOption?.message && <p className="text-sm text-muted-foreground">{currentThemeOption.message}</p>}
    </div>
  );
}
