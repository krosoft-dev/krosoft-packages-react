import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { RatingInput } from "@/components/core/inputs/RatingInput";

const meta: Meta<typeof RatingInput> = {
  title: "Core/Inputs/RatingInput",
  component: RatingInput,
  args: {
    value: 3,
    max: 5,
    icon: "star",
    size: "md",
  },
  argTypes: {
    value: { control: { type: "number", min: 0, max: 10 } },
    max: { control: { type: "number", min: 1, max: 10 } },
    icon: { control: "inline-radio", options: ["star", "heart"] },
    size: { control: "inline-radio", options: ["sm", "md"] },
    colorClassName: { control: "text" },
    onChange: { action: "change" },
  },
};

export default meta;

type Story = StoryObj<typeof RatingInput>;

export const Star: Story = {
  args: { icon: "star" },
};

export const Heart: Story = {
  args: { icon: "heart", value: 4 },
};

/** Sans `onChange`, le composant est en lecture seule (aucun bouton, `role="img"`). */
export const ReadOnly: Story = {
  args: { icon: "heart", value: 4, onChange: undefined },
};

export const Small: Story = {
  args: { icon: "star", value: 5, size: "sm" },
};

/** `max` libre : ici une note sur 10. */
export const OutOfTen: Story = {
  args: { icon: "star", value: 7, max: 10 },
};

/** `colorClassName` surcharge la couleur par défaut de l'icône. */
export const CustomColor: Story = {
  args: { icon: "star", value: 3, colorClassName: "fill-emerald-500 text-emerald-500" },
};

export const Interactive: Story = {
  render: () => {
    const [star, setStar] = useState(3);
    const [heart, setHeart] = useState(2);
    return (
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <span className="text-sm text-muted-foreground">Note (étoiles) : {star}/5</span>
          <RatingInput icon="star" value={star} onChange={setStar} />
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-sm text-muted-foreground">Envie (cœurs) : {heart}/5</span>
          <RatingInput icon="heart" value={heart} onChange={setHeart} />
        </div>
        <p className="text-xs text-muted-foreground">Astuce : recliquer sur la valeur active la remet à 0.</p>
      </div>
    );
  },
};
