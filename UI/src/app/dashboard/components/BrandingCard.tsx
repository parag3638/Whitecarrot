import type { Dispatch, SetStateAction } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { ThemeState } from "../types"

type BrandingCardProps = {
  theme: ThemeState
  setTheme: Dispatch<SetStateAction<ThemeState>>
  cultureVideoUrl: string
  setCultureVideoUrl: Dispatch<SetStateAction<string>>
}

const colorPresets = [
  "#0f172a",
  "#1e293b",
  "#111827",
  "#0ea5e9",
  "#38bdf8",
  "#22c55e",
  "#f97316",
  "#f59e0b",
]

export default function BrandingCard({
  theme,
  setTheme,
  cultureVideoUrl,
  setCultureVideoUrl,
}: BrandingCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Branding</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="primaryColor">Primary Color</Label>
          <div className="rounded-lg border border-border bg-muted/30 p-3">
            <div className="flex flex-wrap items-center gap-3">
              <Input
                id="primaryColor"
                type="color"
                className="h-10 w-12 cursor-pointer p-1"
                value={theme.primaryColor}
                onChange={(event) =>
                  setTheme((prev) => ({ ...prev, primaryColor: event.target.value }))
                }
              />
              <Input
                type="text"
                className="h-10 w-36 font-mono"
                value={theme.primaryColor}
                onChange={(event) =>
                  setTheme((prev) => ({ ...prev, primaryColor: event.target.value }))
                }
                placeholder="#111827"
              />
              <div
                className="h-10 w-16 rounded-md border border-input shadow-sm"
                style={{ backgroundColor: theme.primaryColor }}
              />
              <div className="flex flex-wrap gap-2">
                {colorPresets.map((color) => (
                  <button
                    key={`primary-${color}`}
                    type="button"
                    className="h-7 w-7 rounded-full border border-border shadow-sm transition hover:scale-105"
                    style={{ backgroundColor: color }}
                    onClick={() =>
                      setTheme((prev) => ({ ...prev, primaryColor: color }))
                    }
                    aria-label={`Set primary color to ${color}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="accentColor">Accent Color</Label>
          <div className="rounded-lg border border-border bg-muted/30 p-3">
            <div className="flex flex-wrap items-center gap-3">
              <Input
                id="accentColor"
                type="color"
                className="h-10 w-12 cursor-pointer p-1"
                value={theme.accentColor}
                onChange={(event) =>
                  setTheme((prev) => ({ ...prev, accentColor: event.target.value }))
                }
              />
              <Input
                type="text"
                className="h-10 w-36 font-mono"
                value={theme.accentColor}
                onChange={(event) =>
                  setTheme((prev) => ({ ...prev, accentColor: event.target.value }))
                }
                placeholder="#22c55e"
              />
              <div
                className="h-10 w-16 rounded-md border border-input shadow-sm"
                style={{ backgroundColor: theme.accentColor }}
              />
              <div className="flex flex-wrap gap-2">
                {colorPresets.map((color) => (
                  <button
                    key={`accent-${color}`}
                    type="button"
                    className="h-7 w-7 rounded-full border border-border shadow-sm transition hover:scale-105"
                    style={{ backgroundColor: color }}
                    onClick={() =>
                      setTheme((prev) => ({ ...prev, accentColor: color }))
                    }
                    aria-label={`Set accent color to ${color}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="logoUrl">Logo URL</Label>
          <Input
            id="logoUrl"
            type="text"
            value={theme.logoUrl}
            onChange={(event) =>
              setTheme((prev) => ({ ...prev, logoUrl: event.target.value }))
            }
            placeholder="https://..."
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="bannerUrl">Banner URL</Label>
          <Input
            id="bannerUrl"
            type="text"
            value={theme.bannerUrl}
            onChange={(event) =>
              setTheme((prev) => ({ ...prev, bannerUrl: event.target.value }))
            }
            placeholder="https://..."
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="font">Font</Label>
          <Select
            value={theme.font}
            onValueChange={(value) =>
              setTheme((prev) => ({ ...prev, font: value }))
            }
          >
            <SelectTrigger id="font">
              <SelectValue placeholder="Select a font" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="inter">Inter</SelectItem>
              <SelectItem value="nunito">Nunito</SelectItem>
              <SelectItem value="poppins">Poppins</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="cultureVideoUrl">Culture Video URL</Label>
          <Input
            id="cultureVideoUrl"
            type="text"
            value={cultureVideoUrl}
            onChange={(event) => setCultureVideoUrl(event.target.value)}
            placeholder="https://..."
          />
        </div>
      </CardContent>
    </Card>
  )
}
