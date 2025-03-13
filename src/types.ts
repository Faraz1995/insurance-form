export interface FormData {
  [key: string]: string
}

// Represents a visibility condition for a field.
export interface VisibilityCondition {
  dependsOn: string
  condition: string
  value: string
}

// Represents dynamic options configuration for a select field.
export interface DynamicOptions {
  dependsOn: string
  endpoint: string
  method: string
}

// Base type for all form fields.
export interface BaseField {
  id: string
  label: string
  required?: boolean
  // Optional property to control field visibility based on another field.
  visibility?: VisibilityCondition
}

// Field type for groups which can contain nested fields.
export interface GroupField extends BaseField {
  type: 'group'
  fields: Field[]
}

// Field type for a simple text input.
export interface TextField extends BaseField {
  type: 'text'
}

// Field type for date input.
export interface DateField extends BaseField {
  type: 'date'
}

// Field type for select inputs.
// It can have either a fixed list of options or a dynamic options configuration.
export interface SelectField extends BaseField {
  type: 'select'
  options?: string[]
  dynamicOptions?: DynamicOptions
}

// Field type for radio inputs.
export interface RadioField extends BaseField {
  type: 'radio'
  options: string[]
}

// Union type of all possible field types.
export type Field = GroupField | TextField | DateField | SelectField | RadioField

// The main form interface.
export type Form = {
  formId: string
  title: string
  fields: Field[]
}
