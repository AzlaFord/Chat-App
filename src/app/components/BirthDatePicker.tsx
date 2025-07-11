"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"

type Props = {
  value?: Date
  onChange?: (date: Date | undefined) => void
}

export function BirthDatePicker({ value, onChange }: Props) {
  const [step, setStep] = React.useState<"day" | "month" | "year">("day")

  const [selectedDay, setSelectedDay] = React.useState<Date | undefined>(value)
  const [selectedMonth, setSelectedMonth] = React.useState<number | undefined>(
    value ? value.getMonth() : undefined
  )
  const [selectedYear, setSelectedYear] = React.useState<number | undefined>(
    value ? value.getFullYear() : undefined
  )

  // Dacă toate sunt selectate, construiește data finală și anunță parent
  React.useEffect(() => {
    if (
      selectedDay !== undefined &&
      selectedMonth !== undefined &&
      selectedYear !== undefined
    ) {
      // Construiește data cu ziua din selectedDay, luna și anul selectate
      const finalDate = new Date(
        selectedYear,
        selectedMonth,
        selectedDay.getDate()
      )
      onChange?.(finalDate)
    }
  }, [selectedDay, selectedMonth, selectedYear, onChange])

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const years = React.useMemo(() => {
    const currentYear = new Date().getFullYear()
    const arr = []
    for (let y = currentYear; y >= 1900; y--) {
      arr.push(y)
    }
    return arr
  }, [])

  const formattedDate =
    selectedDay && selectedMonth !== undefined && selectedYear !== undefined
      ? format(new Date(selectedYear, selectedMonth, selectedDay.getDate()), "dd/MM/yyyy")
      : ""

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          data-empty={!formattedDate}
          className="data-[empty=true]:text-muted-foreground w-[333px] justify-start text-left font-normal"
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {formattedDate || <span>Select your birth date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4">
        {step === "day" && (
          <>
            <Calendar
              mode="single"
              selected={selectedDay}
              onSelect={(date) => {
                if (!date || date > new Date()) return
                setSelectedDay(date)
                setStep("month")
              }}
              disabled={(date) => date > new Date()}
            />
            <Button
              variant="ghost"
              className="mt-2"
              onClick={() => setStep("month")}
              disabled={!selectedDay}
            >
              Next: Select Month
            </Button>
          </>
        )}

        {step === "month" && (
          <>
            <div className="grid grid-cols-3 gap-2">
              {months.map((monthName, index) => (
                <Button
                  key={monthName}
                  variant={selectedMonth === index ? "default" : "outline"}
                  onClick={() => {
                    setSelectedMonth(index)
                    setStep("year")
                  }}
                >
                  {monthName}
                </Button>
              ))}
            </div>
            <Button
              variant="ghost"
              className="mt-2"
              onClick={() => setStep("day")}
            >
              Back: Select Day
            </Button>
          </>
        )}

        {step === "year" && (
          <>
            <div className="max-h-48 overflow-auto grid grid-cols-3 gap-2">
              {years.map((year) => (
                <Button
                  key={year}
                  variant={selectedYear === year ? "default" : "outline"}
                  onClick={() => {
                    setSelectedYear(year)
                    setStep("day")
                  }}
                >
                  {year}
                </Button>
              ))}
            </div>
            <Button
              variant="ghost"
              className="mt-2"
              onClick={() => setStep("month")}
            >
              Back: Select Month
            </Button>
          </>
        )}
      </PopoverContent>
    </Popover>
  )
}
