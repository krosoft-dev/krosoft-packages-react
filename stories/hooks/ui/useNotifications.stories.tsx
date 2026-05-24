import type { Meta, StoryObj } from "@storybook/react";
import { Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from "@/components/ui/toast";
import { useNotifications } from "@/hooks/ui/useNotifications";
import { useToast } from "@/hooks/ui/useToast";

const Toaster = (): React.ReactElement => {
  const { toasts } = useToast();
  return (
    <>
      {toasts.map(({ id, title, description, action, ...props }) => (
        <Toast key={id} {...props}>
          <div className="grid gap-1">
            {title !== undefined && title !== "" ? <ToastTitle>{title}</ToastTitle> : null}
            {description !== undefined && description !== "" ? <ToastDescription>{description}</ToastDescription> : null}
          </div>
          {action}
          <ToastClose />
        </Toast>
      ))}
      <ToastViewport />
    </>
  );
};

const NotificationsDemo = (): React.ReactElement => {
  const { showSuccess, showError } = useNotifications();

  return (
    <div className="flex gap-3 p-4">
      <button
        className="inline-flex w-fit items-center justify-center rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        onClick={() => {
          showSuccess("Succès", "L'opération a été effectuée avec succès.");
        }}
      >
        Déclencher succès
      </button>
      <button
        className="inline-flex w-fit items-center justify-center rounded-md bg-destructive px-3 py-1.5 text-sm font-medium text-destructive-foreground hover:bg-destructive/90"
        onClick={() => {
          showError("Erreur", "Une erreur est survenue lors de l'opération.");
        }}
      >
        Déclencher erreur
      </button>
      <button
        className="inline-flex w-fit items-center justify-center rounded-md border px-3 py-1.5 text-sm font-medium hover:bg-accent"
        onClick={() => {
          showSuccess("Sans description");
        }}
      >
        Succès sans description
      </button>
      <Toaster />
    </div>
  );
};

const meta: Meta<typeof NotificationsDemo> = {
  title: "Hooks/useNotifications",
  component: NotificationsDemo,
  decorators: [
    (storyFn: () => React.ReactElement): React.ReactElement => {
      const StoryComponent = storyFn;
      return (
        <ToastProvider>
          <StoryComponent />
        </ToastProvider>
      );
    },
  ],
};

export default meta;

type Story = StoryObj<typeof NotificationsDemo>;

export const Default: Story = {};
