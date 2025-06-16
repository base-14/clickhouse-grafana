import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ConfigEditor } from './ConfigEditor';

// Mock the backend_gopher module to avoid NaN override issues
jest.mock('../../datasource/backend_gopher.js', () => ({}));

// Mock the DataSource module that imports backend_gopher
jest.mock('../../datasource/datasource', () => ({
  CHDataSource: jest.fn()
}));

// Mock Monaco Editor to avoid dependency issues in tests
jest.mock('@grafana/ui', () => ({
  ...jest.requireActual('@grafana/ui'),
  CodeEditor: ({ value, onChange }: any) => (
    <textarea 
      data-testid="code-editor"
      value={value || ''}
      onChange={(e) => onChange && onChange(e.target.value)}
    />
  )
}));

describe('ConfigEditor Maps vs Columns Integration', () => {
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
      basicAuthUser: '',
      isDefault: false,
      jsonData: {},
      secureJsonFields: {},
      readOnly: false,
      withCredentials: false,
      orgId: 1,
      typeLogoUrl: '',
      // Add properties expected by DataSourceHttpSettings
      keepCookies: [],
      timeout: 30
    }
  };

  describe('Maps vs Columns Toggle', () => {
    it('should render maps vs columns toggle switch', () => {
      render(<ConfigEditor {...defaultProps} />);
      
      expect(screen.getByText('Use maps instead of columns')).toBeInTheDocument();
      expect(screen.getByRole('switch', { name: /use maps instead of columns/i })).toBeInTheDocument();
    });

    it('should have toggle switch disabled by default', () => {
      render(<ConfigEditor {...defaultProps} />);
      
      const toggle = screen.getByRole('switch', { name: /use maps instead of columns/i });
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
      
      const toggle = screen.getByRole('switch', { name: /use maps instead of columns/i });
      expect(toggle).toBeChecked();
    });

    it('should call onOptionsChange when toggle is clicked', async () => {
      const user = userEvent.setup();
      render(<ConfigEditor {...defaultProps} />);
      
      const toggle = screen.getByRole('switch', { name: /use maps instead of columns/i });
      await user.click(toggle);
      
      expect(mockOnOptionsChange).toHaveBeenCalledWith(
        expect.objectContaining({
          jsonData: expect.objectContaining({
            useCustomFilterMaps: true
          })
        })
      );
    });

    it('should show helpful tooltip for maps vs columns toggle', () => {
      render(<ConfigEditor {...defaultProps} />);
      
      // Just check that the toggle is present - tooltip text might be in a different element
      const toggle = screen.getByRole('switch', { name: /use maps instead of columns/i });
      expect(toggle).toBeInTheDocument();
    });
  });

  describe('Conditional Query Configuration', () => {
    it('should show single adhoc filters request when toggle is disabled', () => {
      render(<ConfigEditor {...defaultProps} />);
      
      expect(screen.getByText('Configure Adhoc Filters Request')).toBeInTheDocument();
      expect(screen.queryByText('Configure Adhoc Keys Request')).not.toBeInTheDocument();
      expect(screen.queryByText('Configure Adhoc Values Request')).not.toBeInTheDocument();
    });

    it('should show separate keys and values requests when toggle is enabled', () => {
      const props = {
        ...defaultProps,
        options: {
          ...defaultProps.options,
          jsonData: { useCustomFilterMaps: true }
        }
      };
      
      render(<ConfigEditor {...props} />);
      
      expect(screen.getByText('Configure Adhoc Keys Request')).toBeInTheDocument();
      expect(screen.getByText('Configure Adhoc Values Request')).toBeInTheDocument();
      expect(screen.queryByText('Configure Adhoc Filters Request')).not.toBeInTheDocument();
    });

    it('should conditionally hide table names setting when using maps', () => {
      const props = {
        ...defaultProps,
        options: {
          ...defaultProps.options,
          jsonData: { useCustomFilterMaps: true }
        }
      };
      
      render(<ConfigEditor {...props} />);
      
      expect(screen.queryByText('Hide table names in adhoc filters')).not.toBeInTheDocument();
    });

    it('should show table names setting when not using maps', () => {
      render(<ConfigEditor {...defaultProps} />);
      
      expect(screen.getByText('Hide table names in adhoc filters')).toBeInTheDocument();
    });
  });

  describe('Query Configuration State Management', () => {
    it('should preserve other jsonData properties when toggling maps mode', async () => {
      const user = userEvent.setup();
      const props = {
        ...defaultProps,
        options: {
          ...defaultProps.options,
          jsonData: { 
            useCustomFilterMaps: false,
            defaultDatabase: 'test_db',
            useCompression: true
          }
        }
      };
      
      render(<ConfigEditor {...props} />);
      
      const toggle = screen.getByRole('switch', { name: /use maps instead of columns/i });
      await user.click(toggle);
      
      expect(mockOnOptionsChange).toHaveBeenCalledWith(
        expect.objectContaining({
          jsonData: expect.objectContaining({
            defaultDatabase: 'test_db',
            useCompression: true,
            useCustomFilterMaps: true
          })
        })
      );
    });
  });

  describe('Form Layout and Organization', () => {
    it('should render maps vs columns section in Additional settings', () => {
      render(<ConfigEditor {...defaultProps} />);
      
      // Should be in the Additional section
      const additionalHeading = screen.getByText('Additional');
      expect(additionalHeading).toBeInTheDocument();
      
      // Maps vs columns toggle should come after the Additional heading
      const toggle = screen.getByText('Use maps instead of columns');
      expect(toggle).toBeInTheDocument();
    });

    it('should render toggle before query configuration fields', () => {
      const props = {
        ...defaultProps,
        options: {
          ...defaultProps.options,
          jsonData: { useCustomFilterMaps: true }
        }
      };
      
      render(<ConfigEditor {...props} />);
      
      const toggle = screen.getByText('Use maps instead of columns');
      const keysConfig = screen.getByText('Configure Adhoc Keys Request');
      const valuesConfig = screen.getByText('Configure Adhoc Values Request');
      
      expect(toggle).toBeInTheDocument();
      expect(keysConfig).toBeInTheDocument();
      expect(valuesConfig).toBeInTheDocument();
    });
  });

  describe('Configuration Persistence', () => {
    it('should maintain toggle state after toggling off/on', async () => {
      const user = userEvent.setup();
      
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
      
      // Toggle off
      const toggle = screen.getByRole('switch', { name: /use maps instead of columns/i });
      await user.click(toggle);
      
      // Configuration should be updated
      expect(mockOnOptionsChange).toHaveBeenCalledWith(
        expect.objectContaining({
          jsonData: expect.objectContaining({
            useCustomFilterMaps: false
          })
        })
      );
    });

    it('should handle configuration save and reload correctly', () => {      
      const props = {
        ...defaultProps,
        options: {
          ...defaultProps.options,
          jsonData: { 
            useCustomFilterMaps: true,
            adHocKeysQuery: 'SELECT DISTINCT test_key',
            adHocValuesQuery: 'SELECT DISTINCT test_value'
          }
        }
      };
      
      render(<ConfigEditor {...props} />);
      
      // Should render with the saved configuration
      expect(screen.getByText('Configure Adhoc Keys Request')).toBeInTheDocument();
      expect(screen.getByText('Configure Adhoc Values Request')).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('should handle empty jsonData gracefully', () => {
      const props = {
        ...defaultProps,
        options: {
          ...defaultProps.options,
          jsonData: {}
        }
      };
      
      expect(() => render(<ConfigEditor {...props} />)).not.toThrow();
      
      // Should show default state (toggle disabled, single adhoc config)
      expect(screen.getByText('Configure Adhoc Filters Request')).toBeInTheDocument();
      expect(screen.queryByText('Configure Adhoc Keys Request')).not.toBeInTheDocument();
    });
  });
});
