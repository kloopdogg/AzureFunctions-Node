import { InvocationContext } from '@azure/functions';
import { welcomeMessage } from '../../src/functions/sampleHttpFunctions';
import { MockHttpRequest } from '../mocks/mockHttpRequest';

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
