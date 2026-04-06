import { useMemo, useState, useEffect } from "react";
import { CalendarIcon } from "lucide-react";

import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { Input } from "../ui/input";
import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from "../ui/popover";
import { cn } from "@/lib/utils";

function pad2(n: number) {
    return String(n).padStart(2, "0");
}

function toLocalIso(date: Date, time: string) {
    const year = date.getFullYear();
    const month = pad2(date.getMonth() + 1);
    const day  = pad2(date.getDate());
    const hourMinute = time && /^d{2}:\d{2}$/.test(time) ? time : "00:00";
    return `${year}-${month}-${day}T${hourMinute}`;
}

function parseLocalIso(value?: string) : {date: Date | undefined; time: string } {
    if (!value) {
        return { date: undefined, time: "00:00" };
    }
    const [d, t] = value.split("T");
    if (!d) {
        return { date: undefined, time: "00:00" };
    }

    const [year, month, day] = d.split("-").map(Number);
    if (!year || !month || !day) {
        return { date: undefined, time: "00:00"};
    }
    const date = new Date(year, month - 1, day);
    const time = t && /^\d{2}:\d{2}$/.test(t) ? t : "00:00";
    return { date, time };
}

function formatFR(date: Date, time: string) {
    const d = date.toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
    });

    return `${d} ${time}`;
}

type DateTimePickerProps = {
    value?: string;
    onChange: (value: string | undefined) => void;
    disabled?: boolean;
    placeholder?: string;
};

export function DateTimePicker({
    value,
    onChange,
    disabled,
    placeholder = "Choisir une date...",
}: DateTimePickerProps) {
    const parsed = useMemo(() => parseLocalIso(value), [value]);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(parsed.date);
    const [time, setTime] = useState<string>(parsed.time);

    useEffect(() => {
        const p = parseLocalIso(value);
        setSelectedDate(p.date);
        setTime(p.time);
    }, [value]);

    function commit(nextDate: Date | undefined, nextTime: string) {
        if (!nextDate) {
            onChange(undefined);
            return;
        }
        onChange(toLocalIso(nextDate, nextTime));
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    type="button"
                    variant="outline"
                    disabled={disabled}
                    className={cn("w-full justify-start text-left font-normal", !selectedDate && "text-muted-foreground")}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? formatFR(selectedDate, time) : placeholder}
                </Button>
            </PopoverTrigger>

            <PopoverContent className="w-auto p-3" align="start">
                <div className="space-y-3">
                    <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={(d) => {
                            setSelectedDate(d);
                            commit(d, time);
                        }}
                        autoFocus
                    />

                    <div className="flex items-center gap-2">
                        <div className="text-sm text-muted-foreground">Heure</div>
                        <Input
                            type="time"
                            value={time}
                            onChange={(e) => {
                                const t = e.target.value;
                                setTime(t);
                                commit(selectedDate, t);
                            }}
                            disabled={disabled || !selectedDate}
                            className="w-32"
                        />
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => {
                                setSelectedDate(undefined);
                                setTime("00:00");
                                onChange(undefined);
                            }}
                            disabled={disabled}
                        >
                            Effacer
                        </Button>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}