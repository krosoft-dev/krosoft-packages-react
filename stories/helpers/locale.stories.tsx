import React, { useEffect, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { createInstance, type i18n as I18n } from "i18next";
import { I18nextProvider, initReactI18next, useTranslation } from "react-i18next";
import { HardDrive, TrendingUp } from "lucide-react";
import { formatFullDateTime, formatNumber, formatShortDate, formatShortDateTime, formatSize, getLocale, resetLocale, setLocale } from "@krosoft/core/helpers";
import { KpiCard } from "@/components/core/cards/KpiCard";

interface DemoLanguage {
  code: string;
  label: string;
  locale: string;
}

// Langue i18next <-> locale de formatage : c'est la seule table à maintenir côté application.
const LANGUAGES: DemoLanguage[] = [
  { code: "fr", label: "Français", locale: "fr-FR" },
  { code: "en", label: "English", locale: "en-US" },
  { code: "de", label: "Deutsch", locale: "de-DE" },
  { code: "ja", label: "日本語", locale: "ja-JP" },
];

const localeOf = (language: string): string => LANGUAGES.find(l => l.code === language.split("-")[0])?.locale ?? language;

const resources = {
  fr: {
    translation: {
      demo: {
        revenue: "Chiffre d'affaires",
        storage: "Stockage consommé",
        language: "Langue i18next",
        locale: "Locale des helpers",
        helper: "Helper",
        result: "Résultat",
        reset: "Revenir au français",
      },
    },
  },
  en: {
    translation: {
      demo: {
        revenue: "Revenue",
        storage: "Storage used",
        language: "i18next language",
        locale: "Helpers locale",
        helper: "Helper",
        result: "Result",
        reset: "Back to French",
      },
    },
  },
  de: {
    translation: {
      demo: {
        revenue: "Umsatz",
        storage: "Belegter Speicher",
        language: "i18next-Sprache",
        locale: "Helfer-Locale",
        helper: "Helfer",
        result: "Ergebnis",
        reset: "Zurück zu Französisch",
      },
    },
  },
  ja: {
    translation: {
      demo: {
        revenue: "売上高",
        storage: "使用ストレージ",
        language: "i18next の言語",
        locale: "ヘルパーのロケール",
        helper: "ヘルパー",
        result: "結果",
        reset: "フランス語に戻す",
      },
    },
  },
};

/**
 * Instance i18next dédiée à la démo, avec le pont vers les helpers de `@krosoft/core` :
 * un seul `on("languageChanged")` au démarrage de l'application suffit pour que
 * `formatNumber`, `formatSize` et les helpers de dates suivent la langue affichée.
 */
const createDemoI18n = (): I18n => {
  const instance = createInstance();

  void instance.use(initReactI18next).init({
    lng: "fr",
    fallbackLng: "fr",
    resources,
    interpolation: { escapeValue: false },
  });

  instance.on("languageChanged", language => {
    setLocale(localeOf(language));
  });
  setLocale(localeOf(instance.language));

  return instance;
};

// Une seule instance pour toute la story : un rendu de Storybook ne doit pas repartir de zéro.
let demoI18n: I18n | undefined;

const getDemoI18n = (): I18n => {
  demoI18n ??= createDemoI18n();
  return demoI18n;
};

const SAMPLE_DATE = "2026-03-14T09:05:07.000Z";
const SAMPLE_NUMBER = 1234567.891;
const SAMPLE_BYTES = 2_684_354_560;

const HelperRow = ({ call, result }: { call: string; result: string }): React.ReactElement => (
  <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-4 border-t px-3 py-2 text-sm">
    <code className="font-mono text-xs text-muted-foreground break-all">{call}</code>
    <span className="font-medium">{result}</span>
  </div>
);

const LocaleDemo = (): React.ReactElement => {
  const { t, i18n } = useTranslation();

  // La locale des helpers est un état de module : on la synchronise au montage et on
  // rend sa valeur par défaut au package en sortant, pour ne pas déteindre sur les autres stories.
  useEffect(() => {
    setLocale(localeOf(i18n.language));
    return resetLocale;
  }, [i18n]);

  return (
    <div className="flex flex-col gap-6 p-4 max-w-3xl">
      <div className="flex flex-wrap gap-2">
        {LANGUAGES.map(language => (
          <button
            key={language.code}
            onClick={() => void i18n.changeLanguage(language.code)}
            className={`rounded-md border px-3 py-1.5 text-sm transition-colors hover:bg-accent ${i18n.language === language.code ? "border-primary bg-primary/10 font-medium" : ""}`}
          >
            {language.label}
          </button>
        ))}
      </div>

      <div className="rounded-md border p-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">{t("demo.language")}</span>
          <code className="font-mono">{i18n.language}</code>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">{t("demo.locale")} — getLocale()</span>
          <code className="font-mono">{getLocale()}</code>
        </div>
      </div>

      {/* Les composants du design system ne connaissent pas la locale : ils appellent les helpers. */}
      <div className="grid gap-4 sm:grid-cols-2">
        <KpiCard titleKey="demo.revenue" value={SAMPLE_NUMBER} icon={TrendingUp} />
        <KpiCard titleKey="demo.storage" value={formatSize(SAMPLE_BYTES)} icon={HardDrive} />
      </div>

      <div className="rounded-md border">
        <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-4 px-3 py-2 text-xs font-medium uppercase text-muted-foreground">
          <span>{t("demo.helper")}</span>
          <span>{t("demo.result")}</span>
        </div>
        <HelperRow call={`formatNumber(${String(SAMPLE_NUMBER)})`} result={formatNumber(SAMPLE_NUMBER)} />
        <HelperRow call={`formatSize(${String(SAMPLE_BYTES)})`} result={formatSize(SAMPLE_BYTES)} />
        <HelperRow call="formatShortDate(date)" result={formatShortDate(SAMPLE_DATE)} />
        <HelperRow call="formatShortDateTime(date)" result={formatShortDateTime(SAMPLE_DATE)} />
        <HelperRow call="formatFullDateTime(date)" result={formatFullDateTime(SAMPLE_DATE)} />
      </div>

      <div>
        <button
          onClick={() => void i18n.changeLanguage("fr")}
          className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          {t("demo.reset")}
        </button>
      </div>
    </div>
  );
};

const ExplicitLocaleDemo = (): React.ReactElement => {
  const [globalLocale, setGlobalLocale] = useState(getLocale());

  useEffect(() => resetLocale, []);

  return (
    <div className="flex flex-col gap-6 p-4 max-w-3xl">
      <div className="rounded-md border p-4 text-sm flex justify-between">
        <span className="text-muted-foreground">getLocale() — locale par défaut du package</span>
        <code className="font-mono">{globalLocale}</code>
      </div>

      <div className="rounded-md border overflow-x-auto">
        <div className="grid min-w-[36rem] grid-cols-4 gap-4 px-3 py-2 text-xs font-medium uppercase text-muted-foreground">
          <span>locale</span>
          <span>formatNumber</span>
          <span>formatSize</span>
          <span>formatShortDate</span>
        </div>
        {LANGUAGES.map(language => (
          <div key={language.locale} className="grid min-w-[36rem] grid-cols-4 gap-4 border-t px-3 py-2 text-sm">
            <code className="font-mono text-xs text-muted-foreground">{language.locale}</code>
            <span>{formatNumber(SAMPLE_NUMBER, language.locale)}</span>
            <span>{formatSize(SAMPLE_BYTES, language.locale)}</span>
            <span>{formatShortDate(SAMPLE_DATE, language.locale)}</span>
          </div>
        ))}
      </div>

      <p className="text-sm text-muted-foreground">
        Chaque ligne est produite avec une locale passée en dernier argument : la locale par défaut, elle, n&apos;a pas bougé.
      </p>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => {
            setLocale("en-US");
            setGlobalLocale(getLocale());
          }}
          className="rounded-md border px-3 py-1.5 text-sm transition-colors hover:bg-accent"
        >
          setLocale(&quot;en-US&quot;)
        </button>
        <button
          onClick={() => {
            resetLocale();
            setGlobalLocale(getLocale());
          }}
          className="rounded-md border px-3 py-1.5 text-sm transition-colors hover:bg-accent"
        >
          resetLocale()
        </button>
      </div>
    </div>
  );
};

const meta: Meta<typeof LocaleDemo> = {
  title: "Helpers/Locale i18n",
  component: LocaleDemo,
  parameters: {
    docs: {
      description: {
        component: `
Les helpers de formatage de \`@krosoft/core\` (\`formatNumber\`, \`formatSize\`, \`formatShortDate\`, \`formatShortDateTime\`, \`formatFullDateTime\`) ne codent plus \`fr-FR\` en dur : ils lisent une locale paramétrable.

### Brancher les helpers sur i18next

Une seule ligne au démarrage de l'application suffit — ensuite tout composant qui consomme un helper suit la langue affichée :

\`\`\`ts
import { setLocale } from "@krosoft/core/helpers";

i18n.on("languageChanged", language => { setLocale(localeOf(language)); });
setLocale(localeOf(i18n.language));
\`\`\`

### API

- \`setLocale(locale)\` fixe la locale par défaut de tous les helpers de formatage.
- \`getLocale()\` renvoie la locale courante.
- \`resetLocale()\` rétablit \`fr-FR\`, la valeur par défaut du package.
- chaque helper accepte une locale explicite en dernier argument, prioritaire sur la locale par défaut.

### Points d'attention

- \`formatSize\` conserve les suffixes français (o / Ko / Mo / Go) et bascule sur les symboles internationaux (B / KB / MB / GB) hors français.
- La locale est un état de module, partagé par toute l'application : la changer suffit, mais il faut un rendu pour que l'affichage suive — le \`languageChanged\` de i18next s'en charge via \`useTranslation\`.
- Les applications monolingues n'ont rien à faire : sans \`setLocale\`, le comportement reste \`fr-FR\`.
`,
      },
    },
  },
  decorators: [
    Story => (
      <I18nextProvider i18n={getDemoI18n()}>
        <Story />
      </I18nextProvider>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof LocaleDemo>;

/** La langue i18next pilote la locale des helpers, donc l'affichage des composants. */
export const Default: Story = {};

/** Une locale passée en argument l'emporte, sans toucher à la locale par défaut. */
export const LocaleExplicite: StoryObj<typeof ExplicitLocaleDemo> = {
  render: () => <ExplicitLocaleDemo />,
};
