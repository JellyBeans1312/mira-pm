'use client';
import Link from "next/link";

import { ArrowLeft, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

const ErrorPage = () => {
    return (
        <div className="h-screen flex flex-col gap-y-2 items-center justify-center">
            <TriangleAlert />
            <p>Something went wrong</p>
            <Button asChild variant='secondary'>
                <Link href='/'>
                    <ArrowLeft className=""/>
                    Back to home
                </Link>
            </Button>
        </div>
    )
};

export default ErrorPage;