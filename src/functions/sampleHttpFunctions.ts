import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";

export async function welcomeMessage(
    request: HttpRequest,
    context: InvocationContext
): Promise<HttpResponseInit> {
    context.log(`WelcomeMessage function processing a request for url: ${request.url}`);

    const name = request.query.get('name') || await request.text();
    const messagePrefix = name ? `${name}, ` : '';

    return { status: 200, body: `${messagePrefix}Azure Functions <⚡> are awesome!` };
};

app.http('WelcomeMessage', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: welcomeMessage
});
