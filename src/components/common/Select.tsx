import React, { forwardRef, Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { ChevronUpDownIcon, CheckIcon } from '@heroicons/react/20/solid';
import { cn } from '@/lib/utils';

interface Option {
  value: string | number;
  label: string;
  disabled?: boolean;
  description?: string;
}

interface SelectProps {
  label?: string;
  error?: string;
  helperText?: string;
  placeholder?: string;
  options: Option[];
  value?: string | number;
  onChange?: (value: string | number) => void;
  disabled?: boolean;
  required?: boolean;
  fullWidth?: boolean;
  multiple?: boolean;
  searchable?: boolean;
  clearable?: boolean;
  className?: string;
}

const Select = forwardRef<HTMLButtonElement, SelectProps>(({
  label,
  error,
  helperText,
  placeholder = 'Seleccione una opción',
  options = [],
  value,
  onChange,
  disabled = false,
  required = false,
  fullWidth = false,
  multiple = false,
  searchable = false,
  clearable = false,
  className,
}, ref) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  
  const filteredOptions = React.useMemo(() => {
    if (!searchable || !searchQuery) return options;
    
    return options.filter(option =>
      option.label.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [options, searchQuery, searchable]);

  const selectedOption = options.find(option => option.value === value);
  const selectedOptions = multiple && Array.isArray(value) 
    ? options.filter(option => value.includes(option.value))
    : [];

  const handleChange = (newValue: string | number | (string | number)[]) => {
    onChange?.(newValue as any);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange?.(multiple ? [] as any : '' as any); // Forzar el tipo
  };

  return (
    <div className={cn('flex flex-col space-y-1', { 'w-full': fullWidth })}>
      {label && (
        <label className="block text-sm font-medium text-neutral-700">
          {label}
          {required && <span className="text-error-500 ml-1">*</span>}
        </label>
      )}

      <Listbox
        value={value}
        onChange={handleChange}
        disabled={disabled}
        multiple={multiple}
      >
        <div className="relative">
          <Listbox.Button
            ref={ref}
            className={cn(
              'input-primary w-full cursor-default text-left focus:outline-none',
              {
                'border-error-300 focus:border-error-500 focus:ring-error-500': error,
                'opacity-50 cursor-not-allowed': disabled,
                'pr-16': clearable && (value || (multiple && Array.isArray(value) && value.length > 0)),
                'pr-10': !clearable,
              },
              className
            )}
          >
            <span className="block truncate">
              {multiple && Array.isArray(value) && value.length > 0 ? (
                <span className="flex flex-wrap gap-1">
                  {selectedOptions.slice(0, 2).map(option => (
                    <span
                      key={option.value}
                      className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary-100 text-primary-800"
                    >
                      {option.label}
                    </span>
                  ))}
                  {selectedOptions.length > 2 && (
                    <span className="text-xs text-neutral-500">
                      +{selectedOptions.length - 2} más
                    </span>
                  )}
                </span>
              ) : selectedOption ? (
                selectedOption.label
              ) : (
                <span className="text-neutral-400">{placeholder}</span>
              )}
            </span>
            
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              {clearable && (value || (multiple && Array.isArray(value) && value.length > 0)) && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="pointer-events-auto mr-2 text-neutral-400 hover:text-neutral-600"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
              <ChevronUpDownIcon
                className="h-5 w-5 text-neutral-400"
                aria-hidden="true"
              />
            </span>
          </Listbox.Button>

          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
             <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {searchable && (
                <div className="px-3 py-2">
                  <input
                    type="text"
                    placeholder="Buscar..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full border-0 p-0 text-neutral-900 placeholder-neutral-500 focus:ring-0 sm:text-sm"
                  />
                </div>
              )}
              
              {filteredOptions.length === 0 ? (
                <div className="relative cursor-default select-none py-2 px-4 text-neutral-700">
                  {searchable && searchQuery ? 'No se encontraron resultados' : 'No hay opciones disponibles'}
                </div>
              ) : (
                filteredOptions.map((option) => (
                  <Listbox.Option
                    key={option.value}
                    className={({ active }) =>
                      cn(
                        'relative cursor-default select-none py-2 pl-10 pr-4',
                        {
                          'bg-primary-100 text-primary-900': active,
                          'text-neutral-900': !active,
                          'opacity-50 cursor-not-allowed': option.disabled,
                        }
                      )
                    }
                    value={option.value}
                    disabled={option.disabled || false}
                  >
                    {({ selected }) => (
                      <>
                        <div className="flex flex-col">
                          <span
                            className={cn(
                              'block truncate',
                              selected ? 'font-medium' : 'font-normal'
                            )}
                          >
                            {option.label}
                          </span>
                          {option.description && (
                            <span className="text-xs text-neutral-500">
                              {option.description}
                            </span>
                          )}
                        </div>
                        {selected ? (
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary-600">
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))
              )}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>

      {(error || helperText) && (
        <div className="text-sm">
          {error ? (
            <span className="text-error-600 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </span>
          ) : (
            <span className="text-neutral-500">{helperText}</span>
          )}
        </div>
      )}
    </div>
  );
});

Select.displayName = 'Select';

// Componente Select nativo más simple
interface NativeSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: Option[];
  placeholder?: string;
  fullWidth?: boolean;
  required?: boolean;
}

export const NativeSelect = forwardRef<HTMLSelectElement, NativeSelectProps>(({
  label,
  error,
  helperText,
  options,
  placeholder,
  fullWidth = false,
  required = false,
  className,
  id,
  ...props
}, ref) => {
  const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className={cn('flex flex-col space-y-1', { 'w-full': fullWidth })}>
      {label && (
        <label 
          htmlFor={selectId}
          className="block text-sm font-medium text-neutral-700"
        >
          {label}
          {required && <span className="text-error-500 ml-1">*</span>}
        </label>
      )}

      <select
        ref={ref}
        id={selectId}
        className={cn(
          'input-primary',
          {
            'w-full': fullWidth,
            'border-error-300 focus:border-error-500 focus:ring-error-500': error,
          },
          className
        )}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>

      {(error || helperText) && (
        <div className="text-sm">
          {error ? (
            <span className="text-error-600 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </span>
          ) : (
            <span className="text-neutral-500">{helperText}</span>
          )}
        </div>
      )}
    </div>
  );
});

NativeSelect.displayName = 'NativeSelect';

export default Select;