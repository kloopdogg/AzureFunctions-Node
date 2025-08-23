import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";

/**
 * HTTP trigger function that responds to both GET and POST requests.
 * It logs the request method and URL, and returns a welcome message.
 * If a 'name' parameter is provided in the query string or request body, it personalizes the message.
 */
export async function welcomeMessage(
    request: HttpRequest,
    context: InvocationContext
): Promise<HttpResponseInit> {
    context.log(`WelcomeMessage function processing a ${request.method} request for url: ${request.url}`);

    const name = request.query.get('name') || await request.text();
    const messagePrefix = name ? `${name}, ` : '';

    return { status: 200, body: `${messagePrefix}Azure Functions <⚡> are awesome!` };
};

// HTTP trigger function that responds to both GET and POST requests
app.http('WelcomeMessage', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: welcomeMessage
});
