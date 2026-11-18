import { useId, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface CopyFieldProps {
  label: string
  value: string
}

/** Read-only field with an inline "Copy" button (06 §3). */
export function CopyField({ label, value }: CopyFieldProps) {
  const id = useId()
  const [copied, setCopied] = useState(false)

  async function copy() {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="flex gap-2">
        <Input id={id} value={value} readOnly className="flex-1" />
        <Button type="button" variant="outline" onClick={copy}>
          {copied ? 'Copied' : 'Copy'}
        </Button>
      </div>
      <span aria-live="polite" className="sr-only">
        {copied ? 'Copied to clipboard' : ''}
      </span>
    </div>
  )
}
