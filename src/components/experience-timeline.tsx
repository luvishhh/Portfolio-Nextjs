// @/components/experience-timeline.tsx
"use client";

import type { ExperienceItem } from '@/types/experience';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Briefcase, CalendarDays, Building } from 'lucide-react';

interface ExperienceTimelineProps {
  experience: ExperienceItem[];
}

export default function ExperienceTimeline({ experience }: ExperienceTimelineProps) {
  if (!experience || experience.length === 0) {
    return <p className="text-center text-muted-foreground">No experience to display at the moment.</p>;
  }

  return (
    <div className="relative pl-10 sm:pl-12 py-4">
      {/* The timeline vertical line */}
      <div className="absolute left-5 sm:left-6 top-0 bottom-0 w-1 -translate-x-1/2 bg-primary/20 rounded-full shadow-inner"></div>

      <div className="space-y-10">
        {experience.map((item, index) => {
          const IconComponent = item.icon || Briefcase;
          return (
            <div
              key={item.id}
              className="relative flex items-start group"
            >
              {/* Icon and Dot on the timeline */}
              <div
                className={cn(
                  "absolute left-5 sm:left-6 top-1 -translate-x-1/2 z-10 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-primary/50"
                )}
              >
                <IconComponent className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>

              {/* Card Content to the right of the timeline */}
              <Card
                className={cn(
                  "ml-6 sm:ml-8 w-full transform transition-all duration-300 ease-out group-hover:shadow-2xl group-hover:-translate-y-1",
                  "bg-card/60 backdrop-blur-md border-primary/25 shadow-xl",
                  "animate-in fade-in-0 slide-in-from-right-10 duration-500"
                )}
                style={{ animationDelay: `${index * 150 + 200}ms` }}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="font-headline text-xl sm:text-2xl text-primary">{item.title}</CardTitle>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-xs sm:text-sm text-muted-foreground mt-1.5">
                    <div className="flex items-center mb-1 sm:mb-0">
                      <Building className="mr-1.5 h-3.5 w-3.5 sm:h-4 sm:w-4 text-accent" />
                      {item.company}
                    </div>
                    <div className="flex items-center">
                      <CalendarDays className="mr-1.5 h-3.5 w-3.5 sm:h-4 sm:w-4 text-accent" />
                      {item.period}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground/80 leading-relaxed text-sm sm:text-base">{item.description}</p>
                </CardContent>
              </Card>
            </div>
          );
        })}
      </div>
    </div>
  );
}
