import { User } from "lucide-react"
import React from "react"
import { cn } from "../utils/utils"
import * as AvatarPrimitive from "@radix-ui/react-avatar"

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
    src?: string | null
    alt?: string
    fallback?: string
  }
  
  const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
    ({ className, src, alt, fallback, ...props }, ref) => {
      const [imageError, setImageError] = React.useState(false)
  
      return (
        <div
          ref={ref}
          className={cn(
            "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
            className
          )}
          {...props}
        >
          {src && !imageError ? (
            <img
              src={src}
              alt={alt}
              onError={() => setImageError(true)}
              className="aspect-square h-full w-full object-cover"
            />
          ) : fallback ? (
            <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
              {fallback}
            </div>
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-muted">
              <User className="h-6 w-6 text-muted-foreground" />
            </div>
          )}
        </div>
      )
    }
  )
  Avatar.displayName = "Avatar"
  

  const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn("aspect-square h-full w-full", className)}
    {...props}
  />
))
AvatarImage.displayName = AvatarPrimitive.Image.displayName

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full bg-muted",
      className
    )}
    {...props}
  />
))
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName

export { Avatar, AvatarImage, AvatarFallback }

