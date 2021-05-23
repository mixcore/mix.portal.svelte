import Qs from 'qs';
export const API_CONFIGURATION = {
    withCredentials: true,
    timeout: 30000,
    baseURL: '',
    headers: {
        common: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            Pragma: 'no-cache',
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
    },
    // `paramsSerializer` is an optional function in charge of serializing `params`
    // (e.g. https://www.npmjs.com/package/qs, http://api.jquery.com/jquery.param/)
    paramsSerializer: function (params) {
        return Qs.stringify(params, { arrayFormat: 'brackets' });
    },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBpLWNvbmZpZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL21peC5saWIudHMvc3JjL2xpYi9jb25zdGFudHMvYXBpLWNvbmZpZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsTUFBTSxJQUFJLENBQUM7QUFHcEIsTUFBTSxDQUFDLE1BQU0saUJBQWlCLEdBQXVCO0lBQ25ELGVBQWUsRUFBRSxJQUFJO0lBQ3JCLE9BQU8sRUFBRSxLQUFLO0lBQ2QsT0FBTyxFQUFFLEVBQUU7SUFDWCxPQUFPLEVBQUU7UUFDUCxNQUFNLEVBQUU7WUFDTixlQUFlLEVBQUUscUNBQXFDO1lBQ3RELE1BQU0sRUFBRSxVQUFVO1lBQ2xCLGNBQWMsRUFBRSxrQkFBa0I7WUFDbEMsTUFBTSxFQUFFLGtCQUFrQjtTQUMzQjtLQUNGO0lBQ0QsK0VBQStFO0lBQy9FLCtFQUErRTtJQUMvRSxnQkFBZ0IsRUFBRSxVQUFVLE1BQU07UUFDaEMsT0FBTyxFQUFFLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFBRSxFQUFFLFdBQVcsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDO0lBQzNELENBQUM7Q0FDRixDQUFDIn0=