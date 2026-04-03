import type { Meta, StoryObj } from "@storybook/react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";

const meta: Meta<typeof Card> = {
  title: "UI/Card",
  component: Card,
};

export default meta;

type Story = StoryObj<typeof Card>;

export const Default: Story = {
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card description goes here.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Card content area.</p>
      </CardContent>
    </Card>
  ),
};

export const WithFooter: Story = {
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card description goes here.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Card content area.</p>
      </CardContent>
      <CardFooter>
        <p className="text-sm text-muted-foreground">Footer content</p>
      </CardFooter>
    </Card>
  ),
};

export const SimpleContent: Story = {
  render: () => (
    <Card className="w-80">
      <CardContent className="pt-6">
        <p>A simple card with only content.</p>
      </CardContent>
    </Card>
  ),
};

export const AllParts: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Card className="w-80">
        <CardHeader>
          <CardTitle>Full Card</CardTitle>
          <CardDescription>All sub-components combined.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Main content goes here.</p>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-muted-foreground">Footer</p>
        </CardFooter>
      </Card>
      <Card className="w-80">
        <CardHeader>
          <CardTitle>Header Only</CardTitle>
        </CardHeader>
      </Card>
      <Card className="w-80">
        <CardContent className="pt-6">
          <p>Content only.</p>
        </CardContent>
      </Card>
    </div>
  ),
};
