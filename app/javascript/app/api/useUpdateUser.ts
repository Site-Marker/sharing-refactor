import { Document } from "@/models";
import { User } from "@/models";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postHeaders } from "./helpers";
export default function useUpdateUser(userId?: number | string, projectRole: string, reportRole: string, documentRole: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (newUser: User) => {
            const response = await fetch(`/users/${userId}.json`, {
                method: 'PUT',
                headers: postHeaders(),
                body: JSON.stringify({ projectRole: projectRole, reportRole: reportRole, documentRole: documentRole }),
            });

            if (!response.ok) {
                throw new Error('Failed to update user');
            }

            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users', userId] })
        },
    })
}