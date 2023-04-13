import React from 'react';
import { EmojiProps } from './Emoji';

const Emoji: React.FC<EmojiProps> = function Emoji(props) {
  const {
    id, size, shortcodes = '', skin = 1, icon, className
  } = props;

  return (id || icon?.id) ? (
    // @ts-expect-error
    <em-emoji
      class={className}
      size={size || '2rem'}
      id={id || icon?.id}
      shortcodes={shortcodes || icon?.shortcodes}
      skin={skin || icon?.skin || 1}
    />
  ) : null;
};

export default Emoji;
