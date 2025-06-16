import React from 'react';
import { Button, InlineField, Input } from '@grafana/ui';
import { CustomFilterValue } from '../../../types/types';

interface Props {
  values: CustomFilterValue[];
  onChange: (values: CustomFilterValue[]) => void;
}

export function CustomFilterValuesEditor({ values, onChange }: Props) {
  const safeValues = values || [];

  const addValue = () => {
    const newValue: CustomFilterValue = {
      label: '',
      value: ''
    };
    onChange([...safeValues, newValue]);
  };

  const updateValue = (index: number, updates: Partial<CustomFilterValue>) => {
    const updatedValues = safeValues.map((value, i) => 
      i === index ? { ...value, ...updates } : value
    );
    onChange(updatedValues);
  };

  const removeValue = (index: number) => {
    const updatedValues = safeValues.filter((_, i) => i !== index);
    onChange(updatedValues);
  };

  const validateValue = (value: CustomFilterValue, index: number) => {
    const errors: string[] = [];
    
    if (!value.label.trim()) {
      errors.push('Label is required');
    }
    
    if (!value.value.trim()) {
      errors.push('Value is required');
    }

    // Check for duplicate values
    const duplicateIndex = safeValues.findIndex((v, i) => 
      i !== index && v.value === value.value && value.value.trim()
    );
    if (duplicateIndex !== -1) {
      errors.push('Value must be unique');
    }

    return errors;
  };

  return (
    <div>
      <h5>Filter Values</h5>
      
      {safeValues.length === 0 ? (
        <div style={{ 
          padding: '16px', 
          textAlign: 'center', 
          color: '#8e8e8e',
          fontStyle: 'italic' 
        }}>
          No values configured
        </div>
      ) : (
        <div>
          {safeValues.map((value, index) => {
            const errors = validateValue(value, index);
            
            return (
              <div key={index} style={{ 
                border: '1px solid #e3e3e3', 
                borderRadius: '4px',
                padding: '12px', 
                marginBottom: '8px',
                backgroundColor: '#fafafa'
              }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <InlineField label="Label" labelWidth={12}>
                      <Input
                        value={value.label}
                        onChange={(e) => updateValue(index, { label: e.currentTarget.value })}
                        placeholder="Display name for this option"
                        invalid={errors.some(e => e.includes('Label'))}
                      />
                    </InlineField>
                    {errors.filter(e => e.includes('Label')).map((error, i) => (
                      <div key={i} style={{ color: '#d44a3a', fontSize: '12px', marginTop: '4px' }}>
                        {error}
                      </div>
                    ))}
                  </div>
                  
                  <div style={{ flex: 1 }}>
                    <InlineField label="Value" labelWidth={12}>
                      <Input
                        value={value.value}
                        onChange={(e) => updateValue(index, { value: e.currentTarget.value })}
                        placeholder="Value used in database query"
                        invalid={errors.some(e => e.includes('Value') || e.includes('unique'))}
                      />
                    </InlineField>
                    {errors.filter(e => e.includes('Value') || e.includes('unique')).map((error, i) => (
                      <div key={i} style={{ color: '#d44a3a', fontSize: '12px', marginTop: '4px' }}>
                        {error}
                      </div>
                    ))}
                  </div>
                  
                  <div style={{ paddingTop: '24px' }}>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removeValue(index)}
                      type="button"
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      <div style={{ marginTop: '12px' }}>
        <Button
          variant="secondary"
          onClick={addValue}
          type="button"
        >
          Add Value
        </Button>
      </div>
    </div>
  );
}