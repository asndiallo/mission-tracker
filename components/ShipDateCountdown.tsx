'use client';

import { Card, CardContent } from '@/components/ui/card';
import { daysUntil, formatDate } from '@/lib/utils/dates';
import { useEffect, useState } from 'react';

import { Progress } from '@/components/ui/progress';

interface Props {
  shipDate: string;
}

export function ShipDateCountdown({ shipDate }: Props) {
  const [days, setDays] = useState(0);
  const birthDate = '1998-12-06';

  useEffect(() => {
    setDays(daysUntil(shipDate));
  }, [shipDate]);

  // Calculate progress from birth to ship date
  const totalDays = Math.abs(daysUntil(birthDate));
  const elapsed = totalDays - days;
  const progress = (elapsed / totalDays) * 100;

  return (
    <Card className="mb-8 bg-linear-to-r from-blue-600 to-blue-800 text-white">
      <CardContent className="pt-6">
        <div className="text-center">
          <p className="text-sm opacity-90 mb-1">Ship Date</p>
          <h2 className="text-5xl font-bold mb-2">{days}</h2>
          <p className="text-lg opacity-90 mb-4">
            days until {formatDate(shipDate)}
          </p>
          <Progress value={progress} className="h-2 bg-blue-900" />
          <p className="text-xs opacity-75 mt-2">
            Born {formatDate(birthDate)} • Age: {Math.floor(totalDays / 365)}{' '}
            years
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
