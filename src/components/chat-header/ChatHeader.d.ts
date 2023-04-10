export interface ChatHeaderProps {
  title?: string;
  disabled?: boolean;
  chatId: string;
  onResize: (size: string) => void;
}
