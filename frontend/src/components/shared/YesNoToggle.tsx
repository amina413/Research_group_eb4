import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'

interface YesNoToggleProps {
  value: 'yes' | 'no' | ''
  onChange: (value: 'yes' | 'no' | '') => void
  'aria-labelledby'?: string
}

/** Two side-by-side buttons; the selected one is filled (06 §3). */
export function YesNoToggle({ value, onChange, ...aria }: YesNoToggleProps) {
  const item =
    'border border-input data-[state=on]:border-primary data-[state=on]:bg-primary data-[state=on]:text-primary-foreground'
  return (
    <ToggleGroup
      type="single"
      spacing={2}
      value={value}
      onValueChange={(v) => onChange(v === 'yes' || v === 'no' ? v : '')}
      {...aria}
    >
      <ToggleGroupItem value="yes" className={item}>
        Yes
      </ToggleGroupItem>
      <ToggleGroupItem value="no" className={item}>
        No
      </ToggleGroupItem>
    </ToggleGroup>
  )
}
