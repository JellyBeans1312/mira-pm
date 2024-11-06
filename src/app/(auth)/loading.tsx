'use client';

import { Loader } from "lucide-react";

const LoadingPage = () => {
    return (
        //TODO: Look at adding streaming to loading state and future loading handlers
        <div className="h-screen flex flex-col gap-y-2 items-center justify-center">
            <Loader className="size-6 animate-spin text-muted-foreground"/>
        </div>
    );
};

export default LoadingPage;