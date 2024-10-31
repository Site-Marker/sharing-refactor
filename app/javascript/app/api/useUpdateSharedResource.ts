import { SharedResource } from "@/models";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postHeaders } from "./helpers";

export default function useUpdateSharedResource(shared_resource_id?: number | string, shareable_type?: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (new_shared_resource: SharedResource) => {
            const response = await fetch(`/shared_resources/${shareable_type}/${shared_resource_id}/${new_shared_resource.user_id}`, {
                method: 'PUT',
                headers: postHeaders(),
                body: JSON.stringify({ shared_resource: new_shared_resource }),
            });

            if (!response.ok) {
                throw new Error('Failed to update report');
            }

            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['shared_resources', shared_resource_id] })
        },
    })
}