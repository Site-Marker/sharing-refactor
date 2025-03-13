import { useQuery } from '@tanstack/react-query';
import { getHeaders } from './helpers';
export default function useFetchProject(id: string | number | undefined, shared: boolean) {
    return useQuery({
        queryKey: ['projects', id],
        queryFn: () => fetch(`/projects/${id}.json`+ (shared ? '?shared=true' : ''), {
            headers: getHeaders,
        }).then((res) =>
            res.json(),
        )
    })
}