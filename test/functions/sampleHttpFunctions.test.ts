import { HttpRequest, InvocationContext } from '@azure/functions';
import { welcomeMessage } from '../../src/functions/sampleHttpFunctions';
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

describe('welcomeMessage function', () => {
  let req: MockHttpRequest;
  let context: InvocationContext;

  beforeEach(() => {
    req = new MockHttpRequest({ urlPath: '/api/WelcomeMessage' });
    context = new InvocationContext({
      functionName: 'testFunctionName',
      invocationId: 'testInvocationId',
    });
    jest.spyOn(context, 'log');
  });

  describe('GET requests', () => {
    it('should log the welcome message function', async () => {
      const expectedLogExcerpt = `Hello function processed request`;
      await welcomeMessage(req, context);
      expect(context.log).toHaveBeenCalledWith(
        expect.stringContaining(expectedLogExcerpt)
      );
    });

    it('should log the request URL', async () => {
      await welcomeMessage(req, context);
      expect(context.log).toHaveBeenCalledWith(
        expect.stringContaining(req.url)
      );
    });

    it('empty request should return a response with status 200', async () => {
      const result = await welcomeMessage(req, context);
      expect(result.status).toBe(200);
    });

    it('empty request should return a response with default message', async () => {
      const expectedOutput = 'Hello, world!';
      const result = await welcomeMessage(req, context);
      expect(result.body).toBeDefined();
      expect(result.body).toBe(expectedOutput);
    });

    it('should use name from query parameter when provided', async () => {
      const name = 'John';
      const expectedOutput = `Hello, ${name}!`;
      req.setQuery(new URLSearchParams({ name }));
      const result = await welcomeMessage(req, context);
      expect(result.body).toBe(expectedOutput);
    });
  });

  describe('POST requests', () => {
    beforeEach(() => {
      req.setMethod('POST');
    });

    it('should use name from request body when provided', async () => {
      const name = 'Jane';
      const expectedOutput = `Hello, ${name}!`;
      req.setText(name);
      const result = await welcomeMessage(req, context);
      expect(result.body).toBe(expectedOutput);
    });

    it('should prefer query parameter over body content', async () => {
      const bodyName = 'Jane';
      const queryName = 'John';
      const expectedOutput = `Hello, ${queryName}!`;
      req.setText(bodyName);
      req.setQuery(new URLSearchParams({ name: queryName }));
      const result = await welcomeMessage(req, context);
      expect(result.body).toBe(expectedOutput);
    });
  });
});
