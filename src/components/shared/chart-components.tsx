import React from 'react'
import { Tooltip, TooltipProps } from 'recharts'

// Define a type for the content prop
type ContentType = React.ReactElement | (({ active, payload, label }: TooltipProps<any, any>) => React.ReactNode)

// Update the ChartTooltip props type
interface ChartTooltipProps extends Omit<TooltipProps<any, any>, 'content'> {
  content?: ContentType
}

export function ChartTooltip({ content, ...props }: ChartTooltipProps) {
  return (
    <Tooltip
      content={({ active, payload, label }) => {
        if (React.isValidElement(content)) {
          return React.cloneElement(content, { active, payload, label } as any)
        }
        if (typeof content === 'function') {
          return content({ active, payload, label })
        }
        return <ChartTooltipContent active={active} payload={payload} label={label} />
      }}
      {...props}
    />
  )
}

// Assuming ChartTooltipContent is defined elsewhere in your code
// If not, you'll need to implement it or import it
interface ChartTooltipContentProps {
  active?: boolean
  payload?: any[]
  label?: string
}

function ChartTooltipContent({ active, payload, label }: ChartTooltipContentProps) {
  // Implement your tooltip content here
  if (active && payload && payload.length) {
    return (
      <div className="bg-background p-2 shadow rounded">
        <p className="label">{`${label} : ${payload[0].value}`}</p>
      </div>
    )
  }
  return null
}

