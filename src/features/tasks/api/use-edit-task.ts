import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';

import { toast } from 'sonner';
import { client } from '@/lib/rpc';

type ResponseType = InferResponseType<typeof client.api.tasks[":taskId"]["$patch"], 200>;
type RequestType = InferRequestType<typeof client.api.tasks[":taskId"]["$patch"]>;

export const useEditTask = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation<
        ResponseType,
        Error,
        RequestType
    >({
        mutationFn: async ({ json, param }) => {
            const response = await client.api.tasks[":taskId"]["$patch"]({ json, param });

            if(!response.ok) {
                throw new Error('Failed to update task... Try again later')
            }

            return await response.json();
        },
        onSuccess: ({ data }) => {
            toast.success('You updated the task!');

            queryClient.invalidateQueries({ queryKey: ["tasks"]})
            queryClient.invalidateQueries({ queryKey: ["task", data.$id]})
        },
        onError: () => {
            toast.error('Failed to update task... Try again later');
        }
    });
    return mutation;
};