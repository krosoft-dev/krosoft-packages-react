import { useToast } from "./useToast";

export const useNotifications = () => {
  const { toast } = useToast();

  const showSuccess = (title: string, description?: string | undefined) => {
    toast({
      title: title,
      description: description,
    });
  };

  const showError = (
    title: string,
    description?: string | undefined,
    error?: Error | null,
  ) => {
    console.error(description, error);
    toast({
      title: title,
      description: description,
      variant: "destructive",
    });
  };

  return {
    showSuccess,
    showError,
  };
};
