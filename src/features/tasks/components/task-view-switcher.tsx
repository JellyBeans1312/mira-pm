'use client';

import { useQueryState } from "nuqs";
import { Loader, PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DottedSeparator } from "@/components/dotted-separator";
import { Tabs, TabsTrigger, TabsList, TabsContent } from "@/components/ui/tabs";


import { useGetTasks } from "@/features/tasks/api/use-get-tasks";
import { DataFilters } from "@/features/tasks/components/data-filters";
import { useTaskFilters } from "@/features/tasks/hooks/use-task-filters";
import { useCreateTaskModal } from "@/features/tasks/hooks/use-create-task-modal";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";

import { DataTable } from "./data-table";
import { columns } from "./columns";
import { DataKanban } from "./data-kanban";
import { DataCalendar } from "./data-calendar";
import { useCallback } from "react";
import { TaskStatus, TaskStatusModal } from "../types";
import { useBulkEditTasks } from "../api/use-bulk-edit-task";
import { useProjectId } from "@/features/projects/hooks/use-project-id";

interface TaskViewSwitcherProps {
    hideProjectFilter?: boolean;
}

export const TaskViewSwitcher = ({ hideProjectFilter}: TaskViewSwitcherProps) => {
    const paramProjectId = useProjectId();

    const [{
        status,
        projectId, 
        assigneeId, 
        dueDate, 
    }] = useTaskFilters();

    const [view, setView] = useQueryState('task-view', {
        defaultValue: 'table'
    });

    const workspaceId = useWorkspaceId();
    const { open: createTask } = useCreateTaskModal();

    const { mutate: bulkEditTasks } = useBulkEditTasks()
    const { 
        data: tasks,
        isLoading: isLoadingTasks
    } = useGetTasks({ 
        workspaceId,
        projectId: paramProjectId || projectId,
        assigneeId,
        status,
        dueDate,
     });

     const onKanbanChange = useCallback((
        tasks: { $id: string; status: TaskStatus; position: number}[]
     ) => {
        bulkEditTasks({ json: { tasks }});
     }, [bulkEditTasks])

    return (
        <Tabs
            defaultValue={view}
            onValueChange={setView}
            className="flex-1 w-full border rounded-lg"
        >
            <div className="h-full flex flex-col overflow-auto p-4">
                <div className="flex flex-col gap-y-2 lg:flex-row justify-between items-center">
                    <TabsList className="w-full lg:w-auto">
                        <TabsTrigger className="h-8 w-full lg:w-auto" value='table'>
                            Table
                        </TabsTrigger>
                        <TabsTrigger className="h-8 w-full lg:w-auto" value='kanban'>
                            Kanban
                        </TabsTrigger>
                        <TabsTrigger className="h-8 w-full lg:w-auto" value='calendar'>
                            Calendar
                        </TabsTrigger>
                    </TabsList>
                    <Button 
                        size={'sm'}    
                        className="w-full lg:w-auto" 
                        onClick={() => createTask(TaskStatusModal.defaultStatus)}
                    >
                        <PlusIcon className="size-4 mr-2" />
                        New
                    </Button>
                </div>
                <DottedSeparator className="my-4"/>
                    <DataFilters hideProjectFilter={hideProjectFilter} />
                <DottedSeparator className="my-4"/>
                {isLoadingTasks ? (
                    <div className="w-full border rounded-lg h-[200px] flex flex-col items-center justify-center">
                        <Loader className="size-5 animate-spin text-muted-foreground"/>
                    </div>
                ) : (
                    <>
                        <TabsContent value="table" className="mt-0">
                            <DataTable columns={columns} data={tasks?.documents || []} />
                        </TabsContent>
                        <TabsContent value="kanban" className="mt-0">
                            <DataKanban onChange={onKanbanChange} data={tasks?.documents || []}/>
                        </TabsContent>
                        <TabsContent value="calendar" className="mt-0 h-full pb-4">
                            <DataCalendar data={tasks?.documents || []}/>
                        </TabsContent>
                    </>
                )}
            </div>
        </Tabs>
    )
};