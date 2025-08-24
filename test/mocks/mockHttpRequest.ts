import { HttpRequest } from "@azure/functions";
import { Blob } from 'buffer';
import { FormData, Headers } from 'undici';

export class MockHttpRequest implements HttpRequest {
  public method: string;
  public url: string;
  public headers: Headers;
  public query: URLSearchParams;
  public params: { [key: string]: string };
  public user: any;
  public body: any;
  public bodyUsed: boolean;
  private _text: string;

  constructor(options: Partial<{
    method: string;
    url: string;
    urlPath: string;
    query: URLSearchParams;
    text: string;
  }> = {}) {
    this.method = options.method || 'GET';
    if (options.url) {
      this.url = options.url;
    } else {
      const baseUrl = 'http://nodefunction.sample.com/';
      if (!options.urlPath) {
        options.urlPath = 'api/test';
      }
      this.url = new URL(options.urlPath, baseUrl).toString();
    }
    this.headers = new Headers();
    this.query = options.query || new URLSearchParams();
    this.params = {};
    this.user = null;
    this.body = null;
    this.bodyUsed = false;
    this._text = options.text || '';
  }

  async arrayBuffer(): Promise<ArrayBuffer> {
    return new ArrayBuffer(0);
  }

  async blob(): Promise<Blob> {
    return new Blob([new Uint8Array()]);
  }

  async formData(): Promise<FormData> {
    return new FormData();
  }

  async json(): Promise<any> {
    return {};
  }

  async text(): Promise<string> {
    return this._text;
  }

  clone(): HttpRequest {
    return new MockHttpRequest({
      method: this.method,
      url: this.url,
      query: this.query,
      text: this._text
    });
  }

  public setMethod(method: string): void {
    this.method = method;
  }

  public setText(text: string): void {
    this._text = text;
  }

  public setQuery(query: URLSearchParams): void {
    this.query = query;
  }
}