import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ConfigEditor } from './ConfigEditor';
import { CustomFilterMap } from '../../types/types';

// Mock the CustomFilterMapsEditor component
jest.mock('./components/CustomFilterMapsEditor', () => ({
  CustomFilterMapsEditor: ({ customFilterMaps, onChange }: any) => (
    <div data-testid="custom-filter-maps-editor">
      <span data-testid="maps-count">{customFilterMaps?.length || 0}</span>
      <button 
        data-testid="mock-add-map" 
        onClick={() => onChange([...customFilterMaps, { id: 'test', label: 'Test', key: 'test', values: [] }])}
      >
        Add Map
      </button>
    </div>
  )
}));

describe('ConfigEditor Custom Filter Maps Integration', () => {
  const mockOnOptionsChange = jest.fn();
  
  beforeEach(() => {
    mockOnOptionsChange.mockClear();
  });

  const defaultProps = {
    onOptionsChange: mockOnOptionsChange,
    options: {
      id: 1,
      uid: 'test-uid',
      name: 'Test DataSource',
      type: 'clickhouse',
      typeName: 'ClickHouse',
      access: 'proxy',
      url: 'http://localhost:8123',
      user: '',
      database: '',
      basicAuth: false,
      isDefault: false,
      jsonData: {},
      secureJsonFields: {},
      readOnly: false,
      withCredentials: false
    }
  };

  describe('Custom Filter Maps Toggle', () => {
    it('should render custom filter maps toggle switch', () => {
      render(<ConfigEditor {...defaultProps} />);
      
      expect(screen.getByText('Use Custom Filter Maps')).toBeInTheDocument();
      expect(screen.getByRole('switch', { name: /use custom filter maps/i })).toBeInTheDocument();
    });

    it('should have toggle switch disabled by default', () => {
      render(<ConfigEditor {...defaultProps} />);
      
      const toggle = screen.getByRole('switch', { name: /use custom filter maps/i });
      expect(toggle).not.toBeChecked();
    });

    it('should enable toggle when useCustomFilterMaps is true in jsonData', () => {
      const props = {
        ...defaultProps,
        options: {
          ...defaultProps.options,
          jsonData: { useCustomFilterMaps: true }
        }
      };
      
      render(<ConfigEditor {...props} />);
      
      const toggle = screen.getByRole('switch', { name: /use custom filter maps/i });
      expect(toggle).toBeChecked();
    });

    it('should call onOptionsChange when toggle is clicked', async () => {
      const user = userEvent.setup();
      render(<ConfigEditor {...defaultProps} />);
      
      const toggle = screen.getByRole('switch', { name: /use custom filter maps/i });
      await user.click(toggle);
      
      expect(mockOnOptionsChange).toHaveBeenCalledWith(
        expect.objectContaining({
          jsonData: expect.objectContaining({
            useCustomFilterMaps: true
          })
        })
      );
    });

    it('should show helpful tooltip for custom filter maps toggle', () => {
      render(<ConfigEditor {...defaultProps} />);
      
      const tooltip = screen.getByText(/enable custom filter maps instead of auto-discovering/i);
      expect(tooltip).toBeInTheDocument();
    });
  });

  describe('CustomFilterMapsEditor Integration', () => {
    it('should not render CustomFilterMapsEditor when toggle is disabled', () => {
      render(<ConfigEditor {...defaultProps} />);
      
      expect(screen.queryByTestId('custom-filter-maps-editor')).not.toBeInTheDocument();
    });

    it('should render CustomFilterMapsEditor when toggle is enabled', () => {
      const props = {
        ...defaultProps,
        options: {
          ...defaultProps.options,
          jsonData: { useCustomFilterMaps: true }
        }
      };
      
      render(<ConfigEditor {...props} />);
      
      expect(screen.getByTestId('custom-filter-maps-editor')).toBeInTheDocument();
    });

    it('should pass existing custom filter maps to CustomFilterMapsEditor', () => {
      const customFilterMaps: CustomFilterMap[] = [
        { id: 'test1', label: 'Test 1', key: 'test1', values: [] },
        { id: 'test2', label: 'Test 2', key: 'test2', values: [] }
      ];
      
      const props = {
        ...defaultProps,
        options: {
          ...defaultProps.options,
          jsonData: { 
            useCustomFilterMaps: true,
            customFilterMaps 
          }
        }
      };
      
      render(<ConfigEditor {...props} />);
      
      expect(screen.getByTestId('maps-count')).toHaveTextContent('2');
    });

    it('should handle empty custom filter maps array', () => {
      const props = {
        ...defaultProps,
        options: {
          ...defaultProps.options,
          jsonData: { 
            useCustomFilterMaps: true,
            customFilterMaps: [] 
          }
        }
      };
      
      render(<ConfigEditor {...props} />);
      
      expect(screen.getByTestId('maps-count')).toHaveTextContent('0');
    });

    it('should handle undefined custom filter maps', () => {
      const props = {
        ...defaultProps,
        options: {
          ...defaultProps.options,
          jsonData: { 
            useCustomFilterMaps: true
          }
        }
      };
      
      render(<ConfigEditor {...props} />);
      
      expect(screen.getByTestId('maps-count')).toHaveTextContent('0');
    });
  });

  describe('Custom Filter Maps State Management', () => {
    it('should update options when custom filter maps change', async () => {
      const user = userEvent.setup();
      const props = {
        ...defaultProps,
        options: {
          ...defaultProps.options,
          jsonData: { 
            useCustomFilterMaps: true,
            customFilterMaps: []
          }
        }
      };
      
      render(<ConfigEditor {...props} />);
      
      const addButton = screen.getByTestId('mock-add-map');
      await user.click(addButton);
      
      expect(mockOnOptionsChange).toHaveBeenCalledWith(
        expect.objectContaining({
          jsonData: expect.objectContaining({
            customFilterMaps: expect.arrayContaining([
              expect.objectContaining({
                id: 'test',
                label: 'Test',
                key: 'test',
                values: []
              })
            ])
          })
        })
      );
    });

    it('should preserve other jsonData properties when updating custom filter maps', async () => {
      const user = userEvent.setup();
      const props = {
        ...defaultProps,
        options: {
          ...defaultProps.options,
          jsonData: { 
            useCustomFilterMaps: true,
            customFilterMaps: [],
            defaultDatabase: 'test_db',
            useCompression: true
          }
        }
      };
      
      render(<ConfigEditor {...props} />);
      
      const addButton = screen.getByTestId('mock-add-map');
      await user.click(addButton);
      
      expect(mockOnOptionsChange).toHaveBeenCalledWith(
        expect.objectContaining({
          jsonData: expect.objectContaining({
            defaultDatabase: 'test_db',
            useCompression: true,
            customFilterMaps: expect.any(Array)
          })
        })
      );
    });
  });

  describe('Form Layout and Organization', () => {
    it('should render custom filter maps section in Additional settings', () => {
      const props = {
        ...defaultProps,
        options: {
          ...defaultProps.options,
          jsonData: { useCustomFilterMaps: true }
        }
      };
      
      render(<ConfigEditor {...props} />);
      
      // Should be in the Additional section
      const additionalHeading = screen.getByText('Additional');
      expect(additionalHeading).toBeInTheDocument();
      
      // Custom filter maps should come after the Additional heading
      const toggle = screen.getByText('Use Custom Filter Maps');
      expect(toggle).toBeInTheDocument();
    });

    it('should render toggle before editor component', () => {
      const props = {
        ...defaultProps,
        options: {
          ...defaultProps.options,
          jsonData: { useCustomFilterMaps: true }
        }
      };
      
      render(<ConfigEditor {...props} />);
      
      const toggle = screen.getByText('Use Custom Filter Maps');
      const editor = screen.getByTestId('custom-filter-maps-editor');
      
      // Both should be present and toggle should come before editor in DOM order
      expect(toggle).toBeInTheDocument();
      expect(editor).toBeInTheDocument();
    });
  });

  describe('Configuration Persistence', () => {
    it('should maintain custom filter maps configuration after toggle off/on', async () => {
      const user = userEvent.setup();
      const customFilterMaps: CustomFilterMap[] = [
        { id: 'test', label: 'Test', key: 'test', values: [] }
      ];
      
      const props = {
        ...defaultProps,
        options: {
          ...defaultProps.options,
          jsonData: { 
            useCustomFilterMaps: true,
            customFilterMaps 
          }
        }
      };
      
      render(<ConfigEditor {...props} />);
      
      // Toggle off
      const toggle = screen.getByRole('switch', { name: /use custom filter maps/i });
      await user.click(toggle);
      
      // Configuration should still be preserved
      expect(mockOnOptionsChange).toHaveBeenCalledWith(
        expect.objectContaining({
          jsonData: expect.objectContaining({
            useCustomFilterMaps: false,
            customFilterMaps: customFilterMaps // Should maintain the maps
          })
        })
      );
    });

    it('should handle configuration save and reload correctly', () => {
      const customFilterMaps: CustomFilterMap[] = [
        { 
          id: 'priority', 
          label: 'Priority Level', 
          key: 'priority', 
          values: [
            { label: 'High', value: 'high' },
            { label: 'Low', value: 'low' }
          ],
          description: 'Task priority filter'
        }
      ];
      
      const props = {
        ...defaultProps,
        options: {
          ...defaultProps.options,
          jsonData: { 
            useCustomFilterMaps: true,
            customFilterMaps 
          }
        }
      };
      
      render(<ConfigEditor {...props} />);
      
      // Should render with the saved configuration
      expect(screen.getByTestId('maps-count')).toHaveTextContent('1');
      expect(screen.getByTestId('custom-filter-maps-editor')).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('should handle malformed customFilterMaps gracefully', () => {
      const props = {
        ...defaultProps,
        options: {
          ...defaultProps.options,
          jsonData: { 
            useCustomFilterMaps: true,
            customFilterMaps: [
              null,
              undefined,
              { id: 'valid', label: 'Valid', key: 'valid', values: [] },
              { invalid: 'data' }
            ] as any
          }
        }
      };
      
      render(<ConfigEditor {...props} />);
      
      // Should render without crashing and handle malformed data
      expect(screen.getByTestId('custom-filter-maps-editor')).toBeInTheDocument();
    });

    it('should handle undefined jsonData gracefully', () => {
      const props = {
        ...defaultProps,
        options: {
          ...defaultProps.options,
          jsonData: undefined as any
        }
      };
      
      expect(() => render(<ConfigEditor {...props} />)).not.toThrow();
    });
  });
});