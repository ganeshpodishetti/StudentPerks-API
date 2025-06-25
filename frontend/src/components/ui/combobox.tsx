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
        className="w-[--radix-popover-trigger-width] max-w-[400px] p-0 z-[9999]" 
        align="start" 
        sideOffset={4}
        avoidCollisions={true}
        collisionPadding={8}
      >
        <div className="flex flex-col">
          <div className="px-3 py-2 border-b">
            <Input
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className="h-8 border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              autoFocus
            />
          </div>
          
          <div className="max-h-[200px] overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <div
                  key={option.value}
                  onClick={() => handleSelect(option.value)}
                  className={cn(
                    "flex items-center px-3 py-2 text-sm cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800",
                    "focus:bg-neutral-100 dark:focus:bg-neutral-800 outline-none"
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
                      "mr-2 h-4 w-4",
                      value === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option.label}
                </div>
              ))
            ) : searchValue.trim() ? (
              allowCustom ? null : (
                <div className="px-3 py-2 text-sm text-neutral-500 dark:text-neutral-400">
                  {emptyText}
                </div>
              )
            ) : (
              <div className="px-3 py-2 text-sm text-neutral-500 dark:text-neutral-400">
                {emptyText}
              </div>
            )}
            
            {showCreateOption && (
              <div
                onClick={handleCreateCustom}
                className={cn(
                  "flex items-center px-3 py-2 text-sm cursor-pointer",
                  "text-neutral-700 dark:text-neutral-300 bg-neutral-50 dark:bg-neutral-800/50",
                  "hover:bg-neutral-100 dark:hover:bg-neutral-700"
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
                {customText} "{searchValue}"
              </div>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
