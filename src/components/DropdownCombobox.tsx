import * as React from "react"
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react"

import { cn } from "../lib/utils"
import { Button } from "../components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/popover"

interface DropdownItem {
    id: string;
    name: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}
interface DropdownComboboxProps {
  items: DropdownItem[];
  value?: string;
  onValueChange: (value: string, selectedItem?: DropdownItem) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
}

export function DropdownCombobox({
  items,
  value,
  onValueChange,
  placeholder = "Select an option...",
  searchPlaceholder = "Search...",
  emptyText = "No options found.",
  className = "w-full",
  disabled = false,
  required = false,
}: DropdownComboboxProps) {
  const [open, setOpen] = React.useState(false)

  const selectedItem = items.find((item) => item.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            "justify-between h-auto min-h-[2.5rem]",
            className,
            !value && "text-muted-foreground"
          )}
        >
          <span className="whitespace-normal text-left break-words pr-2">
            {value && selectedItem ? selectedItem.name : placeholder}
            {required && <span className="text-red-500 ml-1">*</span>}
          </span>
          <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn("p-0 bg-white", className)}>
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>{emptyText}</CommandEmpty>
            <CommandGroup>
              {items.map((item) => (
                <CommandItem
                  key={item.id}
                  value={item.name}
                  onSelect={() => {
                    onValueChange(item.id === value ? "" : item.id, item);
                    setOpen(false);
                  }}
                >
                  <CheckIcon
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === item.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {item.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}