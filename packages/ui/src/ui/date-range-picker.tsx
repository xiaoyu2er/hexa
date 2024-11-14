"use client"
// https://github.com/sadmann7/shadcn-table/blob/main/src/components/date-range-picker.tsx
import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { type DateRange } from "react-day-picker"

import { cn } from "@hexa/utils"
import { Button, type ButtonProps } from "@hexa/ui/button"
import { Calendar } from "@hexa/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@hexa/ui/popover"
import { useState } from "react"

interface DateRangePickerProps
  extends React.ComponentPropsWithoutRef<typeof PopoverContent> {
  /**
   * The selected date range.
   * @default undefined
   * @type DateRange
   * @example { from: new Date(), to: new Date() }
   */
  defaultDateRange?: DateRange

  /**
   * The placeholder text of the calendar trigger button.
   * @default "Pick a date"
   * @type string | undefined
   */
  placeholder?: string

  /**
   * The variant of the calendar trigger button.
   * @default "outline"
   * @type "default" | "outline" | "secondary" | "ghost"
   */
  triggerVariant?: Exclude<ButtonProps["variant"], "destructive" | "link">

  /**
   * The size of the calendar trigger button.
   * @default "default"
   * @type "default" | "sm" | "lg"
   */
  triggerSize?: Exclude<ButtonProps["size"], "icon">

  /**
   * The class name of the calendar trigger button.
   * @default undefined
   * @type string
   */
  triggerClassName?: string

  /**
   * Controls whether query states are updated client-side only (default: true).
   * Setting to `false` triggers a network request to update the querystring.
   * @default true
   */
  shallow?: boolean
}

export function DateRangePicker({
  defaultDateRange,
  placeholder = "Pick a date",
  triggerVariant = "outline",
  triggerSize = "default",
  triggerClassName,
  shallow = true,
  className,
  ...props
}: DateRangePickerProps) {
  const [date, setDate] = useState({from: defaultDateRange?.from , to: defaultDateRange?.to })

  

  return (
    <div className="grid gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={triggerVariant}
            size={triggerSize}
            className={cn(
              "w-full justify-start gap-2 truncate text-left font-normal",
              !date && "text-muted-foreground",
              triggerClassName
            )}
          >
            <CalendarIcon className="size-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>{placeholder}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className={cn("w-auto p-0", className)} {...props}>
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={(newDateRange) => {
              void setDate({
                from: newDateRange?.from,
                to: newDateRange?.to,
              })
            }}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}