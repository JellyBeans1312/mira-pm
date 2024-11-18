'use client';

import { ArrowUpDown, MoreVertical } from 'lucide-react';

import { ColumnDef } from '@tanstack/react-table';
import { snakeCaseToTitle } from '@/lib/utils';
import { Task } from '../types';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

import { ProjectAvatar } from '@/features/projects/components/project-avatar';
import { MemberAvatar } from '@/features/members/components/members-avatar';

import { TaskActions } from './task-actions';
import { TaskDate } from './task-date';


export const columns: ColumnDef<Task>[] = [
    {
        accessorKey: "name",
        header: ({ column }) => {
            return (
                <Button
                  variant="ghost"
                  onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                  Task Name
                  <ArrowUpDown className="ml-1 size-4" />
                </Button>
              )
        },
        cell: ({ row }) => {
            const name = row.original.name;

            return <p className='line-clamp-1'>{name}</p>
        }
    },
    {
        accessorKey: 'project',
        header: ({ column }) => {
            return (
                <Button
                  variant="ghost"
                  onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                  Project
                  <ArrowUpDown className="ml-1 size-4" />
                </Button>
              )
        },
        cell: ({ row }) => {
            const project = row.original.project;

            return (
                <div className='flex items-center gap-x-2 font-medium text-sm'>
                    <ProjectAvatar name={project.name} className='size-6' image={project.imageUrl} />
                    <p className='line-clamp-1'>{project.name}</p>
                </div>
            )
        }
    },
    {
        accessorKey: 'assignee',
        header: ({ column }) => {
            return (
                <Button
                  variant="ghost"
                  onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                  Assignee
                  <ArrowUpDown className="ml-1 size-4" />
                </Button>
              )
        },
        cell: ({ row }) => {
            const assignee = row.original.assignee;

            return (
                <div className='flex items-center gap-x-2 font-medium text-sm'>
                    <MemberAvatar name={assignee.name} className='size-6' fallbackClassName='text-xs' />
                    <p className='line-clamp-1'>{assignee.name}</p>
                </div>
            )
        }
    },
    {
        accessorKey: 'dueDate',
        header: ({ column }) => {
            return (
                <Button
                  variant="ghost"
                  onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                  Due Date
                  <ArrowUpDown className="ml-1 size-4" />
                </Button>
              )
        },
        cell: ({ row }) => {
            const dueDate = row.original.dueDate;

            return <TaskDate value={dueDate} />
        }
    },
    {
        accessorKey: 'status',
        header: ({ column }) => {
            return (
                <Button
                  variant="ghost"
                  onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                  Status
                  <ArrowUpDown className="ml-1 size-4" />
                </Button>
              )
        },
        cell: ({ row }) => {
            const status = row.original.status;
            const formattedStatus = snakeCaseToTitle(status)
            
            return <Badge variant={status}>{formattedStatus}</Badge>
        }
    },
    {
        id: 'actions',
        
        cell: ({ row }) => {
            const id = row.original.$id;
            const projectId = row.original.projectId;
            return (
                <TaskActions id={id} projectId={projectId}>
                    <Button variant='ghost' className='size-8 p-0'>
                        <MoreVertical className='size-4' />
                    </Button>
                </TaskActions>
            )
        }
    },
];