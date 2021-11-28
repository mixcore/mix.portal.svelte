export class MixHttps {
    public static get<T>(url: string): Promise<T> {
        return fetch(url, {method: 'get'})
        .then(res => res.json())
        .then(data => Promise.resolve<T>(data))
    }

    public static post<T>(url: string): Promise<T> {
        return fetch(url, {method: 'post'})
        .then(res => res.json())
        .then(data => Promise.resolve<T>(data))
    }
}