interface Rule {
  dependsOn: string
  condition: string
  value?: string | number | boolean
}

interface FormData {
  [key: string]: string // Allow any key and value type
}

function generateIfCondition(rule: Rule, formData: FormData): string {
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

function evaluateCondition(ifCondition: string, formData: FormData): boolean {
  const parts = ifCondition.split(' ')
  const key = parts[0].replace("formData['", '').replace("']", '')
  const operator = parts[1]
  const value = parts[2].replace(/'/g, '') // Remove quotes

  const formDataValue = formData[key]

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
      return !!formDataValue && formDataValue.includes(value)
    case '&&!':
      return !!formDataValue && !formDataValue.includes(value)
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

export { generateIfCondition, evaluateCondition }
