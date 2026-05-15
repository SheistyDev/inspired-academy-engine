"use client";

import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function BookingCalendar() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [timeslots, setTimeslots] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  // Booking Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

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

  if (bookingSuccess) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-zinc-950 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 w-full max-w-2xl mx-auto text-center space-y-6">
        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
          <svg className="w-10 h-10 text-green-600 dark:text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">Booking Request Received!</h2>
        <p className="text-lg text-zinc-500 dark:text-zinc-400">
          We have received your booking request for {selectedSlot} on {date ? format(date, "MMMM d, yyyy") : ""}. We will be in touch shortly.
        </p>
      </div>
    );
  }

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
            month_grid: "w-full border-collapse space-y-1",
            weekdays: "flex w-full",
            weekday: "text-muted-foreground rounded-md w-full font-medium text-sm pb-4",
            week: "flex w-full mt-2",
            day: "h-14 w-full p-0 font-normal aria-selected:opacity-100 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-lg text-lg transition-colors",
            selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground font-bold shadow-md",
            today: "bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50",
            outside: "text-muted-foreground opacity-50",
            disabled: "text-muted-foreground opacity-30",
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

        {/* Confirmation Section */}
        <div className="mt-8">
          {selectedSlot ? (
            <div className="space-y-4 bg-zinc-50 dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800">
              <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">Your Details</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="(555) 555-5555"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    disabled={isSubmitting}
                  />
                </div>
              </div>
              <Button
                className="w-full h-16 text-xl font-bold rounded-xl shadow-lg hover:shadow-xl transition-all mt-4"
                size="lg"
                disabled={isSubmitting || !name || !email || !phone}
                onClick={async () => {
                  if (selectedSlot && date) {
                    setIsSubmitting(true);
                    try {
                      const formattedDate = format(date, "yyyy-MM-dd");
                      const res = await fetch("/api/bookings/create", {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                          date: formattedDate,
                          timeslot: selectedSlot,
                          name,
                          email,
                          phone,
                        }),
                      });

                      if (!res.ok) {
                        throw new Error("Failed to create booking");
                      }

                      setBookingSuccess(true);
                    } catch (error) {
                      console.error("Booking error:", error);
                      alert("An error occurred while booking. Please try again.");
                    } finally {
                      setIsSubmitting(false);
                    }
                  }
                }}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Submitting...
                  </span>
                ) : (
                  `Confirm Booking for ${selectedSlot}`
                )}
              </Button>
            </div>
          ) : (
            <Button
              className="w-full h-16 text-xl font-bold rounded-xl shadow-lg hover:shadow-xl transition-all opacity-50 cursor-not-allowed"
              size="lg"
              disabled={true}
            >
              Select a time above
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}