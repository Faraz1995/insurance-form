import React, { useState, useEffect, ChangeEvent, FormEvent, useRef } from 'react'
import axiosInstance from '../util/axiosInstance'
import SelectInput from '../components/SelectInput'
import TextInput from '../components/TextInput'
import { evaluateCondition, extractDynamicFields, generateIfCondition } from './utils'
import DateInput from '../components/DateInput'
import RadioInput from '../components/RadioInput'
import { toast } from 'react-toastify'
import Loading from '../components/Loading'

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

type RenderType = Form | Field | GroupField

function isField(item: RenderType): item is Field {
  return !('formId' in item)
}

function isGroup(item: RenderType): item is GroupField {
  return 'type' in item && item.type === 'group'
}

const convertOptionsToKeyValueFormat = (options: string[]) => {
  return options?.map((option) => ({ value: option, label: option })) || []
}

const DynamicForm: React.FC = () => {
  const [formStructure, setFormStructure] = useState<Form[] | undefined>(undefined)
  const [formData, setFormData] = useState<FormData>({})
  const [dynamicFields, setDynamicFields] = useState<SelectField[]>([])
  const [dynamicOptions, setDynamicOptions] = useState<{ [key: string]: string[] }>({})
  const [loading, setLoading] = useState<boolean>(false)

  const prevFormData = useRef(formData)

  //fetch form structure
  useEffect(() => {
    axiosInstance({
      method: 'get',
      url: '/api/insurance/forms'
    })
      .then((res) => {
        const dynamic = extractDynamicFields(res.data)
        setDynamicFields(dynamic)
        setFormStructure(res.data)
      })
      .catch((err) => console.error('Error fetching form structure', err))
  }, [])

  //check for change in dependency of options
  useEffect(() => {
    dynamicFields.forEach((field) => {
      if (field.dynamicOptions) {
        const dependencyKey = field.dynamicOptions.dependsOn
        const previousValue = prevFormData.current[dependencyKey]
        const currentValue = formData[dependencyKey]
        const dependencyValue = formData[dependencyKey]
        // Only fetch if dependency has a value and changed
        if (previousValue !== currentValue && currentValue) {
          axiosInstance({
            method: field.dynamicOptions.method,
            url: `${field.dynamicOptions.endpoint}?${dependencyKey}=${dependencyValue}`
          }).then((res) => {
            setDynamicOptions((prev) => ({
              ...prev,
              [field.id]: res.data.states
            }))
          })
        }
      }
    })
    prevFormData.current = formData
  }, [formData, dynamicFields])

  const handleChange = (fieldName: string, value: string) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }))
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    axiosInstance({
      method: 'post',
      url: '/api/insurance/forms/submit',
      data: formData
    })
      .then(() => {
        setFormData({})
        toast.success('Form submitted successfully')
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
        toast.error('Error in submitting form')
      })
  }

  const generateOptions = (field: SelectField | RadioField) => {
    let options: { value: string; label: string }[] = [
      { value: '', label: 'Select an option' }
    ]

    if ('dynamicOptions' in field && field.dynamicOptions) {
      if (formData[field.dynamicOptions.dependsOn]) {
        try {
          const opts = dynamicOptions[field.id]
          const newOptions = convertOptionsToKeyValueFormat(opts)

          options = [{ value: '', label: 'Select an option' }, ...newOptions]
          return options
        } catch (err) {
          console.log(err)
        }
      }
    } else if (field?.options?.length) {
      const newOptions = convertOptionsToKeyValueFormat(field.options)

      options = [{ value: '', label: 'Select an option' }, ...newOptions]
    }

    return options
  }

  const renderForm = (field: RenderType, index: number) => {
    if (isField(field) && field.visibility?.condition) {
      const ifCondition: string = generateIfCondition(field.visibility, formData)
      if (!evaluateCondition(ifCondition, formData)) {
        return null
      }
    }

    //render title
    if (!isField(field) && field.title) {
      return (
        <div
          key={field.formId}
          className='mb-4 p-4 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800'
        >
          <h3 className='font-semibold text-lg mb-2 text-gray-800 dark:text-gray-200'>
            {field.title}
          </h3>
          {field.fields &&
            field.fields.map((subField: Field) => renderForm(subField, index))}
        </div>
      )
    }

    // Render nested fields if present.
    if (isGroup(field) && field.fields && Array.isArray(field.fields)) {
      return (
        <div
          className={`p-4 ${
            field.fields.length !== index && 'border-b'
          } border-gray-300 dark:border-gray-700`}
        >
          <h3 className='font-semibold text-lg mb-2 text-gray-800 dark:text-gray-200'>
            {field.label}
          </h3>
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
                name={field.id}
                value={formData[field.id] || ''}
                placeholder={field.label}
                required={field.required}
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
                name={field.id}
                label={field.label}
                value={formData[field.id] || ''}
                required={field.required}
                onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                  handleChange(field.id, e.target.value)
                }
                options={generateOptions(field)}
              />
            </div>
          )
        case 'date':
          return (
            <div key={field.id} className='mb-4'>
              <DateInput
                id={field.id}
                name={field.id}
                label={field.label}
                value={formData[field.id] || ''}
                placeholder={field.label}
                required={field.required}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleChange(field.id, e.target.value)
                }
              />
            </div>
          )
        case 'radio':
          return (
            <div key={field.id} className='mb-4'>
              <RadioInput
                id={field.id}
                name={field.id}
                label={field.label}
                value={formData[field.id] || ''}
                required={field.required}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleChange(field.id, e.target.value)
                }
                options={generateOptions(field)}
              />
            </div>
          )
        // Additional field types (e.g., checkbox, radio) can be added here.
        default:
          return null
      }
    }
  }
  if (!formStructure) return <Loading />
  return (
    <form
      onSubmit={handleSubmit}
      className='max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-md shadow-md dark:shadow-gray-900'
    >
      {formStructure.map((field, index) => (
        <div key={field.formId}>{renderForm(field, index)}</div>
      ))}

      <div className='flex justify-center'>
        <button
          disabled={loading}
          type='submit'
          className='px-6 py-2 bg-blue-500 text-white font-semibold rounded-md disabled:bg-gray-300 dark:disabled:bg-gray-600 hover:bg-blue-600 dark:hover:bg-blue-700'
        >
          Submit Application
        </button>
      </div>
    </form>
  )
}

export default DynamicForm
