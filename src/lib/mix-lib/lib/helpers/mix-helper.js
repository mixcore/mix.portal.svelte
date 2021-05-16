import Qs from 'qs';
/**
 * Get Default Configuration
 * @returns { AxiosRequestConfig}
 */
export function getDefaultAxiosConfiguration() {
    return {
        withCredentials: false,
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
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWl4LWhlbHBlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL21peC5saWIudHMvc3JjL2xpYi9oZWxwZXJzL21peC1oZWxwZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsT0FBTyxFQUFFLE1BQU0sSUFBSSxDQUFDO0FBRXBCOzs7R0FHRztBQUNILE1BQU0sVUFBVSw0QkFBNEI7SUFDMUMsT0FBTztRQUNMLGVBQWUsRUFBRSxLQUFLO1FBQ3RCLE9BQU8sRUFBRSxLQUFLO1FBQ2QsT0FBTyxFQUFFLEVBQUU7UUFDWCxPQUFPLEVBQUU7WUFDUCxNQUFNLEVBQUU7Z0JBQ04sZUFBZSxFQUFFLHFDQUFxQztnQkFDdEQsTUFBTSxFQUFFLFVBQVU7Z0JBQ2xCLGNBQWMsRUFBRSxrQkFBa0I7Z0JBQ2xDLE1BQU0sRUFBRSxrQkFBa0I7YUFDM0I7U0FDRjtRQUNELCtFQUErRTtRQUMvRSwrRUFBK0U7UUFDL0UsZ0JBQWdCLEVBQUUsVUFBVSxNQUFNO1lBQ2hDLE9BQU8sRUFBRSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUUsRUFBRSxXQUFXLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQztRQUMzRCxDQUFDO0tBQ0YsQ0FBQztBQUNKLENBQUMifQ==