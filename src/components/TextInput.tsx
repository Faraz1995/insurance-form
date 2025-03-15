import { ChangeEvent } from 'react'

interface InputFieldProps {
  id: string
  value: string
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  placeholder: string
  label: string
  required?: boolean
  name: string
}

const TextInput = ({
  id,
  value,
  onChange,
  placeholder,
  label,
  required,
  name
}: InputFieldProps) => {
  return (
    <div>
      <label
        htmlFor={id}
        className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
      >
        {label}
      </label>
      <input
        id={id}
        type='text'
        value={value}
        name={name}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className='w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm dark:shadow-gray-900/20 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 transition duration-150 ease-in-out text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500'
      />
    </div>
  )
}

export default TextInput
