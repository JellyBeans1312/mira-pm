import { parseAsBoolean, useQueryStates, parseAsString, parseAsStringEnum } from 'nuqs';
import { TaskStatus } from '../types';

export const useCreateTaskModal = () => {
    const [{ isOpen, initialStatus }, setIsOpen] = useQueryStates({
        isOpen: parseAsBoolean.withDefault(false).withOptions({ clearOnDefault: true }),
        initialStatus: parseAsStringEnum<TaskStatus>(Object.values(TaskStatus))
    });

    const open = (initialStatus: TaskStatus) =>  setIsOpen({isOpen: true, initialStatus});
    const close = () =>  setIsOpen({ isOpen: false });
    return {
        isOpen,
        open,
        close,
        setIsOpen,
        initialStatus
    };
};