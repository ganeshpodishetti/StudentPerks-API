import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Check, ChevronsUpDown, Plus } from "lucide-react"
import * as React from "react"

interface ComboboxProps {
  options: { value: string; label: string }[]
  value?: string
  onValueChange: (value: string) => void
  placeholder?: string
  searchPlaceholder?: string
  emptyText?: string
  className?: string
  disabled?: boolean
  allowCustom?: boolean
  customText?: string
}

export function Combobox({
  options,
  value,
  onValueChange,
  placeholder = "Select option...",
  searchPlaceholder = "Search...",
  emptyText = "No option found.",
  className,
  disabled = false,
  allowCustom = true,
  customText = "Create"
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [searchValue, setSearchValue] = React.useState("")

  // Check if current value exists in options
  const selectedOption = options.find(option => option.value === value)
  const displayValue = selectedOption?.label || value || ""

  // Filter options based on search
  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchValue.toLowerCase())
  )

  // Handle selection
  const handleSelect = (selectedValue: string) => {
    console.log('Selecting value:', selectedValue)
    onValueChange(selectedValue)
    setOpen(false)
    setSearchValue("")
  }

  // Handle custom value creation
  const handleCreateCustom = () => {
    if (searchValue.trim() && !options.some(option => 
      option.label.toLowerCase() === searchValue.toLowerCase()
    )) {
      console.log('Creating custom value:', searchValue.trim())
      onValueChange(searchValue.trim())
      setOpen(false)
      setSearchValue("")
    }
  }

  // Show create option when search value doesn't match any existing option
  const showCreateOption = allowCustom && 
    searchValue.trim() && 
    !options.some(option => 
      option.label.toLowerCase() === searchValue.toLowerCase()
    )

  // Handle Enter key for creating custom values
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      if (showCreateOption) {
        handleCreateCustom()
      } else if (filteredOptions.length === 1) {
        handleSelect(filteredOptions[0].value)
      } else if (allowCustom && searchValue.trim()) {
        onValueChange(searchValue.trim())
        setOpen(false)
        setSearchValue("")
      }
    }
  }

  // Handle open change
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (!newOpen) {
      // When closing, if there's a search value and allowCustom is true, create it
      if (allowCustom && searchValue.trim() && !options.some(option => 
        option.label.toLowerCase() === searchValue.toLowerCase()
      )) {
        onValueChange(searchValue.trim())
      }
      setSearchValue("")
    }
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between",
            !value && "text-neutral-500 dark:text-neutral-400",
            className
          )}
          disabled={disabled}
        >
          <span className="truncate">
            {displayValue || placeholder}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-[--radix-popover-trigger-width] max-w-[400px] p-0 z-[9999] bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 shadow-lg" 
        align="start" 
        sideOffset={4}
        avoidCollisions={true}
        collisionPadding={8}
      >
        <div className="flex flex-col">
          <div className="px-3 py-2 border-b border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900">
            <Input
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className="h-8 border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-500 dark:placeholder:text-neutral-400"
              autoFocus
            />
          </div>
          
          <div className="max-h-[300px] overflow-y-auto bg-white dark:bg-neutral-900 custom-scrollbar">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <div
                  key={option.value}
                  onClick={() => handleSelect(option.value)}
                  className={cn(
                    "flex items-center px-3 py-2.5 text-sm cursor-pointer transition-colors",
                    "hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-900 dark:text-neutral-100",
                    "focus:bg-neutral-100 dark:focus:bg-neutral-800 outline-none",
                    value === option.value && "bg-neutral-100 dark:bg-neutral-800"
                  )}
                  role="option"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault()
                      handleSelect(option.value)
                    }
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4 text-neutral-600 dark:text-neutral-400",
                      value === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <span className="truncate">{option.label}</span>
                </div>
              ))
            ) : searchValue.trim() ? (
              allowCustom ? null : (
                <div className="px-3 py-2.5 text-sm text-neutral-500 dark:text-neutral-400">
                  {emptyText}
                </div>
              )
            ) : (
              <div className="px-3 py-2.5 text-sm text-neutral-500 dark:text-neutral-400">
                {emptyText}
              </div>
            )}
            
            {showCreateOption && (
              <div
                onClick={handleCreateCustom}
                className={cn(
                  "flex items-center px-3 py-2.5 text-sm cursor-pointer transition-colors border-t border-neutral-200 dark:border-neutral-700",
                  "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30",
                  "hover:bg-blue-100 dark:hover:bg-blue-950/50"
                )}
                role="option"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault()
                    handleCreateCustom()
                  }
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                <span className="truncate">{customText} "{searchValue}"</span>
              </div>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
