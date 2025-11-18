import React from 'react'

interface SeparatorProps {
  className?: string
  orientation?: 'horizontal' | 'vertical'
}

export const Separator: React.FC<SeparatorProps> = ({
  className = '',
  orientation = 'horizontal'
}) => {
  const baseClass = 'bg-gray-200 dark:bg-gray-700'
  const orientationClass = orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px'

  return (
    <div
      role="separator"
      aria-orientation={orientation}
      className={`${baseClass} ${orientationClass} ${className}`}
    />
  )
}