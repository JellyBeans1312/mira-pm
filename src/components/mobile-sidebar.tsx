"use client";
import { useState, useEffect } from 'react';
import { MenuIcon } from 'lucide-react';
import { usePathname } from 'next/navigation';

import { 
    Sheet,
    SheetContent, 
    SheetTrigger
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Sidebar } from '@/components/sidebar';

export const MobileSidebar = () => {
    const [ isOpen, setIsOpen ] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        setIsOpen(false)
    }, [pathname]);

    return (
        <Sheet modal={true} open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                <Button
                    variant={'secondary'}
                    className='lg:hidden'
                > 
                    <MenuIcon  className='size-4 text-neutral-500'/>
                </Button>
            </SheetTrigger>
            <SheetContent side={'left'} className='p-0'>
                <Sidebar/>
            </SheetContent>
        </Sheet>
    )
}