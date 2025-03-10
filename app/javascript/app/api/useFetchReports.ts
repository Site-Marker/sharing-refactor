import { useQuery } from '@tanstack/react-query';
import { getHeaders } from './helpers';
export default function useFetchReports(shared: boolean, projectId?: string) {
    const url = projectId ? `/projects/${projectId}/reports.json` : '/reports.json';
    return useQuery({
        queryKey: ['reports', 'projects', projectId],
        queryFn: () => fetch(url + (shared ? '?shared=true' : ''), {
            headers: getHeaders,
        }).then((res) =>
            res.json(),
        ),
        retry: false,
    })
}