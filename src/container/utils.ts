import { Field, Form, GroupField, SelectField } from '../types'

interface Rule {
  dependsOn: string
  condition: string
  value?: string | number | boolean
}

function generateIfCondition(rule: Rule, formData: { [key: string]: string }): string {
  if (!rule || !formData) {
    return ''
  }

  const { dependsOn, condition, value } = rule

  if (!dependsOn || !condition || value === undefined) {
    return ''
  }

  switch (condition) {
    case 'equals':
      return `formData['${dependsOn}'] === '${value}'`
    case 'notEquals':
      return `formData['${dependsOn}'] !== '${value}'`
    case 'greaterThan':
      return `formData['${dependsOn}'] > ${value}`
    case 'lessThan':
      return `formData['${dependsOn}'] < ${value}`
    case 'greaterThanOrEqual':
      return `formData['${dependsOn}'] >= ${value}`
    case 'lessThanOrEqual':
      return `formData['${dependsOn}'] <= ${value}`
    case 'contains':
      return `formData['${dependsOn}'] && formData['${dependsOn}'].includes('${value}')`
    case 'notContains':
      return `formData['${dependsOn}'] && !formData['${dependsOn}'].includes('${value}')`
    case 'exists':
      return `formData['${dependsOn}'] !== undefined && formData['${dependsOn}'] !== null`
    case 'notExists':
      return `formData['${dependsOn}'] === undefined || formData['${dependsOn}'] === null`
    default:
      return ''
  }
}

function evaluateCondition(
  ifCondition: string,
  formData: { [key: string]: string }
): boolean {
  const parts = ifCondition.split(' ')
  const key = parts[0].replace("formData['", '').replace("']", '')
  const operator = parts[1]
  const value = parts[2].replace(/'/g, '') // Remove quotes

  const formDataValue = formData[key as keyof Form]

  switch (operator) {
    case '===':
      return formDataValue === value
    case '!==':
      return formDataValue !== value
    case '>':
      return +formDataValue > +value
    case '<':
      return +formDataValue < +value
    case '>=':
      return +formDataValue >= +value
    case '<=':
      return +formDataValue <= +value
    case '&&':
      return !!formDataValue && formDataValue.includes(value as string & Field)
    case '&&!':
      return !!formDataValue && !formDataValue.includes(value as string & Field)
    case '!==undefined':
    case '!==null':
      return formDataValue !== undefined && formDataValue !== null
    case '===undefined':
    case '===null':
      return formDataValue === undefined || formDataValue === null
    default:
      return false // Handle unknown operators
  }
}

const extractDynamicFields = (formData: Form[]): SelectField[] => {
  const dynamicFields: SelectField[] = []

  // Function to recursively search through nested fields
  const processField = (field: Field | GroupField) => {
    // If it's a group with nested fields
    if (field.type === 'group' && 'fields' in field && field.fields) {
      // Process all fields in the group
      field.fields.forEach(processField)
    }
    // If it's a field with dynamicOptions
    else if ('dynamicOptions' in field && field.dynamicOptions) {
      dynamicFields.push(field)
    }
  }

  // Process all forms in the data
  formData.forEach((form) => {
    form.fields.forEach(processField)
  })

  return dynamicFields
}

export { generateIfCondition, evaluateCondition, extractDynamicFields }
