import type { Meta, StoryObj } from "@storybook/react-vite";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const meta: Meta<typeof Tabs> = {
  title: "UI/Tabs",
  component: Tabs,
  args: {
    defaultValue: "compte",
  },
};

export default meta;
type Story = StoryObj<typeof Tabs>;

export const Default: Story = {
  render: args => (
    <Tabs {...args}>
      <TabsList>
        <TabsTrigger value="compte">Compte</TabsTrigger>
        <TabsTrigger value="mot-de-passe">Mot de passe</TabsTrigger>
      </TabsList>
      <TabsContent value="compte" className="p-4 border rounded-md mt-2 text-sm text-muted-foreground">
        Paramètres du compte.
      </TabsContent>
      <TabsContent value="mot-de-passe" className="p-4 border rounded-md mt-2 text-sm text-muted-foreground">
        Modifiez votre mot de passe ici.
      </TabsContent>
    </Tabs>
  ),
};

export const WithDisabled: Story = {
  render: args => (
    <Tabs {...args}>
      <TabsList>
        <TabsTrigger value="compte">Compte</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
        <TabsTrigger value="avance" disabled>
          Avancé
        </TabsTrigger>
      </TabsList>
      <TabsContent value="compte" className="p-4 border rounded-md mt-2 text-sm text-muted-foreground">
        Paramètres du compte.
      </TabsContent>
      <TabsContent value="notifications" className="p-4 border rounded-md mt-2 text-sm text-muted-foreground">
        Préférences de notification.
      </TabsContent>
    </Tabs>
  ),
};

export const Solid: Story = {
  render: args => (
    <Tabs {...args}>
      <TabsList variant="solid">
        <TabsTrigger value="compte">Compte</TabsTrigger>
        <TabsTrigger value="mot-de-passe">Mot de passe</TabsTrigger>
      </TabsList>
      <TabsContent value="compte" className="p-4 border rounded-md mt-2 text-sm text-muted-foreground">
        Paramètres du compte.
      </TabsContent>
      <TabsContent value="mot-de-passe" className="p-4 border rounded-md mt-2 text-sm text-muted-foreground">
        Modifiez votre mot de passe ici.
      </TabsContent>
    </Tabs>
  ),
};

export const ManyTabs: Story = {
  render: args => (
    <Tabs {...args} defaultValue="general">
      <TabsList>
        {["Général", "Profil", "Sécurité", "Notifications", "Facturation"].map(label => (
          <TabsTrigger key={label} value={label.toLowerCase()}>
            {label}
          </TabsTrigger>
        ))}
      </TabsList>
      {["Général", "Profil", "Sécurité", "Notifications", "Facturation"].map(label => (
        <TabsContent key={label} value={label.toLowerCase()} className="p-4 border rounded-md mt-2 text-sm text-muted-foreground">
          Contenu — {label}
        </TabsContent>
      ))}
    </Tabs>
  ),
};
