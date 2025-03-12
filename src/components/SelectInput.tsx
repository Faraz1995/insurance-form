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
}

const SelectInput = ({ id, value, onChange, options, label }: SelectFieldProps) => {
  return (
    <div>
      <label htmlFor={id} className='block text-sm font-medium text-gray-700 mb-1'>
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={onChange}
        className='w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out text-sm bg-white'
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}

export default SelectInput
