import { toast } from "./useToast";

export interface UseNotificationsResult {
  showSuccess: (title: string, description?: string) => void;
  showError: (title: string, description?: string, error?: Error | null) => void;
}

export const useNotifications = (): UseNotificationsResult => {
  const showSuccess = (title: string, description?: string): void => {
    toast({ title, description });
  };

  const showError = (title: string, description?: string, error?: Error | null): void => {
    console.error(description, error);
    toast({ title, description, variant: "destructive" });
  };

  return {
    showSuccess,
    showError,
  };
};
