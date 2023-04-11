import React from 'react';

export interface AutoTextAreaProps {
  value: string;
  loading: boolean;
  disabled?: boolean;
  onButtonClick: React.MouseEventHandler<HTMLButtonElement>;
  onChange: React.ChangeEventHandler<HTMLTextAreaElement>;
  onKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement>;
  onCompositionStart: React.CompositionEventHandler<HTMLTextAreaElement>;
  onCompositionEnd: React.CompositionEventHandler<HTMLTextAreaElement>;
}
