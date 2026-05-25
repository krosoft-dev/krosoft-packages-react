export interface TabConfig<T = unknown> {
  value: string;
  titleKey: string;
  icon?: React.ElementType;
  component?: (x?: string | null) => React.JSX.Element;
  disabled?: boolean;
  count?: (x: T | null) => number;
}
