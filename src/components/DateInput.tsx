import { ChangeEvent } from 'react'

interface DateInputProps {
  id: string
  value: string
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  placeholder: string
  label: string
}

const DateInput = ({ id, value, onChange, placeholder, label }: DateInputProps) => {
  return (
    <div>
      <label htmlFor={id} className='block text-sm font-medium text-gray-700 mb-1'>
        {label}
      </label>
      <input
        id={id}
        type='date'
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className='w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out text-sm'
      />
    </div>
  )
}

export default DateInput
