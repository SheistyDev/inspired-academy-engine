"use client";

import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";

export function BookingCalendar() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [timeslots, setTimeslots] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTimeslots() {
      if (!date) {
        setTimeslots([]);
        return;
      }
      setLoading(true);
      setSelectedSlot(null);
      try {
        const formattedDate = format(date, "yyyy-MM-dd");
        const res = await fetch(`/api/availability?date=${formattedDate}`);
        if (!res.ok) {
          throw new Error("Failed to fetch timeslots");
        }
        const data = await res.json();
        setTimeslots(data.timeslots || []);
      } catch (error) {
        console.error("Error fetching timeslots:", error);
        setTimeslots([]);
      } finally {
        setLoading(false);
      }
    }

    fetchTimeslots();
  }, [date]);

  return (
    <div className="flex flex-col lg:flex-row gap-8 p-6 lg:p-10 bg-white dark:bg-zinc-950 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 w-full max-w-6xl mx-auto">
      {/* Calendar Section */}
      <div className="w-full lg:w-1/2">
        <h2 className="text-2xl font-bold mb-6 text-zinc-900 dark:text-zinc-50">Select a Date</h2>
        {/* We use classNames to override the default squished 9x9 tailwind sizes in Shadcn */}
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 w-full shadow-sm bg-zinc-50 dark:bg-zinc-900"
          classNames={{
            months: "w-full",
            month: "w-full space-y-4",
            table: "w-full border-collapse space-y-1",
            head_row: "flex w-full",
            head_cell: "text-muted-foreground rounded-md w-full font-medium text-sm pb-4",
            row: "flex w-full mt-2",
            cell: "text-center text-sm p-0 relative focus-within:relative focus-within:z-20 w-full",
            day: "h-14 w-full p-0 font-normal aria-selected:opacity-100 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-lg text-lg transition-colors",
            day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground font-bold shadow-md",
            day_today: "bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50",
            day_outside: "text-muted-foreground opacity-50",
            day_disabled: "text-muted-foreground opacity-30",
          }}
          disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
        />
      </div>

      {/* Timeslots Section */}
      <div className="w-full lg:w-1/2 flex flex-col">
        <h2 className="text-2xl font-bold mb-6 text-zinc-900 dark:text-zinc-50">
          Available Times for {date ? format(date, "MMMM d, yyyy") : "..."}
        </h2>

        <div className="flex-1 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 bg-zinc-50 dark:bg-zinc-900 shadow-sm min-h-[400px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full gap-4">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              <p className="text-zinc-500 font-medium animate-pulse">Loading available times...</p>
            </div>
          ) : !date ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-zinc-500 font-medium">Please select a date on the calendar.</p>
            </div>
          ) : timeslots.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-zinc-500 font-medium">No timeslots available for this date.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 max-h-[450px] overflow-y-auto pr-2 custom-scrollbar">
              {timeslots.map((slot) => (
                <Button
                  key={slot}
                  variant={selectedSlot === slot ? "default" : "outline"}
                  onClick={() => setSelectedSlot(slot)}
                  className={`h-16 text-lg rounded-xl transition-all ${selectedSlot === slot
                    ? "shadow-md scale-[1.02] ring-2 ring-primary ring-offset-2 dark:ring-offset-zinc-950"
                    : "hover:border-primary/50"
                    }`}
                >
                  {slot}
                </Button>
              ))}
            </div>
          )}
        </div>

        {/* Confirmation Button */}
        <div className="mt-8">
          <Button
            className="w-full h-16 text-xl font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
            size="lg"
            disabled={!selectedSlot}
            onClick={() => {
              if (selectedSlot) {
                // Future Stripe Integration
                alert(`Redirecting to checkout for ${format(date!, "MMM d")} at ${selectedSlot}`);
              }
            }}
          >
            {selectedSlot ? `Confirm Booking for ${selectedSlot}` : "Select a time above"}
          </Button>
        </div>
      </div>
    </div>
  );
}