'use client';

import { useGetTask } from "@/features/tasks/api/use-get-task";
import { useTaskId } from "@/features/tasks/hooks/use-task-id";
import { TaskBreadcrumbs } from "@/features/tasks/components/task-breadcrumbs";
import { TaskDescription } from "@/features/tasks/components/task-description";
import { TaskOverview } from "@/features/tasks/components/task-overview";

import { PageLoader } from "@/components/page-loader";
import { PageError } from "@/components/page-error";
import { DottedSeparator } from "@/components/dotted-separator";


export const TaskIdClient = () => {
    const taskId = useTaskId();
    const { data: task, isLoading } = useGetTask({ taskId });

    if(isLoading) {
        return <PageLoader />
    };

    if(!task) {
        return <PageError message="Task not found"/>
    }

    return (
        <div className="flex flex-col">
            <TaskBreadcrumbs project={task.project} task={task} />
            <DottedSeparator className="my-6" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <TaskOverview task={task} />
                <TaskDescription task={task} />
            </div>
        </div>
    )
};