import { cn } from "../utils/utils"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select"

interface ChildModel {
  id: string
  childName: string
}

interface ChildSelectorProps {
  children: ChildModel[]
  onSelectChild: (childId: string) => void
  selectedChildId: string | null
  className?: string
}

export const ChildSelector: React.FC<ChildSelectorProps> = ({
  children,
  onSelectChild,
  selectedChildId,
  className,
}) => {
  const [isPulsing, setIsPulsing] = useState(!selectedChildId)

  useEffect(() => {
    setIsPulsing(!selectedChildId)
  }, [selectedChildId])

  return (
    <div className="relative">
      <Select onValueChange={onSelectChild} value={selectedChildId || undefined}>
        <SelectTrigger className={cn("w-[180px]", className)}>
          <SelectValue placeholder="Seleccionar hijo" />
        </SelectTrigger>
        <SelectContent>
          {children.map((child) => (
            <SelectItem key={child.id} value={child.id}>
              {child.childName}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {isPulsing && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5, repeatType: "reverse" }}
          className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full"
        />
      )}
    </div>
  )
}

