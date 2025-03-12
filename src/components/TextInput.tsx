import { ChangeEvent } from 'react'

interface InputFieldProps {
  id: string
  value: string
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  placeholder: string
  label: string
}

const TextInput = ({ id, value, onChange, placeholder, label }: InputFieldProps) => {
  return (
    <div>
      <label htmlFor={id} className='block text-sm font-medium text-gray-700 mb-1'>
        {label}
      </label>
      <input
        id={id}
        type='text'
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className='w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out text-sm'
      />
    </div>
  )
}

export default TextInput
