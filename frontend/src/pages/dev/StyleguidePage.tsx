/**
 * /dev/styleguide — dev-only (see routes/dev.tsx). Shows the theme tokens and
 * every component listed in docs/06-design.md §3, using theme tokens only.
 */
import { useState } from 'react'
import { ROUTES } from '@contract/routes'
import { TopNav } from '@/components/layout/TopNav'
import { CopyField } from '@/components/shared/CopyField'
import { EmptyState } from '@/components/shared/EmptyState'
import { ErrorSummary } from '@/components/shared/ErrorSummary'
import { FieldError } from '@/components/shared/FieldError'
import { ProgressRing } from '@/components/shared/ProgressRing'
import { QrPlaceholder } from '@/components/shared/QrPlaceholder'
import { StatTile } from '@/components/shared/StatTile'
import { YesNoToggle } from '@/components/shared/YesNoToggle'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { mockStudies } from '@/mocks/studies'

/* ---------- Colour tokens ---------- */

interface Swatch {
  name: string
  bg: string // full class names so Tailwind can see them
  fg?: string
  fgName?: string
}

const SWATCHES: Swatch[] = [
  { name: 'background', bg: 'bg-background', fg: 'text-foreground', fgName: 'foreground' },
  { name: 'primary', bg: 'bg-primary', fg: 'text-primary-foreground', fgName: 'primary-foreground' },
  { name: 'secondary', bg: 'bg-secondary', fg: 'text-secondary-foreground', fgName: 'secondary-foreground' },
  { name: 'accent', bg: 'bg-accent', fg: 'text-accent-foreground', fgName: 'accent-foreground' },
  { name: 'muted', bg: 'bg-muted', fg: 'text-muted-foreground', fgName: 'muted-foreground' },
  { name: 'success', bg: 'bg-success', fg: 'text-success-foreground', fgName: 'success-foreground' },
  { name: 'warning', bg: 'bg-warning', fg: 'text-warning-foreground', fgName: 'warning-foreground' },
  { name: 'destructive', bg: 'bg-destructive', fg: 'text-destructive-foreground', fgName: 'destructive-foreground' },
  { name: 'border', bg: 'bg-border' },
  { name: 'ring', bg: 'bg-ring' },
]

function readToken(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(`--${name}`).trim()
}

function luminance(hex: string): number | null {
  const m = /^#([0-9a-f]{6})$/i.exec(hex)
  if (!m) return null
  const channels = [0, 2, 4].map((i) => {
    const c = parseInt(m[1].slice(i, i + 2), 16) / 255
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2]
}

function contrast(a: string, b: string): number | null {
  const la = luminance(a)
  const lb = luminance(b)
  if (la === null || lb === null) return null
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05)
}

function ColourSwatch({ swatch }: { swatch: Swatch }) {
  // The stylesheet is loaded before the page renders, so tokens can be read once on mount.
  const [values] = useState(() => {
    const bg = readToken(swatch.name)
    const fg = swatch.fgName ? readToken(swatch.fgName) : readToken('background')
    return { bg, fg, ratio: contrast(bg, fg) }
  })

  const needed = swatch.fgName ? 4.5 : 3
  const passes = values?.ratio != null && values.ratio >= needed

  return (
    <li className="overflow-hidden rounded-sm border">
      <div className={`${swatch.bg} ${swatch.fg ?? ''} flex h-input items-center px-3 font-bold`}>
        {swatch.fg ? 'Aa' : ''}
      </div>
      <div className="flex flex-col gap-1 p-3 text-helper">
        <span className="font-bold">{swatch.name}</span>
        <span className="text-muted-foreground">{values?.bg}</span>
        {values?.ratio != null && (
          <span className={passes ? 'text-success' : 'text-destructive'}>
            {values.ratio.toFixed(1)}:1 {swatch.fgName ? 'text' : 'vs background'} · {passes ? 'AA pass' : 'AA fail'}
          </span>
        )}
      </div>
    </li>
  )
}

/* ---------- Type, radius, sizes ---------- */

const TYPE_SCALE = [
  { cls: 'text-banner', name: 'banner', note: '36 · success banner heading' },
  { cls: 'text-progress', name: 'progress', note: '40 · progress ring %' },
  { cls: 'text-number', name: 'number', note: '32 · large numbers' },
  { cls: 'text-hero', name: 'hero', note: '28 · hero heading' },
  { cls: 'text-body', name: 'body', note: '16 · body, labels, buttons' },
  { cls: 'text-helper', name: 'helper', note: '14 · helper text' },
]

const RADII = [
  { cls: 'rounded-none', name: 'none', note: '0 · panels, cards' },
  { cls: 'rounded-sm', name: 'sm', note: '8 · buttons, inputs' },
  { cls: 'rounded-md', name: 'md', note: '10 · progress bars' },
  { cls: 'rounded-lg', name: 'lg', note: '20 · dialogs' },
]

const SIZES = [
  { cls: 'h-nav', name: 'nav', note: '52' },
  { cls: 'h-input', name: 'input', note: '48' },
  { cls: 'h-button', name: 'button', note: '44' },
  { cls: 'h-mark', name: 'mark', note: '32' },
]

const SPACING = [
  { cls: 'w-2', note: '8' },
  { cls: 'w-4', note: '16' },
  { cls: 'w-6', note: '24' },
  { cls: 'w-8', note: '32' },
  { cls: 'w-12', note: '48' },
]

/* ---------- Page ---------- */

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-4 border-t pt-8" aria-labelledby={title}>
      <h2 id={title} className="text-hero font-bold">
        {title}
      </h2>
      {children}
    </section>
  )
}

export default function StyleguidePage() {
  const [yesNo, setYesNo] = useState<'yes' | 'no' | ''>('yes')

  return (
    <div className="min-h-dvh">
      <TopNav items={[{ label: 'Home', to: ROUTES.home }]} actions={[{ label: 'Account', to: ROUTES.settings }]} />

      <main className="mx-auto flex max-w-content flex-col gap-8 px-inset py-8 md:px-inset-lg">
        <header className="flex flex-col gap-2">
          <h1 className="text-banner font-bold">Styleguide</h1>
          <p className="text-muted-foreground">
            Dev only. Colours are <strong>placeholders</strong> until the designer delivers the final palette.
          </p>
        </header>

        <Section title="Colour tokens">
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {SWATCHES.map((s) => (
              <ColourSwatch key={s.name} swatch={s} />
            ))}
          </ul>
        </Section>

        <Section title="Type scale (Inter)">
          <ul className="flex flex-col gap-4">
            {TYPE_SCALE.map((t) => (
              <li key={t.name} className="flex flex-col gap-1 md:flex-row md:items-baseline md:gap-4">
                <span className={`${t.cls} font-bold`}>The quick brown fox</span>
                <span className="text-helper text-muted-foreground">
                  text-{t.name} · {t.note}
                </span>
              </li>
            ))}
            <li className="flex flex-col gap-1">
              <span>Regular weight body text for longer descriptions.</span>
              <span className="text-helper text-muted-foreground">text-body · regular</span>
            </li>
          </ul>
        </Section>

        <Section title="Radius, sizes and spacing">
          <ul className="flex flex-wrap gap-4">
            {RADII.map((r) => (
              <li key={r.name} className="flex flex-col items-center gap-2 text-helper">
                <span className={`${r.cls} size-24 border-2 border-foreground bg-secondary`} />
                <span>
                  rounded-{r.name} · {r.note}
                </span>
              </li>
            ))}
          </ul>
          <ul className="flex flex-wrap items-end gap-4">
            {SIZES.map((s) => (
              <li key={s.name} className="flex flex-col items-center gap-2 text-helper">
                <span className={`${s.cls} w-24 rounded-sm bg-secondary`} />
                <span>
                  h-{s.name} · {s.note}
                </span>
              </li>
            ))}
          </ul>
          <ul className="flex flex-col gap-2">
            {SPACING.map((s) => (
              <li key={s.cls} className="flex items-center gap-4 text-helper">
                <span className={`${s.cls} h-4 bg-primary`} />
                <span>
                  {s.cls} · {s.note}
                </span>
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Buttons">
          <div className="flex flex-wrap gap-2">
            <Button>Join this study</Button>
            <Button variant="outline">Back</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Delete</Button>
            <Button disabled>Disabled</Button>
          </div>
        </Section>

        <Section title="Form controls">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="sg-title">Study title</Label>
              <Input id="sg-title" placeholder="e.g. Daily Mood & Sleep Study" />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="sg-code">Join code</Label>
              <Input id="sg-code" defaultValue="ABC" aria-invalid aria-describedby="sg-code-error" />
              <FieldError id="sg-code-error">Enter the 8-character code from your invite.</FieldError>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="sg-device">Device</Label>
              <Select>
                <SelectTrigger id="sg-device" className="w-full">
                  <SelectValue placeholder="Choose a device" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="watch">Smart watch</SelectItem>
                  <SelectItem value="ring">Smart ring</SelectItem>
                  <SelectItem value="phone">Phone only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <span id="sg-yesno" className="font-bold">
                Did you sleep more than 7 hours?
              </span>
              <YesNoToggle value={yesNo} onChange={setYesNo} aria-labelledby="sg-yesno" />
            </div>

            <div className="flex items-start gap-3 md:col-span-2">
              <Checkbox id="sg-consent" />
              <Label htmlFor="sg-consent" className="leading-normal font-normal">
                I agree to my data being used for this study.
              </Label>
            </div>
          </div>
          <ErrorSummary errors={['Add a study title', 'Choose a start date']} />
        </Section>

        <Section title="Status banners">
          <div className="flex flex-col gap-4">
            <Alert variant="success">
              <AlertTitle className="text-banner">Success</AlertTitle>
              <AlertDescription>You're eligible for this study.</AlertDescription>
            </Alert>
            <Alert>
              <AlertTitle>Waiting for approval</AlertTitle>
              <AlertDescription>The researcher will review your answers soon.</AlertDescription>
            </Alert>
            <Alert variant="warning">
              <AlertTitle>Already checked in today</AlertTitle>
              <AlertDescription>Come back tomorrow for your next check-in.</AlertDescription>
            </Alert>
            <Alert variant="destructive" className="border-destructive">
              <AlertTitle>Group full</AlertTitle>
              <AlertDescription>This study isn't accepting new participants.</AlertDescription>
            </Alert>
          </div>
        </Section>

        <Section title="Cards and stats">
          <div className="grid gap-4 sm:grid-cols-3">
            <StatTile label="Participants" value="54 / 80" />
            <StatTile label="Check-ins today" value="34" />
            <StatTile label="Rewards paid" value="£2,100" />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Panel</CardTitle>
                <CardDescription>Light panel / card, radius none.</CardDescription>
              </CardHeader>
              <CardContent>Card content uses body text.</CardContent>
            </Card>
            <Card className="bg-primary text-primary-foreground ring-0">
              <CardHeader>
                <CardTitle>Dark panel</CardTitle>
              </CardHeader>
              <CardContent>Dark info card variant.</CardContent>
            </Card>
          </div>
          <EmptyState message="You haven't created any studies yet.">
            <Button>New study</Button>
            <Button variant="outline">Back to home</Button>
          </EmptyState>
        </Section>

        <Section title="Progress">
          <div className="flex flex-col gap-6 md:flex-row md:items-center">
            <ProgressRing value={50} />
            <div className="flex flex-1 flex-col gap-4">
              <div className="flex flex-col gap-2">
                <span className="text-helper font-bold">Quota: age 18–24</span>
                <Progress value={68} aria-label="Quota age 18–24" />
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-helper font-bold">Sign-ups from posters</span>
                <Progress value={30} aria-label="Sign-ups from posters" />
              </div>
            </div>
          </div>
        </Section>

        <Section title="Tabs and table">
          <Tabs defaultValue="all">
            <TabsList variant="line">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="draft">Draft</TabsTrigger>
              <TabsTrigger value="closed">Closed</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="pt-4">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Study</TableHead>
                      <TableHead>Participants</TableHead>
                      <TableHead className="text-right">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockStudies.map((s) => (
                      <TableRow key={s.id}>
                        <TableCell>{s.title}</TableCell>
                        <TableCell>
                          {s.approved_count} / {s.target_participants}
                        </TableCell>
                        <TableCell className="text-right">{s.status}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            <TabsContent value="active" className="pt-4 text-muted-foreground">
              Active studies.
            </TabsContent>
            <TabsContent value="draft" className="pt-4 text-muted-foreground">
              Draft studies.
            </TabsContent>
            <TabsContent value="closed" className="pt-4 text-muted-foreground">
              Closed studies.
            </TabsContent>
          </Tabs>
        </Section>

        <Section title="Share">
          <div className="flex flex-col gap-4 md:flex-row md:items-start">
            <QrPlaceholder />
            <div className="flex flex-1 flex-col gap-4">
              <CopyField label="Study link" value={`${import.meta.env.VITE_APP_URL ?? ''}${ROUTES.join('LIBPOST1')}`} />
              <div className="flex flex-wrap gap-2">
                <Button variant="outline">Download QR</Button>
                <Button variant="outline">Share</Button>
              </div>
            </div>
          </div>
        </Section>

        <Section title="Confirmation dialog">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="self-start">Publish study</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Publish this study?</DialogTitle>
                <DialogDescription>
                  Once published, participants can join with the link or QR code.
                </DialogDescription>
              </DialogHeader>
              <ul className="list-disc pl-6">
                <li>Target: 50 participants</li>
                <li>Runs 1 Dec 2026 – 28 Feb 2027</li>
              </ul>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Go back</Button>
                </DialogClose>
                <Button>Publish</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </Section>
      </main>
    </div>
  )
}
