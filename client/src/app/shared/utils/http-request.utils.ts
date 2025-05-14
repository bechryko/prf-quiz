import { HttpHeaders } from '@angular/common/http';

export class HttpRequestUtils {
   public static getUrl(endpoint: string): string {
      return `http://localhost:5000/app/${endpoint}`;
   }

   public static getHeaders(): HttpHeaders {
      return new HttpHeaders({
         'Content-Type': 'application/x-www-form-urlencoded'
      });
   }

   public static createBody(object: Record<string, any>): URLSearchParams {
      const body = new URLSearchParams();
      Object.keys(object).forEach(key => body.set(key, this.parseValue(object[key])));
      return body;
   }

   private static parseValue(value: any): any {
      if (typeof value === 'object') {
         return JSON.stringify(value);
      }
      return value;
   }
}
