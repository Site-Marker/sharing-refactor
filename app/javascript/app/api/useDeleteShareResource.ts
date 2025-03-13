import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postHeaders } from "./helpers";
import { DeleteSharingPermission, SharingPermission } from "@/models/SharingPermission";



export default function useDeleteShareResource(resourceType: SharingPermission['resource_type'], cb?: () => void) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (deleteSharingPermission: DeleteSharingPermission) => {
            const response = await fetch('/sharing_permission', {
                method: 'DELETE',
                headers: postHeaders(),
                body: JSON.stringify({ sharing_permission: deleteSharingPermission }),
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