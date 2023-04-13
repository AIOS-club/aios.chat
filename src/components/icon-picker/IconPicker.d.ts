export interface IconProps {
  aliases?: string[];
  id: string;
  keywords?: string[];
  name?: string;
  native?: string;
  shortcodes?: string;
  skin?: number;
  unified?: string;
}

export interface IconPickerProps {
  emojiId?: string;
  icon?: IconProps;
  disabled?: boolean;
  closeable?: boolean;
  onSelect?: (icon?: IconProps) => void;
}
