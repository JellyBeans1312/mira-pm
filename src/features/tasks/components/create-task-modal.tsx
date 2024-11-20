'use client';

import { ResponsiveModal } from "@/components/responsive-modal";
import { useCreateTaskModal } from "../hooks/use-create-task-modal";
import { CreateTaskFormWrapper } from "./create-task-form-wrapper";

export const CreateTaskModal = () => {
    const { isOpen, close, setIsOpen, initialStatus } = useCreateTaskModal();
    if(!initialStatus) return []
    return (
        <ResponsiveModal open={isOpen} onOpenChange={() => setIsOpen}>
            <CreateTaskFormWrapper initialStatus={initialStatus} onCancel={close}/>
        </ResponsiveModal>
    )
};