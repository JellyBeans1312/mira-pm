'use client';

import Link from 'next/link';
import { ArrowLeftIcon, MoreVerticalIcon } from 'lucide-react';
import { Fragment } from 'react';

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { DottedSeparator } from '@/components/dotted-separator';

import { useWorkspaceId } from '../../workspaces/hooks/use-workspace-id';
import { useGetMembers } from '@/features/members/api/use-get-members';
import { MemberAvatar } from '@/features/members/components/members-avatar';
import { Separator } from '@/components/ui/separator';
import { useDeleteMember } from '../api/use-delete-member';
import { useUpdateMember } from '../api/use-update-member';
import { MemberRole } from '../types';
import { useConfirm } from '@/hooks/use-confirm';

export const MembersList = () => {
    const workspaceId = useWorkspaceId();
    
    const { data } = useGetMembers({ workspaceId });
    const { mutate: deleteMember, isPending: isDeletingMember } = useDeleteMember();
    const { mutate: updateMember, isPending: isUpdatingMember } = useUpdateMember();

    const isPending = isDeletingMember || isUpdatingMember

    const [RemoveMemberDialog, confirm] = useConfirm(
        'Remove Member?',
        'This member will be removed from the workspace',
        'destructive'
    );

    const handleUpdateMember = (memberId: string, role: MemberRole) => {
        updateMember({
            json: { role },
            param: { memberId },
        });
    };

    const handleDeleteMember = async (memberId: string)  => {
        const ok = await confirm();
        if(!ok) return;

        deleteMember({
            param: { memberId },
        });
    };

    return (
        <Card className='w-full h-full border-none shadow-none'>
            <RemoveMemberDialog />
            <CardHeader className='flex flex-row items-center gap-x-4 p-7 space-y-0'>
                <Button variant='secondary' size={'sm'} asChild>
                    <Link href={`/workspaces/${workspaceId}`}>
                        <ArrowLeftIcon className='size-4 mr-2'/>
                        Back
                    </Link>
                </Button>
                <CardTitle className='text-xl font-bold'>
                    Members List
                </CardTitle>
            </CardHeader>
            <div className='px-7'>
                <DottedSeparator />
                <CardContent className='p-7'>
                    {data?.documents.map((member, index) => (
                        <Fragment key={member.$id}>
                            <div className='flex items-center gap-2'>
                                <MemberAvatar
                                    className='size-10'
                                    fallbackClassName='text-lg'
                                    name={member.name}
                                />
                                <div className='flex flex-col'>
                                    <p className="text-sm font-medium">{member.name}</p>
                                    <p className="text-xs text-muted-foreground">{member.email}</p>
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            className='ml-auto'
                                            variant='secondary'
                                            size='icon'
                                            disabled={isPending}
                                            >
                                        <MoreVerticalIcon  className='size-4 text-muted-foreground'/>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent side='bottom' align='end'>
                                        <DropdownMenuItem className='font-medium' onClick={() => handleUpdateMember(member.$id, MemberRole.ADMIN)} disabled={false}>
                                            Set as Administrator
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className='font-medium' onClick={() => handleUpdateMember(member.$id, MemberRole.MEMBER)} disabled={false}>
                                            Set as Member
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className='font-medium text-amber-700' onClick={() => handleDeleteMember(member.$id)} disabled={false}>
                                            Remove {member.name}
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                            {index < data?.documents.length -1 && <Separator className='my-2.5'/>}
                        </Fragment>
                    ))}
                </CardContent>
            </div>
        </Card>
    );
};