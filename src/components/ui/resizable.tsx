import { GripVertical } from "lucide-react";
import * as ResizablePrimitive from "react-resizable-panels";
import { cn } from "@/helpers/tailwind.helper";

// react-resizable-panels pose lui-même `display`, `flex-direction`, `width` et
// `height` en style inline sur le groupe, et documente qu'ils ne sont pas
// surchargeables : rien à styliser ici, on ne fait que laisser passer la classe
// du consommateur.
const ResizablePanelGroup = ({ className, ...props }: React.ComponentProps<typeof ResizablePrimitive.Group>): React.ReactElement => (
  <ResizablePrimitive.Group className={cn(className)} {...props} />
);

const ResizablePanel = ResizablePrimitive.Panel;

// L'orientation de la poignée est l'inverse de celle du groupe : dans un groupe
// `horizontal`, elle est une barre verticale. La librairie l'expose via
// `aria-orientation` sur le séparateur — `aria-[orientation=horizontal]` cible
// donc le cas « groupe vertical, poignée couchée ».
const ResizableHandle = ({
  withHandle,
  className,
  ...props
}: React.ComponentProps<typeof ResizablePrimitive.Separator> & {
  withHandle?: boolean;
}) => (
  <ResizablePrimitive.Separator
    className={cn(
      "relative flex w-px items-center justify-center bg-border after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 aria-[orientation=horizontal]:h-px aria-[orientation=horizontal]:w-full aria-[orientation=horizontal]:after:left-0 aria-[orientation=horizontal]:after:h-1 aria-[orientation=horizontal]:after:w-full aria-[orientation=horizontal]:after:-translate-y-1/2 aria-[orientation=horizontal]:after:translate-x-0 [&[aria-orientation=horizontal]>div]:rotate-90",
      className,
    )}
    {...props}
  >
    {withHandle && (
      <div className="z-10 flex h-4 w-3 items-center justify-center rounded-sm border bg-border">
        <GripVertical className="h-2.5 w-2.5" />
      </div>
    )}
  </ResizablePrimitive.Separator>
);

export { ResizablePanelGroup, ResizablePanel, ResizableHandle };
