import type { Meta, StoryObj } from "@storybook/react-vite";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const meta: Meta<typeof Avatar> = {
  title: "UI/Avatar",
  component: Avatar,
};

export default meta;

type Story = StoryObj<typeof Avatar>;

export const Default: Story = {
  render: () => (
    <Avatar>
      <AvatarImage src="https://github.com/shadcn.png" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  ),
};

export const Fallback: Story = {
  render: () => (
    <Avatar>
      <AvatarImage src="https://github.com/invalid.png" />
      <AvatarFallback>JD</AvatarFallback>
    </Avatar>
  ),
};

export const Multiple: Story = {
  render: () => (
    <div className="flex gap-2">
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback>SC</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarImage src="https://github.com/vercel.png" />
        <AvatarFallback>VR</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarImage src="https://github.com/invalid.png" />
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
    </div>
  ),
};
