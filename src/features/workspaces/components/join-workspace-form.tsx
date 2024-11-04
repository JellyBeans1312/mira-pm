'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { DottedSeparator } from '@/components/dotted-separator';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from '@/components/ui/card';

import { useJoinWorkspace } from '../api/use-join-workspace';
import { useInviteCode } from '../hooks/use-invite-code';
import { useWorkspaceId } from '../hooks/use-workspace-id';

interface JoinWorkspaceFormProps { 
    initialValues: {
        name: string;
    };
};

export const JoinWorkspaceForm = ({ initialValues: { name }}: JoinWorkspaceFormProps) => {
    const { mutate: joinWorkspace, isPending } = useJoinWorkspace();
    const workspaceId = useWorkspaceId();
    const inviteCode = useInviteCode();
    const router = useRouter();

    const onSubmit = () => {
        joinWorkspace({
            param: { workspaceId },
            json: { code: inviteCode }
        }, {
            onSuccess: ({ data }) => {
                router.push(`/workspaces/${data.$id}`);
            },
        });
    };

    return (
        <Card className='w-full h-full border-none shadow-none'>
            <CardHeader className='p-7'>
                <CardTitle className='text-xl font-bold'>
                    Join Workspace
                </CardTitle>
                    <CardDescription>
                        You've been invited to join <strong>{ name }</strong>
                    </CardDescription>
            </CardHeader>
            <div className='px-7'>
                <DottedSeparator />
            </div>
            <CardContent className='p-7'>
                <div className='flex flex-col gap-2 lg:flex-row items-center justify-between'>
                    <Button
                        className='w-full lg:w-fit'
                        size='lg'
                        type='button'
                        onClick={onSubmit}
                        disabled={isPending}
                    >
                        Join workspace
                    </Button>
                    <Button
                        className='w-full lg:w-fit'
                        size='lg'
                        variant='secondary'
                        asChild
                        type='button'
                        disabled={isPending}
                     >
                        <Link href='/'>
                            Cancel
                        </Link>
                    </Button>
                </div>
            </CardContent>
        </Card>  
    )
}