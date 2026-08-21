import type { Meta, StoryObj } from "@storybook/react-vite";
import { AspectRatio } from "@/components/ui/aspect-ratio";

const meta: Meta<typeof AspectRatio> = {
  title: "UI/Aspect Ratio",
  component: AspectRatio,
};

export default meta;

type Story = StoryObj<typeof AspectRatio>;

export const Square: Story = {
  render: () => (
    <AspectRatio ratio={1}>
      <div className="bg-slate-200 rounded flex items-center justify-center">1:1 Aspect Ratio</div>
    </AspectRatio>
  ),
};

export const Video: Story = {
  render: () => (
    <AspectRatio ratio={16 / 9}>
      <div className="bg-slate-200 rounded flex items-center justify-center">16:9 Video Ratio</div>
    </AspectRatio>
  ),
};

export const Portrait: Story = {
  render: () => (
    <AspectRatio ratio={9 / 16}>
      <div className="bg-slate-200 rounded flex items-center justify-center">9:16 Portrait Ratio</div>
    </AspectRatio>
  ),
};
