import React from 'react';
import { Button, InlineField, Input, TextArea } from '@grafana/ui';
import { CustomFilterMap } from '../../../types/types';
import { CustomFilterValuesEditor } from './CustomFilterValuesEditor';

interface Props {
  customFilterMaps: CustomFilterMap[];
  onChange: (maps: CustomFilterMap[]) => void;
}

export function CustomFilterMapsEditor({ customFilterMaps, onChange }: Props) {
  const safeMaps = customFilterMaps || [];

  const generateId = () => `map_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const addFilterMap = () => {
    const newMap: CustomFilterMap = {
      id: generateId(),
      label: '',
      key: '',
      values: [],
      description: ''
    };
    onChange([...safeMaps, newMap]);
  };

  const updateFilterMap = (index: number, updates: Partial<CustomFilterMap>) => {
    const updatedMaps = safeMaps.map((map, i) => 
      i === index ? { ...map, ...updates } : map
    );
    onChange(updatedMaps);
  };

  const removeFilterMap = (index: number) => {
    const updatedMaps = safeMaps.filter((_, i) => i !== index);
    onChange(updatedMaps);
  };

  const validateFilterMap = (map: CustomFilterMap, index: number) => {
    const errors: string[] = [];
    
    if (!map.label?.trim()) {
      errors.push('Label is required');
    }
    
    if (!map.key?.trim()) {
      errors.push('Field key is required');
    } else {
      // Validate key format (alphanumeric and underscores only)
      if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(map.key)) {
        errors.push('Field key must be a valid identifier (letters, numbers, underscores)');
      }
      
      // Check for duplicate keys
      const duplicateIndex = safeMaps.findIndex((m, i) => 
        i !== index && m.key === map.key && map.key.trim()
      );
      if (duplicateIndex !== -1) {
        errors.push('Field key must be unique');
      }
    }

    return errors;
  };


  return (
    <div>
      <div style={{ 
        marginBottom: '16px'
      }}>
        <h4>Custom Filter Maps</h4>
      </div>
      
      {safeMaps.length === 0 ? (
        <div style={{ 
          padding: '24px', 
          textAlign: 'center', 
          color: '#8e8e8e',
          fontStyle: 'italic',
          border: '2px dashed #e3e3e3',
          borderRadius: '8px'
        }}>
          No custom filter maps configured
        </div>
      ) : (
        <div>
          {safeMaps.map((map, index) => {
            const errors = validateFilterMap(map, index);
            
            return (
              <div key={map.id} style={{ 
                border: '1px solid #ccc', 
                borderRadius: '8px',
                padding: '16px', 
                marginBottom: '16px',
                backgroundColor: '#f8f9fa'
              }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: '12px'
                }}>
                  <h5 style={{ margin: 0 }}>Filter Map #{index + 1}</h5>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeFilterMap(index)}
                    type="button"
                  >
                    Remove Filter Map
                  </Button>
                </div>
                
                <div style={{ display: 'flex', gap: '16px', marginBottom: '12px' }}>
                  <div style={{ flex: 1 }}>
                    <InlineField label="Label" labelWidth={12}>
                      <Input
                        value={map.label || ''}
                        onChange={(e) => updateFilterMap(index, { label: e.currentTarget.value })}
                        placeholder="Display name for this filter"
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
                    <InlineField label="Field Key" labelWidth={12}>
                      <Input
                        value={map.key || ''}
                        onChange={(e) => updateFilterMap(index, { key: e.currentTarget.value })}
                        placeholder="Database field name to filter on"
                        invalid={errors.some(e => e.includes('key') || e.includes('identifier'))}
                      />
                    </InlineField>
                    {errors.filter(e => e.includes('key') || e.includes('identifier')).map((error, i) => (
                      <div key={i} style={{ color: '#d44a3a', fontSize: '12px', marginTop: '4px' }}>
                        {error}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div style={{ marginBottom: '16px' }}>
                  <InlineField label="Description" labelWidth={12}>
                    <TextArea
                      value={map.description || ''}
                      onChange={(e) => updateFilterMap(index, { description: e.currentTarget.value })}
                      placeholder="Optional description explaining this filter's purpose"
                      rows={2}
                    />
                  </InlineField>
                </div>
                
                <div style={{ 
                  borderTop: '1px solid #e3e3e3', 
                  paddingTop: '16px',
                  marginTop: '16px'
                }}>
                  <CustomFilterValuesEditor
                    values={map.values || []}
                    onChange={(values) => updateFilterMap(index, { values })}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      <div style={{ marginTop: '16px' }}>
        <Button
          variant="primary"
          onClick={addFilterMap}
          type="button"
        >
          Add Filter Map
        </Button>
      </div>
    </div>
  );
}
