"use client";

import { Card, CardContent } from "@/components/ui/card";
import { daysUntil, formatDate } from "@/lib/utils/dates";
import { differenceInYears, parseISO } from "date-fns";
import { useEffect, useState } from "react";

import { Progress } from "@/components/ui/progress";

interface Props {
  shipDate: string;
}

export function ShipDateCountdown({ shipDate }: Props) {
  const [mounted, setMounted] = useState(false);
  const [days, setDays] = useState(0);
  const birthDate = "1998-12-06";

  useEffect(() => {
    setMounted(true);
    setDays(daysUntil(shipDate));
  }, [shipDate]);

  // Don't render anything until mounted (prevents hydration mismatch)
  if (!mounted) {
    return (
      <Card className="mb-8 bg-linear-to-r from-blue-600 to-blue-800 text-white">
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="h-48 flex items-center justify-center">
              <div className="text-lg opacity-75">Loading...</div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calculate current age
  const currentAge = differenceInYears(new Date(), parseISO(birthDate));
  const ageAtShip = differenceInYears(parseISO(shipDate), parseISO(birthDate));

  // Calculate progress from birth to ship date
  const totalDays = Math.abs(daysUntil(birthDate));
  const elapsed = totalDays - days;
  const progress = Math.min((elapsed / totalDays) * 100, 100);

  return (
    <Card className="mb-8 bg-linear-to-r from-blue-600 to-blue-800 text-white">
      <CardContent className="pt-6">
        <div className="text-center">
          <div className="mb-4">
            <p className="text-sm opacity-90 mb-1">Current Age</p>
            <p className="text-2xl font-bold">{currentAge} years old</p>
          </div>

          <div className="border-t border-blue-500 my-4"></div>

          <p className="text-sm opacity-90 mb-1">Ship Date</p>
          <h2 className="text-5xl font-bold mb-2">{days}</h2>
          <p className="text-lg opacity-90 mb-4">
            days until {formatDate(shipDate)}
          </p>
          <p className="text-sm opacity-90 mb-4">
            I'll be {ageAtShip} years old when I ship
          </p>

          <Progress value={progress} className="h-2 bg-blue-900" />

          <div className="mt-4 text-xs opacity-75">
            <p>Born {formatDate(birthDate)}</p>
            <p className="mt-1">
              By 2036 (age 37-38): Financial Independence | $60-90k/year passive
              income
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
