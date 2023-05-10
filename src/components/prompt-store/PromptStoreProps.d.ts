export interface PromptStoreList {
  key: string;
  label: string;
  value: string;
}

export interface PromptItemProps {
  values?: PromptStoreList;
  onConfirm: (changeFlag: boolean, values?: PromptStoreList) => void;
}
