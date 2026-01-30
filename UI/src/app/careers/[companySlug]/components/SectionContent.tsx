type SectionContentProps = {
  content: string | string[]
}

export default function SectionContent({ content }: SectionContentProps) {
  if (Array.isArray(content)) {
    return (
      <ul className="list-disc pl-5 text-sm text-muted-foreground">
        {content.map((item, index) => (
          <li key={`${item}-${index}`}>{item}</li>
        ))}
      </ul>
    )
  }

  return <p className="text-sm text-muted-foreground">{content}</p>
}
