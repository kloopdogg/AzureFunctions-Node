import { InvocationContext } from '@azure/functions';
import { processQueueMessage } from '../../src/functions/sampleAsbFunctions';

describe('processQueueMessage', () => {
    let context: InvocationContext;

    beforeEach(() => {
        context = new InvocationContext({
            functionName: 'processQueueMessage',
            invocationId: 'testInvocationId',
        });

        jest.spyOn(context, 'log');
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should process trigger metadata is null', async () => {
        // Arrange
        const message = { name: 'Test Event', id: '42' };

        // Act
        await processQueueMessage(message, context);

        // Assert
        expect(context.log).toHaveBeenCalledWith('Message ID: undefined');
        expect(context.log).toHaveBeenCalledWith('Message Content-Type: undefined');
        expect(context.log).toHaveBeenCalledWith('Processing event: Test Event (42)');
        expect(context.log).toHaveBeenCalledWith('Service Bus queue trigger function processed message undefined');
    });

    it('should process trigger metadata is empty', async () => {
        // Arrange
        const message = { name: 'Test Event', id: '42' };
        context.triggerMetadata = {};

        // Act
        await processQueueMessage(message, context);

        // Assert
        expect(context.log).toHaveBeenCalledWith('Message ID: undefined');
        expect(context.log).toHaveBeenCalledWith('Message Content-Type: undefined');
        expect(context.log).toHaveBeenCalledWith('Processing event: Test Event (42)');
        expect(context.log).toHaveBeenCalledWith('Service Bus queue trigger function processed message undefined');
    });

    it('should process JSON message with expected fields', async () => {
        // Arrange
        const message = { name: 'Test Event', id: '42' };
        context.triggerMetadata = {
            messageId: "mid123",
            contentType: "application/json",
        };

        // Act
        await processQueueMessage(message, context);

        // Assert
        expect(context.log).toHaveBeenCalledWith('Message ID: mid123');
        expect(context.log).toHaveBeenCalledWith('Message Content-Type: application/json');
        expect(context.log).toHaveBeenCalledWith('Processing event: Test Event (42)');
        expect(context.log).toHaveBeenCalledWith('Service Bus queue trigger function processed message mid123');
    });

    it('should handle empty JSON object', async () => {
        // Arrange
        const message = {};
        context.triggerMetadata = {
            messageId: "mid123",
            contentType: "application/json",
        };

        // Act
        await processQueueMessage(message, context);

        // Assert
        expect(context.log).toHaveBeenCalledWith('Message Content-Type: application/json');
        expect(context.log).toHaveBeenCalledWith('Invalid SampleInfo: {}');
    });

    it('should handle JSON missing name key', async () => {
        // Arrange
        const message = { id: '99' };
        context.triggerMetadata = {
            messageId: "mid123",
            contentType: "application/json",
        };

        // Act
        await processQueueMessage(message, context);

        // Assert
        expect(context.log).toHaveBeenCalledWith('Message Content-Type: application/json');
        expect(context.log).toHaveBeenCalledWith('Invalid SampleInfo: {"id":"99"}');
    });

    it('should handle JSON missing id key', async () => {
        // Arrange
        const message = { name: 'Test' };
        context.triggerMetadata = {
            messageId: "mid123",
            contentType: "application/json",
        };

        // Act
        await processQueueMessage(message, context);

        // Assert
        expect(context.log).toHaveBeenCalledWith('Message Content-Type: application/json');
        expect(context.log).toHaveBeenCalledWith('Invalid SampleInfo: {"name":"Test"}');
    });

    it('should handle non-JSON message body', async () => {
        // Arrange
        const message = "Plain string";
        context.triggerMetadata = {
            messageId: "mid456",
            contentType: "text/plain",
        };

        // Act
        await processQueueMessage(message, context);

        // Assert
        expect(context.log).toHaveBeenCalledWith('Message Content-Type: text/plain');
        expect(context.log).toHaveBeenCalledWith('Invalid message body: Plain string');
    });

    it('should handle a plaintext string JSON message body', async () => {
        // Arrange
        const message: string = '{"id": 123, "name": "Test"}';
        context.triggerMetadata = {
            messageId: "mid456",
            contentType: "text/plain",
        };

        // Act
        await processQueueMessage(message, context);

        // Assert
        expect(context.log).toHaveBeenCalledWith('Message ID: mid456');
        expect(context.log).toHaveBeenCalledWith('Message Content-Type: text/plain');
        expect(context.log).toHaveBeenCalledWith('Processing event: Test (123)');
        expect(context.log).toHaveBeenCalledWith('Service Bus queue trigger function processed message mid456');
    });

    it('should handle invalid JSON body', async () => {
        // Arrange
        const message = "{invalid json";
        context.triggerMetadata = {
            messageId: "mid456",
            contentType: "text/plain",
        };

        // Act
        await processQueueMessage(message, context);

        // Assert
        expect(context.log).toHaveBeenCalledWith('Message Content-Type: text/plain');
        expect(context.log).toHaveBeenCalledWith('Invalid message body: {invalid json');
    });

    it('should handle different content type', async () => {
        // Arrange
        const message = { name: 'Bob', id: '007' };
        context.triggerMetadata = {
            messageId: "mid456",
            contentType: "application/x-custom",
        };

        // Act
        await processQueueMessage(message, context);

        // Assert
        expect(context.log).toHaveBeenCalledWith('Message ID: mid456');
        expect(context.log).toHaveBeenCalledWith('Message Content-Type: application/x-custom');
        expect(context.log).toHaveBeenCalledWith('Processing event: Bob (007)');
        expect(context.log).toHaveBeenCalledWith('Service Bus queue trigger function processed message mid456');
    });
});