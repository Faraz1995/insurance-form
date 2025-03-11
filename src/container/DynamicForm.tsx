// src/components/DynamicForm.tsx
import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react'
import axiosInstance from '../util/axiosInstance'

interface FieldCondition {
  field: string
  value: any
}

interface FieldOption {
  value: string
  label: string
}

export interface FormField {
  name: string
  type: string
  label: string
  condition?: FieldCondition
  fields?: FormField[]
  options?: FieldOption[]
}

export interface FormStructure {
  title: string
  fields: FormField[]
}

interface FormData {
  [key: string]: any
}

const DynamicForm: React.FC = () => {
  const [formStructure, setFormStructure] = useState<FormField[]>([])
  const [formData, setFormData] = useState<FormData>({})

  // Fetch form structure from API when component mounts.
  useEffect(() => {
    axiosInstance
      .get<FormStructure>('/api/insurance/forms')
      .then((response) => setFormStructure(response.data))
      .catch((err) => console.error('Error fetching form structure', err))
  }, [])

  const handleChange = (fieldName: string, value: any) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }))
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // You can add validation logic here before submission.
    axiosInstance
      .post('/api/insurance/forms/submit', formData)
      .then((response) => {
        console.log('Form submitted successfully', response.data)
        // Optionally clear the form or show a success message.
      })
      .catch((err) => console.error('Error submitting form', err))
  }

  // Recursive function to render fields (supports nested fields and conditional logic).
  const renderField = (field: FormField) => {
    // Check conditional logic.
    if (field.condition) {
      const conditionValue = formData[field.condition.field]
      if (conditionValue !== field.condition.value) {
        return null
      }
    }

    // Render nested fields if present.
    if (field.fields && Array.isArray(field.fields)) {
      return (
        <fieldset key={field.name} style={{ marginBottom: '1rem' }}>
          <legend>{field.label}</legend>
          {field.fields.map((subField) => renderField(subField))}
        </fieldset>
      )
    }

    // Render fields based on their type.
    switch (field.type) {
      case 'text':
      case 'number':
        return (
          <div key={field.name} style={{ marginBottom: '1rem' }}>
            <label htmlFor={field.name}>{field.label}</label>
            <input
              id={field.name}
              type={field.type}
              name={field.name}
              value={formData[field.name] || ''}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                handleChange(field.name, e.target.value)
              }
            />
          </div>
        )
      case 'select':
        return (
          <div key={field.name} style={{ marginBottom: '1rem' }}>
            <label htmlFor={field.name}>{field.label}</label>
            <select
              id={field.name}
              name={field.name}
              value={formData[field.name] || ''}
              onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                handleChange(field.name, e.target.value)
              }
            >
              <option value=''>Select</option>
              {field.options &&
                field.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
            </select>
          </div>
        )
      // Additional field types (e.g., checkbox, radio) can be added here.
      default:
        return null
    }
  }

  if (!formStructure) return <div>Loading form...</div>
  console.log(formStructure)
  return (
    <form onSubmit={handleSubmit}>
      <h2 className='text-red-700'>{formStructure.title}</h2>
      {formStructure.map((field) => renderField(field))}
      <button type='submit'>Submit Application</button>
    </form>
  )
}

export default DynamicForm
