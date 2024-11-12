'use client';
import * as React from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';

import {
    Popover,
    PopoverTrigger,
    PopoverContent
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';

import { cn } from '@/lib/utils';

interface DatePickerProps {
    value: Date | undefined;
    onChange: (date: Date) => void;
    className?: string;
    placeholder?: string;
};

export const DatePicker = ({
    value,
    onChange,
    className,
    placeholder = 'Select Date'
}: DatePickerProps) => {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant='outline'
                    size='lg'
                    className={cn(
                        'w-full justify-start text-left font-normal px-3',
                        !value && 'text-muted-foreground',
                        className
                    )}
                >
                    <CalendarIcon className='mr-2 size-4' />
                    {value ? format(value, 'PPP') : <span>{placeholder}</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent>
                <Calendar 
                    mode='single'
                    selected={value}
                    onSelect={(date) => onChange(date as Date)}
                    initialFocus
                />
            </PopoverContent>
        </Popover>
    )
}