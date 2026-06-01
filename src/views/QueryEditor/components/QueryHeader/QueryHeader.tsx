import React, { useEffect, useState } from 'react';
import {Button, Label, Modal, RadioButtonGroup, Badge} from '@grafana/ui';
import { config } from '@grafana/runtime';
import { EditorMode } from '../../../../types/types';
import { QueryHeaderProps } from './QueryHeader.types';
import { findDifferences } from './helpers/findDifferences';
import { QueryHeaderTabs } from './QueryHeader.constants';


export const QueryHeader = ({
  editorMode,
  setEditorMode,
  isAnnotationView,
  onTriggerQuery,
  datasource,
  query,
  onChange,
  hasAutocompleteError,
}: QueryHeaderProps) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [differences, setDifferences] = useState<any[]>([]);

  const onEditorModeChange = (editorMode: EditorMode) => {
    setEditorMode(editorMode);
    onChange({ ...query, editorMode });
  };

  useEffect(() => {
    setDifferences(findDifferences(query, datasource));
  }, [query, datasource]);

  const onConfirm = () => {
    setModalOpen(false);
    const fieldsToReset = differences.reduce((acc, item) => {
      acc[item.fieldName] = item.updated;

      return acc;
    }, {});

    onChange({ ...query, ...fieldsToReset });
  };

  const isAdmin = config.bootData?.user?.orgRole === 'Admin';
  const visibleTabs = isAdmin ? QueryHeaderTabs : QueryHeaderTabs.filter((t) => t.value !== EditorMode.SQL);

  return (
    <div style={{ display: 'flex', marginTop: '10px' }}>
      <RadioButtonGroup
        size="sm"
        options={visibleTabs}
        value={editorMode}
        onChange={(e: EditorMode) => onEditorModeChange(e!)}
      />
      {!isAnnotationView ? (
        <Button variant="primary" icon="play" size={'sm'} style={{ marginLeft: '10px' }} onClick={onTriggerQuery}>
          Run Query
        </Button>
      ) : null}
      {editorMode === EditorMode.Builder && differences.length ? (
        <Button
          variant="primary"
          size={'sm'}
          icon="sync"
          style={{ marginLeft: '10px' }}
          onClick={() => setModalOpen(true)}
        >
          Override settings
        </Button>
      ) : null}
      {hasAutocompleteError && editorMode === EditorMode.SQL && (
        <div style={{ marginLeft: '10px', display: 'flex', alignItems: 'center' }}>
          <Badge 
            text="Autocomplete unavailable - insufficient permissions to access system tables"
            color="red"
            icon="exclamation-triangle"
          />
        </div>
      )}
      <Modal
        title={'Confirmation'}
        isOpen={modalOpen}
        onClickBackdrop={() => setModalOpen(false)}
        onDismiss={() => setModalOpen(false)}
      >
        <div>
          <p>Configuration will be reset to default values defined in datasource configuration</p>
          {differences.map((item) => (
            <Label
              style={{ fontSize: '16px' }}
              key={item.key}
              description={
                <p>
                  {item.original} → {item.updated}
                </p>
              }
            >
              {item.key}
            </Label>
          ))}
        </div>
        <Modal.ButtonRow>
          <Button variant="secondary" onClick={() => setModalOpen(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={onConfirm}>
            Confirm
          </Button>
        </Modal.ButtonRow>
      </Modal>
    </div>
  );
};
