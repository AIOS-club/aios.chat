export interface PromptStoreList {
  key: string;
  label: string;
  value: string;
}

export interface PromptItemProps {
  values?: PromptStoreList;
  onConfirm: (changeFlag: boolean, values?: PromptStoreList) => void;
}

export interface ImportFromLocalProps {
  onConfirm: (value: Record<string, string> | Array<Record<string, string>>) => void;
}

export interface ImportFromOnlineProps {
  onConfirm: (value: Record<string, string> | Array<Record<string, string>>) => void;
}
