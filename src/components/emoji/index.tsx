import React from 'react';
import { EmojiProps } from './Emoji';

const Emoji: React.FC<EmojiProps> = function Emoji(props) {
  const { id, size, shortcodes = '', skin = 1 } = props;

  // @ts-expect-error
  return <em-emoji size={size || '2rem'} id={id} shortcodes={shortcodes} skin={skin || 1} />;
};

export default Emoji;
