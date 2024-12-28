import { Card, CardContent } from '@/components/ui/card'

interface YardInfoProps {
  yardSize: string | null
  yardClassification: string | null
}

export default function YardInfo({ yardSize, yardClassification }: YardInfoProps) {
  if (!yardSize || !yardClassification) return null

  return (
    <Card className="mt-8 bg-primary/5">
      <CardContent className="pt-6">
        <p className="text-xl text-center">
          Yard Size: <span className="font-semibold">{yardSize} sq ft</span>{' '}
          <span className="text-muted-foreground">({yardClassification})</span>
        </p>
      </CardContent>
    </Card>
  )
}

