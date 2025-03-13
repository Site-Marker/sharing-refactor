import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postHeaders } from "./helpers";
import { SharingPermission } from "@/models/SharingPermission";



export default function useShareResource(resourceType: SharingPermission['resource_type'], cb?: () => void) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (newSharingPermission: SharingPermission) => {
            const response = await fetch('/sharing_permission', {
                method: 'POST',
                headers: postHeaders(),
                body: JSON.stringify({ sharing_permission: newSharingPermission }),
            });

            if (!response.ok) {
                throw new Error('Failed to create document');
            }

            return response.json();
        },
        onSuccess: () => {
            if (resourceType === 'project') queryClient.invalidateQueries({ queryKey: ['projects'] })
            if (resourceType === 'report') queryClient.invalidateQueries({ queryKey: ['reports', 'projects'], })
            if (resourceType === 'document') queryClient.invalidateQueries({ queryKey: ['documents', 'projects'], })
            cb && cb()
        },
    })
}