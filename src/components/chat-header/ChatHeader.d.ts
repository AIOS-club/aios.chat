export interface ChatHeaderProps {
  title?: string;
  disabled?: boolean;
  chatId: string;
  systemMessage?: string;
  onResize: (width: string, height: string) => void;
}
