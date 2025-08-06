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
      const expectedLogExcerpt = `WelcomeMessage function processing a ${req.method} request for url: ${req.url}`;
      await welcomeMessage(req, context);
      expect(context.log).toHaveBeenCalledWith(
        expect.stringMatching(expectedLogExcerpt)
      );
    });
    
    it('should log the welcome message function with querystring parameter', async () => {
      const queryName = 'Jimmy';
      const expectedOutput = `${queryName}, Azure Functions <⚡> are awesome!`;
      req.setQuery(new URLSearchParams({ name: queryName }));
      const expectedLogExcerpt = `WelcomeMessage function processing a ${req.method} request for url: ${req.url}`;
      await welcomeMessage(req, context);
      expect(context.log).toHaveBeenCalledWith(
        expect.stringMatching(expectedLogExcerpt)
      );
    });

    it('empty request should return a 200 response with default message', async () => {
      const expectedOutput = 'Azure Functions <⚡> are awesome!';
      const result = await welcomeMessage(req, context);
      expect(result.status).toBe(200);
      expect(result.body).toBeDefined();
      expect(result.body).toBe(expectedOutput);
    });

    it('request with query parameter should return a 200 response with custom message', async () => {
      const name = 'Jimmy';
      const expectedOutput = `${name}, Azure Functions <⚡> are awesome!`;
      req.setQuery(new URLSearchParams({ name }));
      const result = await welcomeMessage(req, context);
      expect(result.status).toBe(200);
      expect(result.body).toBeDefined();
      expect(result.body).toBe(expectedOutput);
    });
  });

  describe('POST requests', () => {
    beforeEach(() => {
      req.setMethod('POST');
    });
    
    it('should log the welcome message function', async () => {
      const expectedLogExcerpt = `WelcomeMessage function processing a ${req.method} request for url: ${req.url}`;
      await welcomeMessage(req, context);
      expect(context.log).toHaveBeenCalledWith(
        expect.stringMatching(expectedLogExcerpt)
      );
    });
    
    it('should log the welcome message function with querystring parameter', async () => {
      const queryName = 'Jimmy';
      const expectedOutput = `${queryName}, Azure Functions <⚡> are awesome!`;
      req.setQuery(new URLSearchParams({ name: queryName }));
      const expectedLogExcerpt = `WelcomeMessage function processing a ${req.method} request for url: ${req.url}`;
      await welcomeMessage(req, context);
      expect(context.log).toHaveBeenCalledWith(
        expect.stringMatching(expectedLogExcerpt)
      );
    });

    it('empty request body should return a 200 response with default message', async () => {
      const expectedOutput = `Azure Functions <⚡> are awesome!`;
      const result = await welcomeMessage(req, context);
      expect(result.status).toBe(200);
      expect(result.body).toBeDefined();
      expect(result.body).toBe(expectedOutput);
    });

    it('request with query should return a 200 response with custom message', async () => {
      const name = 'Jimmy';
      const expectedOutput = `${name}, Azure Functions <⚡> are awesome!`;
      req.setQuery(new URLSearchParams({ name }));
      const result = await welcomeMessage(req, context);
      expect(result.status).toBe(200);
      expect(result.body).toBeDefined();
      expect(result.body).toBe(expectedOutput);
    });

    it('request with body should return a 200 response with custom message', async () => {
      const name = 'Jimmy';
      const expectedOutput = `${name}, Azure Functions <⚡> are awesome!`;
      req.setText(name);
      const result = await welcomeMessage(req, context);
      expect(result.status).toBe(200);
      expect(result.body).toBeDefined();
      expect(result.body).toBe(expectedOutput);
    });

    it('request with body and query should prefer query parameter over body content', async () => {
      const bodyName = 'John';
      const queryName = 'Jimmy';
      const expectedOutput = `${queryName}, Azure Functions <⚡> are awesome!`;
      req.setText(bodyName);
      req.setQuery(new URLSearchParams({ name: queryName }));
      const result = await welcomeMessage(req, context);
      expect(result.status).toBe(200);
      expect(result.body).toBeDefined();
      expect(result.body).toBe(expectedOutput);
    });
  });
});
