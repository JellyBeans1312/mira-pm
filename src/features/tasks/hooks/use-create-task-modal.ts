import { parseAsBoolean, useQueryStates, parseAsStringEnum } from 'nuqs';
import { TaskStatusModal, TaskStatus } from '../types';

export const useCreateTaskModal = () => {
    const [{ isOpen, initialStatus }, setIsOpen] = useQueryStates({
        isOpen: parseAsBoolean.withDefault(false).withOptions({ clearOnDefault: true }),
        initialStatus: parseAsStringEnum<TaskStatus | TaskStatusModal.defaultStatus>(Object.values(TaskStatus)).withDefault(TaskStatusModal.defaultStatus)
    });

    const open = (initialStatus: TaskStatus | TaskStatusModal.defaultStatus) =>  setIsOpen({isOpen: true,  initialStatus });
    const close = () =>  setIsOpen({ isOpen: false, initialStatus: TaskStatusModal.defaultStatus });
    
    return {
        isOpen,
        open,
        close,
        setIsOpen,
        initialStatus
    };
};