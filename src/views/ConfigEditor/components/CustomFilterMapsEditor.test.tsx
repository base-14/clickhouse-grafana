import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CustomFilterMapsEditor } from './CustomFilterMapsEditor';
import { CustomFilterMap } from '../../../types/types';

describe('CustomFilterMapsEditor', () => {
  const mockOnChange = jest.fn();
  
  beforeEach(() => {
    mockOnChange.mockClear();
  });

  const defaultProps = {
    customFilterMaps: [],
    onChange: mockOnChange
  };

  describe('Basic rendering', () => {
    it('should render empty state correctly', () => {
      render(<CustomFilterMapsEditor {...defaultProps} />);
      
      expect(screen.getByText('Custom Filter Maps')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /add filter map/i })).toBeInTheDocument();
      expect(screen.getByText('No custom filter maps configured')).toBeInTheDocument();
    });

    it('should render existing filter maps correctly', () => {
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

      render(<CustomFilterMapsEditor customFilterMaps={customFilterMaps} onChange={mockOnChange} />);
      
      expect(screen.getByDisplayValue('Priority Level')).toBeInTheDocument();
      expect(screen.getByDisplayValue('priority')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Task priority filter')).toBeInTheDocument();
    });

    it('should render multiple filter maps', () => {
      const customFilterMaps: CustomFilterMap[] = [
        {
          id: 'priority',
          label: 'Priority',
          key: 'priority',
          values: []
        },
        {
          id: 'status',
          label: 'Status',
          key: 'status',
          values: []
        }
      ];

      render(<CustomFilterMapsEditor customFilterMaps={customFilterMaps} onChange={mockOnChange} />);
      
      expect(screen.getByDisplayValue('Priority')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Status')).toBeInTheDocument();
    });
  });

  describe('Adding filter maps', () => {
    it('should add a new empty filter map when add button is clicked', async () => {
      const user = userEvent.setup();
      render(<CustomFilterMapsEditor {...defaultProps} />);
      
      const addButton = screen.getByRole('button', { name: /add filter map/i });
      await user.click(addButton);
      
      expect(mockOnChange).toHaveBeenCalledWith([
        expect.objectContaining({
          id: expect.any(String),
          label: '',
          key: '',
          values: [],
          description: ''
        })
      ]);
    });

    it('should generate unique IDs for new filter maps', async () => {
      const user = userEvent.setup();
      render(<CustomFilterMapsEditor {...defaultProps} />);
      
      const addButton = screen.getByRole('button', { name: /add filter map/i });
      await user.click(addButton);
      await user.click(addButton);
      
      expect(mockOnChange).toHaveBeenCalledTimes(2);
      
      const firstCall = mockOnChange.mock.calls[0][0];
      const secondCall = mockOnChange.mock.calls[1][0];
      
      expect(firstCall[0].id).not.toBe(secondCall[1].id);
    });
  });

  describe('Editing filter maps', () => {
    it('should update label when input changes', async () => {
      const user = userEvent.setup();
      const customFilterMaps: CustomFilterMap[] = [
        {
          id: 'test',
          label: 'Old Label',
          key: 'test_key',
          values: []
        }
      ];

      render(<CustomFilterMapsEditor customFilterMaps={customFilterMaps} onChange={mockOnChange} />);
      
      const labelInput = screen.getByDisplayValue('Old Label');
      await user.clear(labelInput);
      await user.type(labelInput, 'New Label');
      
      expect(mockOnChange).toHaveBeenCalledWith([
        expect.objectContaining({
          id: 'test',
          label: 'New Label',
          key: 'test_key',
          values: []
        })
      ]);
    });

    it('should update key when input changes', async () => {
      const user = userEvent.setup();
      const customFilterMaps: CustomFilterMap[] = [
        {
          id: 'test',
          label: 'Test Label',
          key: 'old_key',
          values: []
        }
      ];

      render(<CustomFilterMapsEditor customFilterMaps={customFilterMaps} onChange={mockOnChange} />);
      
      const keyInput = screen.getByDisplayValue('old_key');
      await user.clear(keyInput);
      await user.type(keyInput, 'new_key');
      
      expect(mockOnChange).toHaveBeenCalledWith([
        expect.objectContaining({
          id: 'test',
          label: 'Test Label',
          key: 'new_key',
          values: []
        })
      ]);
    });

    it('should update description when input changes', async () => {
      const user = userEvent.setup();
      const customFilterMaps: CustomFilterMap[] = [
        {
          id: 'test',
          label: 'Test',
          key: 'test',
          values: [],
          description: 'Old description'
        }
      ];

      render(<CustomFilterMapsEditor customFilterMaps={customFilterMaps} onChange={mockOnChange} />);
      
      const descriptionInput = screen.getByDisplayValue('Old description');
      await user.clear(descriptionInput);
      await user.type(descriptionInput, 'New description');
      
      expect(mockOnChange).toHaveBeenCalledWith([
        expect.objectContaining({
          id: 'test',
          label: 'Test',
          key: 'test',
          values: [],
          description: 'New description'
        })
      ]);
    });
  });

  describe('Filter values integration', () => {
    it('should render CustomFilterValuesEditor for each filter map', () => {
      const customFilterMaps: CustomFilterMap[] = [
        {
          id: 'test',
          label: 'Test',
          key: 'test',
          values: [
            { label: 'Value 1', value: 'val1' },
            { label: 'Value 2', value: 'val2' }
          ]
        }
      ];

      render(<CustomFilterMapsEditor customFilterMaps={customFilterMaps} onChange={mockOnChange} />);
      
      // Should render the filter values section
      expect(screen.getByText('Filter Values')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Value 1')).toBeInTheDocument();
      expect(screen.getByDisplayValue('val1')).toBeInTheDocument();
    });

    it('should update filter map values when CustomFilterValuesEditor changes', async () => {
      const user = userEvent.setup();
      const customFilterMaps: CustomFilterMap[] = [
        {
          id: 'test',
          label: 'Test',
          key: 'test',
          values: [
            { label: 'Existing Value', value: 'existing' }
          ]
        }
      ];

      render(<CustomFilterMapsEditor customFilterMaps={customFilterMaps} onChange={mockOnChange} />);
      
      // Add a new value using the Add Value button
      const addValueButton = screen.getByRole('button', { name: /add value/i });
      await user.click(addValueButton);
      
      expect(mockOnChange).toHaveBeenCalledWith([
        expect.objectContaining({
          id: 'test',
          values: [
            { label: 'Existing Value', value: 'existing' },
            { label: '', value: '' }
          ]
        })
      ]);
    });
  });

  describe('Removing filter maps', () => {
    it('should remove a filter map when remove button is clicked', async () => {
      const user = userEvent.setup();
      const customFilterMaps: CustomFilterMap[] = [
        {
          id: 'keep',
          label: 'Keep This',
          key: 'keep',
          values: []
        },
        {
          id: 'remove',
          label: 'Remove This',
          key: 'remove',
          values: []
        }
      ];

      render(<CustomFilterMapsEditor customFilterMaps={customFilterMaps} onChange={mockOnChange} />);
      
      const removeButtons = screen.getAllByRole('button', { name: /remove filter map/i });
      await user.click(removeButtons[1]);
      
      expect(mockOnChange).toHaveBeenCalledWith([
        expect.objectContaining({
          id: 'keep',
          label: 'Keep This',
          key: 'keep',
          values: []
        })
      ]);
    });

    it('should handle removing all filter maps', async () => {
      const user = userEvent.setup();
      const customFilterMaps: CustomFilterMap[] = [
        {
          id: 'only',
          label: 'Only Map',
          key: 'only',
          values: []
        }
      ];

      render(<CustomFilterMapsEditor customFilterMaps={customFilterMaps} onChange={mockOnChange} />);
      
      const removeButton = screen.getByRole('button', { name: /remove filter map/i });
      await user.click(removeButton);
      
      expect(mockOnChange).toHaveBeenCalledWith([]);
    });
  });

  describe('Form validation', () => {
    it('should show validation errors for empty labels', () => {
      const customFilterMaps: CustomFilterMap[] = [
        {
          id: 'test',
          label: '',
          key: 'valid_key',
          values: []
        }
      ];

      render(<CustomFilterMapsEditor customFilterMaps={customFilterMaps} onChange={mockOnChange} />);
      
      expect(screen.getByText('Label is required')).toBeInTheDocument();
    });

    it('should show validation errors for empty keys', () => {
      const customFilterMaps: CustomFilterMap[] = [
        {
          id: 'test',
          label: 'Valid Label',
          key: '',
          values: []
        }
      ];

      render(<CustomFilterMapsEditor customFilterMaps={customFilterMaps} onChange={mockOnChange} />);
      
      expect(screen.getByText('Field key is required')).toBeInTheDocument();
    });

    it('should show validation errors for duplicate keys', () => {
      const customFilterMaps: CustomFilterMap[] = [
        {
          id: 'test1',
          label: 'Label 1',
          key: 'duplicate_key',
          values: []
        },
        {
          id: 'test2',
          label: 'Label 2',
          key: 'duplicate_key',
          values: []
        }
      ];

      render(<CustomFilterMapsEditor customFilterMaps={customFilterMaps} onChange={mockOnChange} />);
      
      const errorMessages = screen.getAllByText('Field key must be unique');
      expect(errorMessages).toHaveLength(2);
    });

    it('should validate key format', () => {
      const customFilterMaps: CustomFilterMap[] = [
        {
          id: 'test',
          label: 'Test',
          key: 'invalid key with spaces',
          values: []
        }
      ];

      render(<CustomFilterMapsEditor customFilterMaps={customFilterMaps} onChange={mockOnChange} />);
      
      expect(screen.getByText('Field key must be a valid identifier (letters, numbers, underscores)')).toBeInTheDocument();
    });
  });

  describe('Import/Export functionality', () => {
    it('should render import/export buttons', () => {
      render(<CustomFilterMapsEditor {...defaultProps} />);
      
      expect(screen.getByRole('button', { name: /import filter maps/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /export filter maps/i })).toBeInTheDocument();
    });

    it('should handle export when no maps exist', async () => {
      const user = userEvent.setup();
      render(<CustomFilterMapsEditor {...defaultProps} />);
      
      const exportButton = screen.getByRole('button', { name: /export filter maps/i });
      await user.click(exportButton);
      
      // Should show a message about no maps to export
      expect(screen.getByText('No filter maps to export')).toBeInTheDocument();
    });

    it('should handle export with existing maps', async () => {
      const user = userEvent.setup();
      const customFilterMaps: CustomFilterMap[] = [
        {
          id: 'test',
          label: 'Test',
          key: 'test',
          values: [{ label: 'Value', value: 'val' }]
        }
      ];

      // Mock window.URL.createObjectURL and document.createElement
      const mockCreateObjectURL = jest.fn().mockReturnValue('blob:mock-url');
      const mockRevokeObjectURL = jest.fn();
      const mockClick = jest.fn();
      const mockElement = {
        click: mockClick,
        href: '',
        download: '',
        style: { display: '' }
      };

      global.URL.createObjectURL = mockCreateObjectURL;
      global.URL.revokeObjectURL = mockRevokeObjectURL;
      document.createElement = jest.fn().mockReturnValue(mockElement);
      document.body.appendChild = jest.fn();
      document.body.removeChild = jest.fn();

      render(<CustomFilterMapsEditor customFilterMaps={customFilterMaps} onChange={mockOnChange} />);
      
      const exportButton = screen.getByRole('button', { name: /export filter maps/i });
      await user.click(exportButton);
      
      expect(mockCreateObjectURL).toHaveBeenCalled();
      expect(mockClick).toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('should have proper labels for all inputs', () => {
      const customFilterMaps: CustomFilterMap[] = [
        {
          id: 'test',
          label: 'Test',
          key: 'test',
          values: []
        }
      ];

      render(<CustomFilterMapsEditor customFilterMaps={customFilterMaps} onChange={mockOnChange} />);
      
      expect(screen.getByLabelText('Label')).toBeInTheDocument();
      expect(screen.getByLabelText('Field Key')).toBeInTheDocument();
      expect(screen.getByLabelText('Description')).toBeInTheDocument();
    });

    it('should have proper ARIA attributes for buttons', () => {
      render(<CustomFilterMapsEditor {...defaultProps} />);
      
      const addButton = screen.getByRole('button', { name: /add filter map/i });
      expect(addButton).toHaveAttribute('type', 'button');
    });
  });

  describe('Edge cases', () => {
    it('should handle undefined customFilterMaps prop', () => {
      render(<CustomFilterMapsEditor customFilterMaps={undefined as any} onChange={mockOnChange} />);
      
      expect(screen.getByText('No custom filter maps configured')).toBeInTheDocument();
    });

    it('should handle null customFilterMaps prop', () => {
      render(<CustomFilterMapsEditor customFilterMaps={null as any} onChange={mockOnChange} />);
      
      expect(screen.getByText('No custom filter maps configured')).toBeInTheDocument();
    });

    it('should handle special characters in filter map fields', () => {
      const customFilterMaps: CustomFilterMap[] = [
        {
          id: 'special',
          label: 'Special & Characters',
          key: 'special_chars',
          values: [],
          description: 'Description with & special characters'
        }
      ];

      render(<CustomFilterMapsEditor customFilterMaps={customFilterMaps} onChange={mockOnChange} />);
      
      expect(screen.getByDisplayValue('Special & Characters')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Description with & special characters')).toBeInTheDocument();
    });
  });
});