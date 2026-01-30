import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import SectionCard from "./SectionCard"
import type { Section, SectionType } from "../types"

type SectionsCardProps = {
  sections: Section[]
  newSectionType: SectionType
  setNewSectionType: (type: SectionType) => void
  onAddSection: (type: SectionType) => void
  onDeleteSection: (index: number) => void
  onDragStart: (index: number) => void
  onDrop: (index: number) => void
  onSectionChange: (index: number, update: Partial<Section>) => void
}

export default function SectionsCard({
  sections,
  newSectionType,
  setNewSectionType,
  onAddSection,
  onDeleteSection,
  onDragStart,
  onDrop,
  onSectionChange,
}: SectionsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3">
        <CardTitle>Sections</CardTitle>
        <div className="flex items-center gap-2">
          <Select
            value={newSectionType}
            onValueChange={(value) => setNewSectionType(value as SectionType)}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="about">About</SelectItem>
              <SelectItem value="values">Values</SelectItem>
              <SelectItem value="perks">Perks</SelectItem>
              <SelectItem value="culture">Culture</SelectItem>
              <SelectItem value="faq">FAQ</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => onAddSection(newSectionType)}>
            Add section
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {sections.length === 0 && (
          <div className="rounded-md border border-dashed border-muted-foreground/40 p-4 text-sm text-muted-foreground">
            No sections yet. Use the dropdown above to add one.
          </div>
        )}
        {sections.map((section, index) => (
          <SectionCard
            key={section.id}
            section={section}
            index={index}
            onDragStart={onDragStart}
            onDrop={onDrop}
            onDelete={onDeleteSection}
            onChange={onSectionChange}
          />
        ))}
      </CardContent>
    </Card>
  )
}
