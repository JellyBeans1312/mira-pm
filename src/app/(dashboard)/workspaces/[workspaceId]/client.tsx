'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { PlusIcon, CalendarIcon, SettingsIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Analytics } from "@/components/analytics";
import { PageError } from "@/components/page-error";
import { PageLoader } from "@/components/page-loader";
import { Card, CardContent } from '@/components/ui/card';
import { DottedSeparator } from "@/components/dotted-separator";

import { useGetTasks } from "@/features/tasks/api/use-get-tasks";
import { useGetMembers } from "@/features/members/api/use-get-members";
import { useGetProjects } from "@/features/projects/api/use-get-projects";
import { useGetWorkspaceAnalytics } from "@/features/workspaces/api/use-get-workspace-analytics";

import { useCreateProjectModal } from "@/features/projects/hooks/use-create-project-modal";
import { useCreateTaskModal } from "@/features/tasks/hooks/use-create-task-modal";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";

import { Task, TaskStatus, TaskStatusModal } from "@/features/tasks/types";
import { Project } from '@/features/projects/types';
import { ProjectAvatar } from '@/features/projects/components/project-avatar';
import { Member } from '@/features/members/types';
import { MemberAvatar } from '@/features/members/components/members-avatar';

export const WorkspaceIdClient = () => {
    const workspaceId = useWorkspaceId();
    const { data: workspaceAnalytics, isLoading: isLoadingAnalytics } = useGetWorkspaceAnalytics({ workspaceId });
    const { data: tasks, isLoading: isLoadingTasks } = useGetTasks({ workspaceId });
    const { data: projects, isLoading: isLoadingProjects } = useGetProjects({ workspaceId });
    const { data: members, isLoading: isLoadingMembers } = useGetMembers({ workspaceId });

    const isLoading = 
        isLoadingAnalytics ||
        isLoadingTasks ||
        isLoadingProjects ||
        isLoadingMembers;


    if(isLoading) return <PageLoader />

    if(!workspaceAnalytics || !tasks || !projects || !members) return <PageError message="Failed to load workspace data"/>
    return (
        <div className="h-full flex flex-col space-y-4">
            <Analytics data={workspaceAnalytics} />
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                <TaskList tasks={tasks?.documents || []} total={tasks.total}/>
                <ProjectList projects={projects?.documents || []} total={projects.total} />
                <MembersList members={members?.documents || []} total={members.total} />
            </div>
        </div>
    )
};

const statusColorMap: Record<TaskStatus, string> = {
    [TaskStatus.BACKLOG]: 'border-l-pink-500',
    [TaskStatus.TODO]: 'border-l-red-500',
    [TaskStatus.IN_PROGRESS]: 'border-l-yellow-500',
    [TaskStatus.IN_REVIEW]: 'border-l-blue-500',
    [TaskStatus.DONE]: 'border-l-emerald-500',
};

interface TaskListProps {
    tasks: Task[];
    total: number;
}

export const TaskList = ({ tasks, total }: TaskListProps) => {
    const workspaceId = useWorkspaceId();
    const { open: createTask } = useCreateTaskModal();
    return (
        <div className="flex flex-col gap-y-4 col-span-1">
            <div className="bg-muted rounded-lg p-4">
                <div className="flex items-center justify-between">
                    <p className="text-lg font-semibold">
                        Tasks ({total})
                    </p>
                    <Button
                        variant='muted'
                        size='icon'
                        onClick={() => createTask(TaskStatusModal.defaultStatus)}
                    >
                        <PlusIcon className='size-4 text-neutral-400' />
                    </Button>
                </div>
                <DottedSeparator className="my-4"/>
                <ul className='flex flex-col gap-y-4 '>
                    {tasks.map((task) => (
                        <li key={task.$id}>
                            <Link href={`/workspaces/${workspaceId}/tasks/${task.$id}`}>
                                <Card className={cn(
                                    statusColorMap[task.status],
                                    'shadow-none rounded-lg border-l-4 hover:opacity-75 transition'
                                )}>
                                    <CardContent className='p-4'>
                                        <p className='text-lg font-medium truncate'>{task.name}</p>
                                        <div className='flex items-center gap-x-2'>
                                            <p>{task.project?.name}</p>
                                            <div className='size-1 rounded-full bg-neutral-300'/>
                                            <div className='text-sm text-muted-foreground'>
                                                <CalendarIcon className='size-3 mr-1'/>
                                                <span className='truncate'>{formatDistanceToNow(new Date(task.dueDate))}</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        </li>
                    ))}
                    <li className='text-sm text-muted-foreground text-center hidden first-of-type:block'>
                        No tasks found
                    </li>
                </ul>
                <Button 
                    asChild
                    variant='muted'
                    className='mt-4 w-full'
                >
                    <Link href={`/workspaces/${workspaceId}/tasks`}>
                        Show All
                    </Link>
                </Button>
            </div>
        </div>
    )
}

interface ProjectListProps {
    projects: Project[];
    total: number;
}

export const ProjectList = ({ projects, total }: ProjectListProps) => {
    const workspaceId = useWorkspaceId();
    const { open: createProject } = useCreateProjectModal();
    return (
        <div className="flex flex-col gap-y-4 col-span-1">
            <div className="bg-white border rounded-lg p-4">
                <div className="flex items-center justify-between">
                    <p className="text-lg font-semibold">
                        Projects ({total})
                    </p>
                    <Button
                        variant='secondary'
                        size='icon'
                        onClick={createProject}
                    >
                        <PlusIcon className='size-4 text-neutral-400' />
                    </Button>
                </div>
                <DottedSeparator className="my-4"/>
                <ul className='grid grid-cols-1 lg:grid-cols-2 gap-4 '>
                    {projects.map((project) => (
                        <li key={project.$id}>
                            <Link href={`/workspaces/${workspaceId}/projects/${project.$id}`}>
                                <Card className='shadow-none rounded-lg border-l-4 hover:opacity-75 transition'>
                                    <CardContent className='flex items-center gap-x-2.5 p-4'>
                                        <ProjectAvatar name={project.name} image={project.imageUrl} className='size-12' fallbackClassName='text-lg'/>
                                        <p className='text-lg font-medium truncate'>{project.name}</p>
                                    </CardContent>
                                </Card>
                            </Link>
                        </li>
                    ))}
                    <li className='text-sm text-muted-foreground text-center hidden first-of-type:block'>
                        No projects found
                    </li>
                </ul>
            </div>
        </div>
    )
}

interface MembersListProps {
    members: Member[];
    total: number;
}

export const MembersList = ({ members, total }: MembersListProps) => {
    const workspaceId = useWorkspaceId();
    return (
        <div className="flex flex-col gap-y-4 col-span-1">
            <div className="bg-white border rounded-lg p-4">
                <div className="flex items-center justify-between">
                    <p className="text-lg font-semibold">
                        Members ({total})
                    </p>
                    <Button
                        asChild
                        variant='secondary'
                        size='icon'
                    >
                        <Link href={`/workspaces/${workspaceId}/members`}>
                            <SettingsIcon className='size-4 text-neutral-400' />
                        </Link>
                    </Button>
                </div>
                <DottedSeparator className="my-4"/>
                <ul className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 '>
                    {members.map((member) => (
                        <li key={member.$id}>
                                <Card className='shadow-none rounded-lg border-l-4 overflow-hidden'>
                                    <CardContent className='p-3 flex flex-col items-center gap-x-2'>
                                        <MemberAvatar name={member.name} className='size-12' fallbackClassName='text-lg'/>
                                        <div className='flex flex-col items-center overflow-hidden'>
                                            <p className='text-lg font-medium line-clamp-1'>{member.name}</p>
                                            <p className='text-sm text-muted-foreground line-clamp-1'>{member.email}</p>

                                        </div>
                                    </CardContent>
                                </Card>
                        </li>
                    ))}
                    <li className='text-sm text-muted-foreground text-center hidden first-of-type:block'>
                        No members found
                    </li>
                </ul>
            </div>
        </div>
    )
}