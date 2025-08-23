import { app, InvocationContext } from '@azure/functions';

/**
 * Processes messages from the Service Bus queue using a Service Bus trigger.
 * This function uses autocomplete of messages with PeekLock mode, which means
 * messages are automatically completed (removed from the queue) upon successful
 * function execution. If the function fails, the message will be returned to
 * the queue for retry processing.
 */
export async function processQueueMessage(message: unknown, context: InvocationContext): Promise<void> {
    // Parse the message - in Node.js Azure Functions, Service Bus messages come as objects
    const serviceBusMessage = message as any;
    
    context.log(`Message ID: ${context.triggerMetadata?.messageId}`);
    context.log(`Message Body: ${typeof serviceBusMessage === 'string' ? serviceBusMessage : JSON.stringify(serviceBusMessage)}`);
    context.log(`Message Content-Type: ${context.triggerMetadata?.contentType}`);

    // Simulate some work being done
    await new Promise(resolve => setTimeout(resolve, 250));

    context.log(`Service Bus queue trigger function processed message ${context.triggerMetadata?.messageId}`);
}

// Service Bus Queue Trigger function using the connection string from app settings
// and a queue named 'sample-queue'
app.serviceBusQueue('ProcessQueueMessage', {
    connection: 'ServiceBusConnection',
    queueName: 'sample-queue',
    handler: processQueueMessage
});
