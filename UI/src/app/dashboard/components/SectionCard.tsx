import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { Section } from "../types"

type SectionCardProps = {
  section: Section
  index: number
  onDragStart: (index: number) => void
  onDrop: (index: number) => void
  onDelete: (index: number) => void
  onChange: (index: number, update: Partial<Section>) => void
}

export default function SectionCard({
  section,
  index,
  onDragStart,
  onDrop,
  onDelete,
  onChange,
}: SectionCardProps) {
  const isPerks = section.type === "perks"
  const contentValue = isPerks
    ? Array.isArray(section.content)
      ? section.content.join("\n")
      : ""
    : String(section.content ?? "")

  return (
    <Card
      draggable
      onDragStart={() => onDragStart(index)}
      onDragOver={(event) => event.preventDefault()}
      onDrop={() => onDrop(index)}
      className="border-muted"
    >
      <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
        <div className="text-xs font-semibold uppercase text-muted-foreground">
          {section.type}
        </div>
        <Button variant="destructive" size="sm" onClick={() => onDelete(index)}>
          Delete
        </Button>
      </CardHeader>
      <CardContent className="grid gap-3 pt-2">
        <div className="space-y-2">
          <Label htmlFor={`section-title-${section.id}`}>Title</Label>
          <Input
            id={`section-title-${section.id}`}
            value={section.title}
            onChange={(event) => onChange(index, { title: event.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`section-content-${section.id}`}>Content</Label>
          <Textarea
            id={`section-content-${section.id}`}
            className="min-h-[120px]"
            value={contentValue}
            onChange={(event) =>
              onChange(index, {
                content: isPerks
                  ? event.target.value
                      .split("\n")
                      .map((line) => line.trim())
                      .filter(Boolean)
                  : event.target.value,
              })
            }
            placeholder={isPerks ? "One perk per line" : "Write section content..."}
          />
        </div>
        <div className="text-xs text-muted-foreground">
          Drag this card to reorder sections.
        </div>
      </CardContent>
    </Card>
  )
}
