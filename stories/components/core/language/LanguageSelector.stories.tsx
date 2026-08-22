import type { Meta, StoryObj } from "@storybook/react-vite";
import i18next from "i18next";
import { I18nextProvider, initReactI18next } from "react-i18next";
import { LanguageSelector } from "@/components/core/language/LanguageSelector";
import { registerKrosoftLocales } from "@/i18n";
import { DEMO_LANGUAGE_OPTIONS } from "../../../constants/languages";

/**
 * Instance dédiée à la démo : le sélecteur agit sur l'i18next de son contexte,
 * donc changer de langue ici ne touche pas le reste du Storybook.
 */
const demoI18n = i18next.createInstance();
void demoI18n.use(initReactI18next).init({ lng: "fr", fallbackLng: "fr", resources: {}, interpolation: { escapeValue: false } });
registerKrosoftLocales(demoI18n);

const withI18n = (Story: React.ComponentType): React.JSX.Element => (
  <I18nextProvider i18n={demoI18n}>
    <div className="p-6">
      <Story />
    </div>
  </I18nextProvider>
);

const meta: Meta<typeof LanguageSelector> = {
  title: "Core/Language/LanguageSelector",
  component: LanguageSelector,
  decorators: [withI18n],
};

export default meta;

type Story = StoryObj<typeof LanguageSelector>;

export const SelectVariant: Story = {
  args: {
    languageOptions: DEMO_LANGUAGE_OPTIONS,
    variant: "select",
  },
  render: args => (
    <div className="w-72">
      <LanguageSelector {...args} />
    </div>
  ),
};

export const MiniVariant: Story = {
  args: {
    languageOptions: DEMO_LANGUAGE_OPTIONS,
    variant: "mini",
  },
};

export const BothVariants: Story = {
  render: () => (
    <div className="flex items-start gap-8">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-muted-foreground">select</p>
        <div className="w-64">
          <LanguageSelector languageOptions={DEMO_LANGUAGE_OPTIONS} variant="select" />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-muted-foreground">mini</p>
        <LanguageSelector languageOptions={DEMO_LANGUAGE_OPTIONS} variant="mini" />
      </div>
    </div>
  ),
};
