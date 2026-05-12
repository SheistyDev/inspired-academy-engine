"use client";

import React, { useState } from "react";

export const BookingCalendar: React.FC = () => {
  const [date, setDate] = useState<Date | null>(new Date());

  return (
    <div className="p-6 bg-white dark:bg-zinc-900 rounded-xl shadow-lg border border-zinc-200 dark:border-zinc-800">
      <h2 className="text-2xl font-bold mb-4 text-zinc-900 dark:text-zinc-50">Agency Booking Calendar</h2>
      <div className="flex flex-col gap-4">
        <p className="text-zinc-600 dark:text-zinc-400">
          Manage your agency bookings here.
        </p>
        {/* Placeholder for actual calendar integration */}
        <div className="h-64 flex items-center justify-center border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-lg">
          <span className="text-zinc-400">Calendar Widget Placeholder</span>
        </div>
        <button 
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors font-medium shadow-md hover:shadow-lg active:scale-95"
          onClick={() => alert("Booking functionality coming soon!")}
        >
          Book Now
        </button>
      </div>
    </div>
  );
};

export default BookingCalendar;
