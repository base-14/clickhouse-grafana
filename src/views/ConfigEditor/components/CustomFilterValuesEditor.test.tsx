import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CustomFilterValuesEditor } from './CustomFilterValuesEditor';
import { CustomFilterValue } from '../../../types/types';

describe('CustomFilterValuesEditor', () => {
  const mockOnChange = jest.fn();
  
  beforeEach(() => {
    mockOnChange.mockClear();
  });

  const defaultProps = {
    values: [],
    onChange: mockOnChange
  };

  describe('Basic rendering', () => {
    it('should render empty state correctly', () => {
      render(<CustomFilterValuesEditor {...defaultProps} />);
      
      expect(screen.getByText('Filter Values')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /add value/i })).toBeInTheDocument();
      expect(screen.getByText('No values configured')).toBeInTheDocument();
    });

    it('should render existing values correctly', () => {
      const values: CustomFilterValue[] = [
        { label: 'High Priority', value: 'high' },
        { label: 'Low Priority', value: 'low' }
      ];

      render(<CustomFilterValuesEditor values={values} onChange={mockOnChange} />);
      
      expect(screen.getByDisplayValue('High Priority')).toBeInTheDocument();
      expect(screen.getByDisplayValue('high')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Low Priority')).toBeInTheDocument();
      expect(screen.getByDisplayValue('low')).toBeInTheDocument();
    });

    it('should render correct number of remove buttons', () => {
      const values: CustomFilterValue[] = [
        { label: 'Value 1', value: 'val1' },
        { label: 'Value 2', value: 'val2' }
      ];

      render(<CustomFilterValuesEditor values={values} onChange={mockOnChange} />);
      
      const removeButtons = screen.getAllByRole('button', { name: /remove/i });
      expect(removeButtons).toHaveLength(2);
    });
  });

  describe('Adding values', () => {
    it('should add a new empty value when add button is clicked', async () => {
      const user = userEvent.setup();
      render(<CustomFilterValuesEditor {...defaultProps} />);
      
      const addButton = screen.getByRole('button', { name: /add value/i });
      await user.click(addButton);
      
      expect(mockOnChange).toHaveBeenCalledWith([
        { label: '', value: '' }
      ]);
    });

    it('should add multiple values correctly', async () => {
      const user = userEvent.setup();
      const values: CustomFilterValue[] = [
        { label: 'Existing', value: 'existing' }
      ];

      render(<CustomFilterValuesEditor values={values} onChange={mockOnChange} />);
      
      const addButton = screen.getByRole('button', { name: /add value/i });
      await user.click(addButton);
      
      expect(mockOnChange).toHaveBeenCalledWith([
        { label: 'Existing', value: 'existing' },
        { label: '', value: '' }
      ]);
    });
  });

  describe('Editing values', () => {
    it('should update label when input changes', async () => {
      const user = userEvent.setup();
      const values: CustomFilterValue[] = [
        { label: 'Old Label', value: 'value1' }
      ];

      render(<CustomFilterValuesEditor values={values} onChange={mockOnChange} />);
      
      const labelInput = screen.getByDisplayValue('Old Label');
      await user.clear(labelInput);
      await user.type(labelInput, 'New Label');
      
      expect(mockOnChange).toHaveBeenCalledWith([
        { label: 'New Label', value: 'value1' }
      ]);
    });

    it('should update value when input changes', async () => {
      const user = userEvent.setup();
      const values: CustomFilterValue[] = [
        { label: 'Label', value: 'old_value' }
      ];

      render(<CustomFilterValuesEditor values={values} onChange={mockOnChange} />);
      
      const valueInput = screen.getByDisplayValue('old_value');
      await user.clear(valueInput);
      await user.type(valueInput, 'new_value');
      
      expect(mockOnChange).toHaveBeenCalledWith([
        { label: 'Label', value: 'new_value' }
      ]);
    });

    it('should handle editing multiple values independently', async () => {
      const user = userEvent.setup();
      const values: CustomFilterValue[] = [
        { label: 'Label 1', value: 'value1' },
        { label: 'Label 2', value: 'value2' }
      ];

      render(<CustomFilterValuesEditor values={values} onChange={mockOnChange} />);
      
      const labelInputs = screen.getAllByDisplayValue(/Label/);
      await user.clear(labelInputs[1]);
      await user.type(labelInputs[1], 'Updated Label 2');
      
      expect(mockOnChange).toHaveBeenCalledWith([
        { label: 'Label 1', value: 'value1' },
        { label: 'Updated Label 2', value: 'value2' }
      ]);
    });
  });

  describe('Removing values', () => {
    it('should remove a value when remove button is clicked', async () => {
      const user = userEvent.setup();
      const values: CustomFilterValue[] = [
        { label: 'Value 1', value: 'val1' },
        { label: 'Value 2', value: 'val2' }
      ];

      render(<CustomFilterValuesEditor values={values} onChange={mockOnChange} />);
      
      const removeButtons = screen.getAllByRole('button', { name: /remove/i });
      await user.click(removeButtons[0]);
      
      expect(mockOnChange).toHaveBeenCalledWith([
        { label: 'Value 2', value: 'val2' }
      ]);
    });

    it('should remove the correct value when multiple exist', async () => {
      const user = userEvent.setup();
      const values: CustomFilterValue[] = [
        { label: 'Keep', value: 'keep' },
        { label: 'Remove', value: 'remove' },
        { label: 'Also Keep', value: 'also_keep' }
      ];

      render(<CustomFilterValuesEditor values={values} onChange={mockOnChange} />);
      
      const removeButtons = screen.getAllByRole('button', { name: /remove/i });
      await user.click(removeButtons[1]); // Remove middle item
      
      expect(mockOnChange).toHaveBeenCalledWith([
        { label: 'Keep', value: 'keep' },
        { label: 'Also Keep', value: 'also_keep' }
      ]);
    });

    it('should handle removing all values', async () => {
      const user = userEvent.setup();
      const values: CustomFilterValue[] = [
        { label: 'Only Value', value: 'only' }
      ];

      render(<CustomFilterValuesEditor values={values} onChange={mockOnChange} />);
      
      const removeButton = screen.getByRole('button', { name: /remove/i });
      await user.click(removeButton);
      
      expect(mockOnChange).toHaveBeenCalledWith([]);
    });
  });

  describe('Form validation', () => {
    it('should show validation errors for empty labels', () => {
      const values: CustomFilterValue[] = [
        { label: '', value: 'value1' },
        { label: 'Valid Label', value: 'value2' }
      ];

      render(<CustomFilterValuesEditor values={values} onChange={mockOnChange} />);
      
      expect(screen.getByText('Label is required')).toBeInTheDocument();
    });

    it('should show validation errors for empty values', () => {
      const values: CustomFilterValue[] = [
        { label: 'Valid Label', value: '' },
        { label: 'Another Label', value: 'valid_value' }
      ];

      render(<CustomFilterValuesEditor values={values} onChange={mockOnChange} />);
      
      expect(screen.getByText('Value is required')).toBeInTheDocument();
    });

    it('should show validation errors for duplicate values', () => {
      const values: CustomFilterValue[] = [
        { label: 'Label 1', value: 'duplicate' },
        { label: 'Label 2', value: 'duplicate' }
      ];

      render(<CustomFilterValuesEditor values={values} onChange={mockOnChange} />);
      
      const errorMessages = screen.getAllByText('Value must be unique');
      expect(errorMessages).toHaveLength(2);
    });

    it('should not show errors for valid values', () => {
      const values: CustomFilterValue[] = [
        { label: 'Valid Label 1', value: 'value1' },
        { label: 'Valid Label 2', value: 'value2' }
      ];

      render(<CustomFilterValuesEditor values={values} onChange={mockOnChange} />);
      
      expect(screen.queryByText('Label is required')).not.toBeInTheDocument();
      expect(screen.queryByText('Value is required')).not.toBeInTheDocument();
      expect(screen.queryByText('Value must be unique')).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper labels for inputs', () => {
      const values: CustomFilterValue[] = [
        { label: 'Test', value: 'test' }
      ];

      render(<CustomFilterValuesEditor values={values} onChange={mockOnChange} />);
      
      expect(screen.getByLabelText('Label')).toBeInTheDocument();
      expect(screen.getByLabelText('Value')).toBeInTheDocument();
    });

    it('should have proper ARIA attributes for add button', () => {
      render(<CustomFilterValuesEditor {...defaultProps} />);
      
      const addButton = screen.getByRole('button', { name: /add value/i });
      expect(addButton).toHaveAttribute('type', 'button');
    });

    it('should have proper ARIA attributes for remove buttons', () => {
      const values: CustomFilterValue[] = [
        { label: 'Test', value: 'test' }
      ];

      render(<CustomFilterValuesEditor values={values} onChange={mockOnChange} />);
      
      const removeButton = screen.getByRole('button', { name: /remove/i });
      expect(removeButton).toHaveAttribute('type', 'button');
    });
  });

  describe('Edge cases', () => {
    it('should handle undefined values prop', () => {
      render(<CustomFilterValuesEditor values={undefined as any} onChange={mockOnChange} />);
      
      expect(screen.getByText('No values configured')).toBeInTheDocument();
    });

    it('should handle null values prop', () => {
      render(<CustomFilterValuesEditor values={null as any} onChange={mockOnChange} />);
      
      expect(screen.getByText('No values configured')).toBeInTheDocument();
    });

    it('should handle special characters in values', async () => {
      const user = userEvent.setup();
      const values: CustomFilterValue[] = [
        { label: 'Special & Characters', value: 'special&chars' }
      ];

      render(<CustomFilterValuesEditor values={values} onChange={mockOnChange} />);
      
      expect(screen.getByDisplayValue('Special & Characters')).toBeInTheDocument();
      expect(screen.getByDisplayValue('special&chars')).toBeInTheDocument();
    });
  });
});