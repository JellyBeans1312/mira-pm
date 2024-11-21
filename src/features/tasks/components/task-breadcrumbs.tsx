import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRightIcon, TrashIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

import { useDeleteTask } from "../api/use-delete-task";
import { useConfirm } from "@/hooks/use-confirm";

import { Project } from "@/features/projects/types";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";

import { Task } from "../types";

interface TaskBreadcrumbsProps {
    project: Project;
    task: Task;
};

export const TaskBreadcrumbs = ({ project, task }: TaskBreadcrumbsProps) => {
    const workspaceId = useWorkspaceId();
    const router = useRouter();

    const { mutate: deleteTask, isPending } = useDeleteTask();
    const [ConfirmationDialog, confirm] = useConfirm(
        'Are you sure?',
        'You are about to delete a task. This action cannot be undone.',
        'destructive'
    )

    const handleDelete = async () => {
        const ok = await confirm();
        if(!ok) return

        deleteTask({ param: { taskId: task.$id }}, {
            onSuccess: () => {
                router.push(`/workspaces/${workspaceId}/projects/${project.$id}`)
            }
        })
    };

    return (
        <div className="flex items-center gap-x-2">
            <ConfirmationDialog />
            <ProjectAvatar 
                name={project.name}
                image={project.imageUrl}
                className="size-6 lg:size-8"
            />
            <Link href={`/workspaces/${workspaceId}/projects/${project.$id}`}>
                <p className="text-sm lg:text-lg font-semibold text-muted-foreground hover:opacity-75 transition">
                    {project.name}
                </p>
            </Link>
            <ChevronRightIcon className="size-4 lg:size-5 text-muted-foreground"/>
            <p className="text-sm lg:text-lg font-semibold">
                {task.name}
            </p>
            <Button 
                className='ml-auto'
                variant='destructive'
                size='sm'
                onClick={handleDelete}
                disabled={isPending}
            >
                <TrashIcon className="size-4 lg:mr-2"/>
                <span className="hidden lg:block"> Delete Task </span>
            </Button>
        </div>
    )
}