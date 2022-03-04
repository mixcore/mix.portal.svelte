export class MixHttps {
  public static get<T>(url: string): Promise<T> {
    return fetch(url, { method: 'get' })
      .then(this.interceptor)
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
      .then(this.interceptor)
      .then((data) => Promise.resolve<T>(data));
  }

  private static interceptor(res: Response): Promise<any> {
    if (res.ok) {
      return res.status === 204 ? Promise.resolve(res.ok) : res.json();
    } else {
      throw new Error(res.statusText)
    }
  }
}
