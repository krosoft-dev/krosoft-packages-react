import { toast } from "./useToast";
import type { ToastActionElement } from "../../components/ui";

export interface UseNotificationsResult {
  showSuccess: (title: string, description?: string, action?: ToastActionElement) => void;
  showError: (title: string, description?: string, error?: Error | null) => void;
}

export const useNotifications = (): UseNotificationsResult => {
  const showSuccess = (title: string, description?: string, action?: ToastActionElement): void => {
    toast({ title, description, action });
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
