import { DocumentTitleContext } from "@/contexts/documentTitle.context";
import * as React from "react";

export interface DocumentTitleProviderProps {
  appTitle: string;
  children: React.ReactNode;
}

/** Fournit le nom de l'application ajouté au titre de l'onglet par `useDocumentTitle` (ex : « Factures | MonApp »). */
export const DocumentTitleProvider = ({ appTitle, children }: DocumentTitleProviderProps): React.JSX.Element => (
  <DocumentTitleContext.Provider value={appTitle}>{children}</DocumentTitleContext.Provider>
);
