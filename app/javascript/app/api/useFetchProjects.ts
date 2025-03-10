import { useQuery } from '@tanstack/react-query';
import { getHeaders } from './helpers';
export default function useFetchProjects(shared?: boolean) {
    return useQuery({
        queryKey: ['projects', shared],
        queryFn: () => fetch('/projects.json' + (shared ? '?shared=true' : ''), {
            headers: getHeaders,
        }).then((res) =>
            res.json(),
        ),
        retry: false,
    })
}