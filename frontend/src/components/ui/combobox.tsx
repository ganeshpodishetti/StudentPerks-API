import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command"
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
    onValueChange(selectedValue)
    setOpen(false)
    setSearchValue("")
  }

  // Handle custom value creation
  const handleCreateCustom = () => {
    if (searchValue.trim() && !options.some(option => 
      option.label.toLowerCase() === searchValue.toLowerCase()
    )) {
      onValueChange(searchValue.trim())
      setOpen(false)
      setSearchValue("")
    }
  }

  // Handle Enter key for creating custom values
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && showCreateOption) {
      e.preventDefault()
      handleCreateCustom()
    }
  }

  // Show create option when search value doesn't match any existing option
  const showCreateOption = allowCustom && 
    searchValue.trim() && 
    !options.some(option => 
      option.label.toLowerCase() === searchValue.toLowerCase()
    )

  return (
    <Popover open={open} onOpenChange={setOpen}>
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
      <PopoverContent className="w-full p-0" align="start">
        <Command onKeyDown={handleKeyDown}>
          <CommandInput 
            placeholder={searchPlaceholder}
            value={searchValue}
            onValueChange={setSearchValue}
          />
          <CommandEmpty className="py-2">
            {emptyText}
          </CommandEmpty>
          
          {filteredOptions.length > 0 && (
            <CommandGroup>
              {filteredOptions.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={handleSelect}
                  className="cursor-pointer"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          )}
          
          {showCreateOption && (
            <CommandGroup>
              <CommandItem
                value={searchValue}
                onSelect={handleCreateCustom}
                className="cursor-pointer text-neutral-700 dark:text-neutral-300 bg-neutral-50 dark:bg-neutral-800/50"
              >
                <Plus className="mr-2 h-4 w-4" />
                {customText} "{searchValue}"
              </CommandItem>
            </CommandGroup>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  )
}
