import { HttpRequest, InvocationContext } from '@azure/functions';
import { hello } from '../../src/functions/hello';
import { Blob } from 'buffer';
import { FormData, Headers } from 'undici';

class MockHttpRequest implements HttpRequest {
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
    query: URLSearchParams;
    text: string;
  }> = {}) {
    this.method = options.method || 'GET';
    this.url = options.url || 'http://localhost/api/hello';
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

  public setText(text: string): void {
    this._text = text;
  }
}

describe('hello function', () => {
  let req: MockHttpRequest;
  let context: InvocationContext;

  beforeEach(() => {
    req = new MockHttpRequest();
    context = new InvocationContext({
      functionName: 'testFunctionName',
      invocationId: 'testInvocationId',
    });
    jest.spyOn(context, 'log');
  });

  describe('GET requests', () => {
    it('empty request should return a response with status 200', async () => {
      const result = await hello(req, context);
      expect(result.status).toBe(200);
    });

    it('empty request should return a response with default message', async () => {
      const result = await hello(req, context);
      expect(result.body).toBeDefined();
      expect(result.body).toBe('Hello, world!');
    });

    it('should use name from query parameter when provided', async () => {
      const name = 'John';
      req = new MockHttpRequest({ query: new URLSearchParams({ name }) });
      const result = await hello(req, context);
      expect(result.body).toBe(`Hello, ${name}!`);
    });

    it('should log the request URL', async () => {
      await hello(req, context);
      expect(context.log).toHaveBeenCalledWith(
        expect.stringContaining(req.url)
      );
    });
  });

  describe('POST requests', () => {
    beforeEach(() => {
      req = new MockHttpRequest({ method: 'POST' });
    });

    it('should use name from request body when provided', async () => {
      const name = 'Jane';
      req = new MockHttpRequest({ 
        method: 'POST',
        text: name
      });
      const result = await hello(req, context);
      expect(result.body).toBe(`Hello, ${name}!`);
    });

    it('should prefer query parameter over body content', async () => {
      const queryName = 'John';
      const bodyName = 'Jane';
      req = new MockHttpRequest({ 
        method: 'POST',
        query: new URLSearchParams({ name: queryName }),
        text: bodyName
      });
      const result = await hello(req, context);
      expect(result.body).toBe(`Hello, ${queryName}!`);
    });
  });
});
