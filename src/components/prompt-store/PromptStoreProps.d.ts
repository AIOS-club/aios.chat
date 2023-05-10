export interface PromptStoreList {
  label: string;
  value: string;
}

export interface PromptItemProps {
  values?: PromptStoreList;
  onConfirm: (changeFlag: boolean, values?: PromptStoreList) => void;
}
