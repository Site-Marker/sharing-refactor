import { useQuery } from '@tanstack/react-query';
import { getHeaders } from './helpers';
export default function useFetchDocuments(shared: boolean, projectId?: string) {
    const url = projectId ? `/projects/${projectId}/documents.json` : '/documents.json';
    return useQuery({
        queryKey: ['documents', 'projects', projectId],
        queryFn: () => fetch(url + (shared ? '?shared=true' : ''), {
            headers: getHeaders,
        }).then((res) =>
            res.json(),
        ),
        retry: false,
    })
}