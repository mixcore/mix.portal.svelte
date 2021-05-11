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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWl4LWhlbHBlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9saWIvaGVscGVycy9taXgtaGVscGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBLE9BQU8sRUFBRSxNQUFNLElBQUksQ0FBQztBQUVwQjs7O0dBR0c7QUFDSCxNQUFNLFVBQVUsNEJBQTRCO0lBQzFDLE9BQU87UUFDTCxlQUFlLEVBQUUsS0FBSztRQUN0QixPQUFPLEVBQUUsS0FBSztRQUNkLE9BQU8sRUFBRSxFQUFFO1FBQ1gsT0FBTyxFQUFFO1lBQ1AsTUFBTSxFQUFFO2dCQUNOLGVBQWUsRUFBRSxxQ0FBcUM7Z0JBQ3RELE1BQU0sRUFBRSxVQUFVO2dCQUNsQixjQUFjLEVBQUUsa0JBQWtCO2dCQUNsQyxNQUFNLEVBQUUsa0JBQWtCO2FBQzNCO1NBQ0Y7UUFDRCwrRUFBK0U7UUFDL0UsK0VBQStFO1FBQy9FLGdCQUFnQixFQUFFLFVBQVUsTUFBTTtZQUNoQyxPQUFPLEVBQUUsQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLEVBQUUsV0FBVyxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUM7UUFDM0QsQ0FBQztLQUNGLENBQUM7QUFDSixDQUFDIn0=