"use client";

import { useState } from "react";
import { CCTVLocation } from "@/stores/cctv-store";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import {
  Shield,
  Copy,
  Activity,
  FileText,
  Check,
  CalendarIcon,
  Camera,
} from "lucide-react";
import { Button, buttonVariants } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";

interface CCTVDetailsProps {
  location: CCTVLocation;
}

export default function CCTVDetails({ location }: CCTVDetailsProps) {
  // Extract coordinates from the array
  const [x, y] = location.coordinates;

  // Determine badge color based on location type
  const getTypeColor = (type: string) => {
    switch (type) {
      case "gas":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200 dark:border-orange-800";
      case "bank":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800";
      case "clothing":
        return "bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-400 border-violet-200 dark:border-violet-800";
      case "ammunation":
        return "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400 border-rose-200 dark:border-rose-800";
      case "phone":
        return "bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-400 border-sky-200 dark:border-sky-800";
      default:
        return "bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-400 border-neutral-200 dark:border-neutral-700";
    }
  };

  const [date, setDate] = useState<DateRange | undefined>();
  const [startTime, setStartTime] = useState("00:00");
  const [endTime, setEndTime] = useState("23:59");
  const [copied, setCopied] = useState(false);

  const handleCopyReport = () => {
    if (!date?.from || !date?.to) return;

    const start = new Date(date.from);
    const [startHours, startMinutes] = startTime.split(":").map(Number);
    start.setHours(startHours, startMinutes);

    const end = new Date(date.to);
    const [endHours, endMinutes] = endTime.split(":").map(Number);
    end.setHours(endHours, endMinutes);

    const formattedStart = format(start, "PPP p");
    const formattedEnd = format(end, "PPP p");

    const template = `/report I am requesting CCTV footage from CCTV ID: ${location.id} with the following timeframe: ${formattedStart} to ${formattedEnd}`;
    navigator.clipboard.writeText(template);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="glass-card border-0 shadow-xl overflow-hidden animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="h-24 bg-linear-to-r from-indigo-500 to-violet-600 relative">
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute -bottom-6 left-6 p-1 bg-white dark:bg-zinc-900 rounded-2xl shadow-lg">
          <div className="bg-neutral-100 dark:bg-zinc-800 p-3 rounded-xl">
            <Camera className="text-indigo-600 dark:text-indigo-400 h-8 w-8" />
          </div>
        </div>
      </div>

      <CardContent className="pt-8 px-6 pb-6 space-y-6">
        {/* Header Info */}
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
              {location.name}
            </h2>
            <div className="flex items-center gap-2 mt-2">
              <Badge
                variant="outline"
                className={`${getTypeColor(location.type)} border`}
              >
                {location.type.toUpperCase()}
              </Badge>
            </div>
          </div>
        </div>

        {location.description && (
          <div className="bg-neutral-50 dark:bg-zinc-800/50 p-4 rounded-xl border border-neutral-100 dark:border-zinc-800">
            <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
              {location.description}
            </p>
          </div>
        )}

        {/* Coordinates Grid - Simplified */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <span className="text-xs text-neutral-400 uppercase tracking-wider font-medium">
              X Coordinate
            </span>
            <div className="p-3 bg-neutral-50 dark:bg-zinc-800/50 rounded-lg border border-neutral-100 dark:border-zinc-800 font-mono text-sm font-medium text-neutral-700 dark:text-neutral-200">
              {x.toFixed(2)}
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-xs text-neutral-400 uppercase tracking-wider font-medium">
              Y Coordinate
            </span>
            <div className="p-3 bg-neutral-50 dark:bg-zinc-800/50 rounded-lg border border-neutral-100 dark:border-zinc-800 font-mono text-sm font-medium text-neutral-700 dark:text-neutral-200">
              {y.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Camera ID Section */}
        <div className="flex items-center justify-between p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-100 dark:border-indigo-800/50">
          <div className="flex items-center gap-3">
            <Activity
              size={20}
              className="text-indigo-600 dark:text-indigo-400"
            />
            <div>
              <p className="text-xs text-indigo-600 dark:text-indigo-300 font-medium uppercase">
                Camera ID
              </p>
              <p className="font-mono font-bold text-indigo-900 dark:text-indigo-100">
                {location.id}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="hover:bg-indigo-100 dark:hover:bg-indigo-800/50 text-indigo-700 dark:text-indigo-300"
            onClick={() => {
              navigator.clipboard.writeText(location.id);
            }}
          >
            <Copy size={16} />
          </Button>
        </div>

        {/* Report Template Generator */}
        <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <FileText size={16} className="text-indigo-500" />
            <h4 className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
              Request Footage
            </h4>
          </div>

          <div className="space-y-3">
            <div className="space-y-1.5">
              <label className="text-xs text-neutral-500 dark:text-neutral-400 font-medium ml-1">
                Select Date Range
              </label>
              <Popover>
                <PopoverTrigger
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "w-full justify-start text-left font-normal bg-neutral-50 dark:bg-zinc-800/50 border-neutral-200 dark:border-zinc-700",
                    !date && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
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
                    <span>Pick a date range</span>
                  )}
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="center">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={date?.from}
                    selected={date}
                    onSelect={setDate}
                    numberOfMonths={2}
                  />
                  <div className="p-3 border-t border-neutral-100 dark:border-neutral-800 grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                        Start Time
                      </label>
                      <input
                        type="time"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        className="w-full text-sm p-1.5 rounded-md border border-neutral-200 dark:border-neutral-800 bg-transparent"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                        End Time
                      </label>
                      <input
                        type="time"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        className="w-full text-sm p-1.5 rounded-md border border-neutral-200 dark:border-neutral-800 bg-transparent"
                      />
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            <Button
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/20 transition-all active:scale-95"
              onClick={handleCopyReport}
              disabled={!date?.from || !date?.to}
            >
              {copied ? (
                <>
                  <Check size={16} className="mr-2" /> Copied to Clipboard
                </>
              ) : (
                <>
                  <Copy size={16} className="mr-2" /> Copy Report Template
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
