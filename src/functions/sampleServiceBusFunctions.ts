import { app, InvocationContext } from '@azure/functions';
import { EventInfo } from '../models/eventInfo';

/**
 * Processes messages from the Service Bus queue using a Service Bus trigger.
 * This function uses autocomplete of messages with PeekLock mode, which means
 * messages are automatically completed (removed from the queue) upon successful
 * function execution. If the function fails, the message will be returned to
 * the queue for retry processing.
 */
export async function processQueueMessage(
    message: any,
    context: InvocationContext
): Promise<void> {
    context.log(`Message ID: ${context.triggerMetadata?.messageId}`);
    context.log(`Message Content-Type: ${context.triggerMetadata?.contentType}`);

    let eventInfo: EventInfo;
    try {
        eventInfo = typeof message === 'string'
            ? JSON.parse(message)
            : (message as EventInfo);
    } catch {
        context.log(`Invalid message body: ${message}`);
        return;
    }
    
    if (!eventInfo?.name || !eventInfo?.id) {
        context.log(`Invalid EventInfo: ${JSON.stringify(eventInfo)}`);
        return;
    }
    
    context.log(`Processing event: ${eventInfo.name} (${eventInfo.id})`);

    // Simulate some work being done
    await new Promise(resolve => setTimeout(resolve, 250));

    context.log(`Service Bus queue trigger function processed message ${context.triggerMetadata?.messageId}`);
}

// Service Bus Queue Trigger function using the connection string from app settings
// and a queue named 'sample-queue'
// Service Bus settings can be configured in host.json
// - See https://learn.microsoft.com/en-us/azure/azure-functions/functions-bindings-service-bus?tabs=isolated-process%2Cextensionv5&pivots=programming-language-javascript#hostjson-settings
app.serviceBusQueue('ProcessQueueMessage', {
    connection: 'ServiceBusConnection',
    queueName: 'sample-queue',
    handler: processQueueMessage
});
