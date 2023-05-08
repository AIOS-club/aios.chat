export interface PromptStoreList {
  title: string;
  content: string;
}

export interface PromptItemProps {
  values?: PromptStoreList;
  onConfirm: (changeFlag: boolean, values?: PromptStoreList) => void;
}
