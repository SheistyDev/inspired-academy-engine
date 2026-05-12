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
    <div className="flex flex-col md:flex-row gap-8 p-6 bg-card rounded-lg shadow-sm border max-w-4xl mx-auto">
      <div className="flex-1">
        <h2 className="text-xl font-semibold mb-4">Select a Date</h2>
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border p-3"
          disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
        />
      </div>

      <div className="flex-1 flex flex-col">
        <h2 className="text-xl font-semibold mb-4">
          Available Times for {date ? format(date, "MMMM d, yyyy") : "..."}
        </h2>

        <div className="flex-1 border rounded-md p-4 bg-muted/20">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground animate-pulse">Loading timeslots...</p>
            </div>
          ) : !date ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">Please select a date first.</p>
            </div>
          ) : timeslots.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">No timeslots available for this date.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-2">
              {timeslots.map((slot) => (
                <Button
                  key={slot}
                  variant={selectedSlot === slot ? "default" : "outline"}
                  onClick={() => setSelectedSlot(slot)}
                  className="w-full"
                >
                  {slot}
                </Button>
              ))}
            </div>
          )}
        </div>

        {selectedSlot && (
          <div className="mt-6">
            <Button className="w-full" size="lg">
              Confirm Booking for {selectedSlot}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
