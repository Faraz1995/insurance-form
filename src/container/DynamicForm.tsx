import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react'
import axiosInstance from '../util/axiosInstance'
import SelectInput from '../components/SelectInput'
import TextInput from '../components/TextInput'
import { evaluateCondition, generateIfCondition } from './utils'

interface FormData {
  [key: string]: string
}

// Represents a visibility condition for a field.
interface VisibilityCondition {
  dependsOn: string
  condition: string
  value: string
}

// Represents dynamic options configuration for a select field.
interface DynamicOptions {
  dependsOn: string
  endpoint: string
  method: string
}

// Base type for all form fields.
interface BaseField {
  id: string
  label: string
  required?: boolean
  // Optional property to control field visibility based on another field.
  visibility?: VisibilityCondition
}

// Field type for groups which can contain nested fields.
interface GroupField extends BaseField {
  type: 'group'
  fields: Field[]
}

// Field type for a simple text input.
interface TextField extends BaseField {
  type: 'text'
}

// Field type for date input.
interface DateField extends BaseField {
  type: 'date'
}

// Field type for select inputs.
// It can have either a fixed list of options or a dynamic options configuration.
interface SelectField extends BaseField {
  type: 'select'
  options?: string[]
  dynamicOptions?: DynamicOptions
}

// Field type for radio inputs.
interface RadioField extends BaseField {
  type: 'radio'
  options: string[]
}

// Union type of all possible field types.
type Field = GroupField | TextField | DateField | SelectField | RadioField

// The main form interface.
type Form = {
  formId: string
  title: string
  fields: Field[]
}

type RenderType = Form | Field

function isField(item: RenderType): item is Field {
  return !('formId' in item)
}

const DynamicForm: React.FC = () => {
  const [formStructure, setFormStructure] = useState<Form[]>([])
  const [formData, setFormData] = useState<FormData>({})

  // Fetch form structure from API when component mounts.
  useEffect(() => {
    axiosInstance({
      method: 'get',
      url: '/api/insurance/forms'
    })
      .then((res) => {
        const arr = [res.data[0]]
        setFormStructure(arr)
      })
      .catch((err) => console.error('Error fetching form structure', err))
  }, [])

  const handleChange = (fieldName: string, value: string) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }))
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // You can add validation logic here before submission.
    axiosInstance({
      method: 'post',
      url: '/api/insurance/forms/submit',
      data: formData
    })
      .then((response) => {
        console.log('Form submitted successfully', response.data)
      })
      .catch((err) => console.error('Error submitting form', err))
  }

  const generateOptions = (options: string[]) => {
    const newOptions = options.map((option) => {
      return {
        value: option,
        label: option
      }
    })
    return [
      {
        value: '',
        label: 'Select an option'
      },
      ...newOptions
    ]
  }

  // Recursive function to render fields (supports nested fields and conditional logic).
  const renderForm = (field: RenderType, index: number) => {
    // Check conditional logic.

    if (isField(field) && field.visibility?.condition) {
      const ifCondition: string = generateIfCondition(field.visibility, formData)
      if (!evaluateCondition(ifCondition, formData)) {
        return null
      }
    }

    if (!isField(field) && field.title) {
      return (
        <div key={field.formId} className='mb-4 p-4 border border-gray-300 rounded-md'>
          <h3 className='font-semibold text-lg mb-2'>{field.title}</h3>
          {field.fields &&
            field.fields.map((subField: Field) => renderForm(subField, index))}
        </div>
      )
    }

    // Render nested fields if present.
    if (
      'fields' in field &&
      'label' in field &&
      field.fields &&
      Array.isArray(field.fields)
    ) {
      return (
        <div
          className={`p-4 ${
            field.fields.length !== index && 'border-b'
          } border-gray-300 `}
        >
          <h3 className='font-semibold text-lg mb-2'>{field.label}</h3>
          {field.fields.map((subField) => renderForm(subField, index))}
        </div>
      )
    }

    // Render fields based on their type.
    if (isField(field)) {
      switch (field.type) {
        case 'text':
          return (
            <div key={field.id} className='mb-4'>
              <TextInput
                id={field.id}
                label={field.label}
                value={formData[field.id || '']}
                placeholder={field.label}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleChange(field.id, e.target.value)
                }
              />
            </div>
          )
        case 'select':
          return (
            <div key={field.id} className='mb-4'>
              <SelectInput
                id={field.id}
                label={field.label}
                value={formData[field.id]}
                onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                  handleChange(field.id, e.target.value)
                }
                options={generateOptions(field.options || [])}
              />
            </div>
          )
        // Additional field types (e.g., checkbox, radio) can be added here.
        default:
          return null
      }
    }
  }

  if (!formStructure) return <div>Loading form...</div>
  console.log('serverrrrrr', formStructure)
  return (
    <form
      onSubmit={handleSubmit}
      className='max-w-2xl mx-auto p-6 bg-white rounded-md shadow-md'
    >
      {formStructure.map((field, index) => (
        <div key={field.formId}>{renderForm(field, index)}</div>
      ))}
      <div className='flex justify-center'>
        <button
          type='submit'
          className='px-6 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600'
        >
          Submit Application
        </button>
      </div>
    </form>
  )
}

export default DynamicForm
