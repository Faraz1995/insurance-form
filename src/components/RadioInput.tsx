import { ChangeEvent } from 'react'

interface RadioInputProps {
  id: string
  value: string
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  label: string
  options: { value: string; label: string }[]
  required?: boolean
  name: string
}

const RadioInput = ({
  id,
  value,
  onChange,
  label,
  options,
  required,
  name
}: RadioInputProps) => {
  return (
    <div>
      <label className='block text-sm font-medium text-gray-700 mb-1'>{label}</label>
      <div className='space-y-2'>
        {options.map((option) => (
          <div key={option.value} className='flex items-center'>
            <input
              id={`${id}-${option.value}`}
              type='radio'
              name={name}
              value={option.value}
              checked={value === option.value}
              required={required}
              onChange={onChange}
              className='w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500'
            />
            <label
              htmlFor={`${id}-${option.value}`}
              className='ml-2 block text-sm text-gray-700'
            >
              {option.label}
            </label>
          </div>
        ))}
      </div>
    </div>
  )
}

export default RadioInput
