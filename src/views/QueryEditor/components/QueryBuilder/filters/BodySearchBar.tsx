import React, { useState } from 'react';
import { IconButton, Input } from '@grafana/ui';
import { FilterCondition, SignalType } from '../../../../../types/types';
import { parseInlineFilter } from './inlineParser';
import { DiscoveredKey } from './resolveScope';

type Props = {
  value: string;
  isRegex: boolean;
  signal: SignalType;
  discoveredKeys: DiscoveredKey[];
  onCommit: (value: string, isRegex: boolean) => void;
  onAddFilter: (cond: FilterCondition) => void;
};

export const BodySearchBar = ({ value, isRegex, signal, discoveredKeys, onCommit, onAddFilter }: Props) => {
  const [draft, setDraft] = useState(value);
  const [regex, setRegex] = useState(isRegex);

  const submit = () => {
    const parsed = parseInlineFilter(draft, signal, discoveredKeys);
    if (parsed) {
      onAddFilter(parsed);
      setDraft('');
      onCommit('', regex);
      return;
    }
    onCommit(draft, regex);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      submit();
    }
  };

  const toggleRegex = () => {
    const next = !regex;
    setRegex(next);
    onCommit(draft, next);
  };

  return (
    <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 8 }}>
      <Input
        width={80}
        placeholder={regex ? 'regex pattern OR key=value' : 'search body OR key=value'}
        value={draft}
        onChange={(e) => setDraft((e.target as HTMLInputElement).value)}
        onKeyDown={onKeyDown}
        prefix={<span style={{ color: '#6e9fff', fontSize: 11 }}>BODY</span>}
      />
      <IconButton
        name="brackets-curly"
        aria-label={regex ? 'Disable regex' : 'Enable regex'}
        tooltip={regex ? 'Regex mode (on)' : 'Regex mode (off)'}
        variant={regex ? 'primary' : 'secondary'}
        onClick={toggleRegex}
      />
    </div>
  );
};
