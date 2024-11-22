'use client';

import { ResponsiveModal } from "@/components/responsive-modal";
import { useCreateTaskModal } from "../hooks/use-create-task-modal";
import { CreateTaskFormWrapper } from "./create-task-form-wrapper";
import { TaskStatusModal } from "../types";

export const CreateTaskModal = () => {
    const { isOpen, close, setIsOpen, initialStatus } = useCreateTaskModal();

    return (
        <ResponsiveModal open={isOpen} onOpenChange={() => setIsOpen}>
            <CreateTaskFormWrapper initialStatus={initialStatus || TaskStatusModal.defaultStatus} onCancel={close}/>
        </ResponsiveModal>
    )
};