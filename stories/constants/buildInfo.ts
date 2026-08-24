// Valeurs remplacées au build par `viteFinal` (voir .storybook/main.ts).
export const buildInfo = {
  version: __KROSOFT_VERSION__,
  commit: __KROSOFT_COMMIT__,
  buildDate: __KROSOFT_BUILD_DATE__,
};

export const shortCommit = buildInfo.commit ? buildInfo.commit.slice(0, 7) : "local";

export const formattedBuildDate = new Intl.DateTimeFormat("fr-FR", {
  dateStyle: "long",
  timeStyle: "short",
}).format(new Date(buildInfo.buildDate));
