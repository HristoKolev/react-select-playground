import type { JSX } from 'react';
import { useState } from 'react';
import Select from 'react-select';

type CustomOption = { label: string } & (
  | { value: string; selected?: boolean }
  | { options: CustomOption[] }
);

const defaultOptions: CustomOption[] = [
  { label: 'Cat 1', value: 'cat-1' },
  { label: 'Cat 2', value: 'cat-2' },
  {
    label: 'Group 1',
    options: [
      { label: 'Cat 3', value: 'cat-3', selected: true },
      { label: 'Cat 4', value: 'cat-4' },
    ],
  },
];

const getSelected = (options: CustomOption[]): CustomOption[] => {
  const result: CustomOption[] = [];
  const stack = [options];
  while (stack.length) {
    const opt = stack.pop() as CustomOption[];
    for (const element of opt) {
      if ('options' in element) {
        stack.push(element.options);
      } else if (element.selected) {
        result.push(element);
      }
    }
  }
  return result;
};

const selectOption = (options: CustomOption[], value: string) => {
  const stack = [options];
  while (stack.length) {
    const opt = stack.pop() as CustomOption[];
    for (const element of opt) {
      if ('options' in element) {
        stack.push(element.options);
      } else {
        element.selected = element.value === value;
      }
    }
  }
};

export const App = (): JSX.Element => {
  const [options, setOptions] = useState<CustomOption[]>(defaultOptions);
  const value = getSelected(options);

  // eslint-disable-next-line no-console
  console.log('HKOLEV: App.tsx | options', JSON.stringify(options, null, 2));

  return (
    <div className="text text-center">
      <Select
        options={options}
        value={value}
        onChange={(selectedOption) => {
          if (selectedOption && 'value' in selectedOption) {
            const clonedOptions = structuredClone(options);
            selectOption(clonedOptions, selectedOption.value);
            setOptions(clonedOptions);
          }
        }}
      />
    </div>
  );
};
