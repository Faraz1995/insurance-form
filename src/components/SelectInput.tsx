import { ChangeEvent } from 'react'

interface Option {
  value: string
  label: string
}

interface SelectFieldProps {
  id: string
  label: string
  value: string
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void
  options: Option[]
  required?: boolean
  name: string
}

const SelectInput = ({
  id,
  value,
  onChange,
  options,
  label,
  required,
  name
}: SelectFieldProps) => {
  return (
    <div>
      <label
        htmlFor={id}
        className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
      >
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={onChange}
        required={required}
        name={name}
        className='w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm dark:shadow-gray-900/20 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 transition duration-150 ease-in-out text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100'
      >
        {options.map((option) => (
          <option key={option.value} value={option.value} className='dark:bg-gray-700'>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}

export default SelectInput
