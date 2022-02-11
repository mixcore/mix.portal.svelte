export class MixHttps {
  public static get<T>(url: string): Promise<T> {
    return fetch(url, { method: 'get' })
      .then((res) => res.json())
      .then((data) => Promise.resolve<T>(data))
      .catch(err => {throw new Error(err)});
  }

  public static post<T>(url: string, body: any): Promise<T> {
    return fetch(url, { 
      method: 'POST', 
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json'
      },
    })
      .then((res) => {
        if (res.ok) {
          return res.status === 204 ? res.ok : res.json();
        } else {
          throw new Error(res.statusText)
        }
      })
      .then((data) => Promise.resolve<T>(data));
  }
}
