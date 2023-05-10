import React from 'react';

export interface AutoTextAreaProps {
  loading: boolean;
  onFetchAnswer: (value: string) => Promise<void>;
}
