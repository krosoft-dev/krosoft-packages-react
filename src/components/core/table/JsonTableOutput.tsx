import { Label, SimpleTable, SimpleTableBody, SimpleTableCell, SimpleTableHead, SimpleTableHeader, SimpleTableRow, Switch } from "@/components/ui";
import { formatJsonValue, isRecord, tryParseJson } from "@krosoft/core/helpers";
import React, { useState } from "react";

interface JsonTableOutputProps {
  header?: string;
  output: string;
}

export const JsonTableOutput = ({ header, output }: JsonTableOutputProps): React.JSX.Element | null => {
  const [showTable, setShowTable] = useState(true);

  const jsonData = tryParseJson(output);
  const isValidJson = jsonData !== null;

  const renderHeader = (): React.JSX.Element => (
    <div className="flex items-center justify-between mb-2">
      <span className="font-medium text-sm">{header}</span>
      <div className="flex items-center gap-2">
        <Switch id="table-mode" checked={showTable} onCheckedChange={setShowTable} />
        <Label htmlFor="table-mode" className="text-xs">
          Mode tableau
        </Label>
      </div>
    </div>
  );

  const TableWrapper = ({ children }: { children: React.ReactNode }): React.JSX.Element => (
    <div className="border rounded min-w-0 w-full">
      <SimpleTable>{children}</SimpleTable>
    </div>
  );

  const RawOutput = (): React.JSX.Element => (
    <pre className="text-xs bg-muted p-4 rounded overflow-x-auto whitespace-pre-wrap">
      {isValidJson && !showTable ? JSON.stringify(jsonData, null, 2) : output}
    </pre>
  );

  const renderContent = (): React.JSX.Element => {
    if (!isValidJson || !showTable) {
      return <RawOutput />;
    }

    // Tableau d'objets
    if (Array.isArray(jsonData) && jsonData.length > 0 && isRecord(jsonData[0])) {
      const rows = jsonData as Record<string, unknown>[];
      const keys = Object.keys(rows[0]);

      return (
        <TableWrapper>
          <SimpleTableHeader>
            <SimpleTableRow>
              {keys.map(key => (
                <SimpleTableHead key={key} className="font-medium">
                  {key}
                </SimpleTableHead>
              ))}
            </SimpleTableRow>
          </SimpleTableHeader>
          <SimpleTableBody>
            {rows.map((row, index) => (
              <SimpleTableRow key={index}>
                {keys.map(key => (
                  <SimpleTableCell key={key} className="text-sm whitespace-pre-wrap">
                    {formatJsonValue(row[key])}
                  </SimpleTableCell>
                ))}
              </SimpleTableRow>
            ))}
          </SimpleTableBody>
        </TableWrapper>
      );
    }

    // Objet simple
    if (isRecord(jsonData)) {
      const entries = Object.entries(jsonData);

      return (
        <TableWrapper>
          <SimpleTableHeader>
            <SimpleTableRow>
              <SimpleTableHead className="font-medium">Propriété</SimpleTableHead>
              <SimpleTableHead className="font-medium">Valeur</SimpleTableHead>
            </SimpleTableRow>
          </SimpleTableHeader>
          <SimpleTableBody>
            {entries.map(([key, value]) => (
              <SimpleTableRow key={key}>
                <SimpleTableCell className="font-medium text-sm">{key}</SimpleTableCell>
                <SimpleTableCell className="text-sm whitespace-pre-wrap">{formatJsonValue(value)}</SimpleTableCell>
              </SimpleTableRow>
            ))}
          </SimpleTableBody>
        </TableWrapper>
      );
    }

    return <RawOutput />;
  };

  if (!output) {
    return null;
  }

  return (
    <div className="min-w-0 w-full">
      {renderHeader()}
      {renderContent()}
    </div>
  );
};
