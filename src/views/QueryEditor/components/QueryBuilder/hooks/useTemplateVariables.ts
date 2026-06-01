import { useMemo } from 'react';
import { SelectableValue } from '@grafana/data';
import { getTemplateSrv } from '@grafana/runtime';

const ALLOWED_TYPES = new Set(['query', 'custom', 'textbox', 'constant', 'interval', 'datasource']);

export const useTemplateVariables = (): Array<SelectableValue<string>> =>
  useMemo(() => {
    const srv = getTemplateSrv();
    if (!srv?.getVariables) {
      return [];
    }
    return srv
      .getVariables()
      .filter((v) => ALLOWED_TYPES.has((v as { type: string }).type))
      .map((v) => {
        const name = (v as { name: string }).name;
        return {
          label: `$${name}`,
          value: `$${name}`,
          description: `template variable (${(v as { type: string }).type})`,
        };
      });
  }, []);
