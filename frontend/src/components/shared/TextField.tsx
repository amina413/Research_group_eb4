import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { FieldError } from './FieldError'

interface TextFieldProps extends React.ComponentProps<typeof Input> {
  id: string
  label: string
  /** Message shown under the field and announced via aria-describedby. */
  error?: string
}

/** Label + input + accessible error. Spread React Hook Form's register() into it. */
export function TextField({ id, label, error, ...inputProps }: TextFieldProps) {
  const errorId = `${id}-error`
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} aria-invalid={error ? true : undefined} aria-describedby={error ? errorId : undefined} {...inputProps} />
      {error && <FieldError id={errorId}>{error}</FieldError>}
    </div>
  )
}
