import { Timer, InvocationContext } from '@azure/functions';
import { scheduledWork } from '../../src/functions/sampleTimerFunctions';
import { timeProvider } from '../../src/utils/timeProvider';
import { MockTimer } from '../mocks/mockTimer';

describe('scheduledWork function', () => {
    let timer: MockTimer;
    let context: InvocationContext;
    let originalTimeProvider: () => Date;
    const fixedTime = new Date();

    beforeEach(() => {
        timer = new MockTimer();
        context = new InvocationContext({
            functionName: 'ScheduledWork',
            invocationId: 'testInvocationId',
        });
        jest.spyOn(context, 'log');
        
        // Store the original time provider and set our fixed time provider
        originalTimeProvider = timeProvider.get();
        timeProvider.set(() => fixedTime);
    });

    afterEach(() => {
        // Restore the original time provider
        timeProvider.set(originalTimeProvider);
    });

    it('should log the timestamp when executed', async () => {
        // Arrange
        const expectedLogMessage = `Node.js timer trigger function ran at ${fixedTime.toISOString()}`;

        // Act
        await scheduledWork(timer, context);

        // Assert
        expect(context.log).toHaveBeenCalledWith(expectedLogMessage);
    });

    it('should log past due message when timer is past due', async () => {
        // Arrange
        timer = new MockTimer(true);
        const expectedPastDueMessage = 'Timer function is past due!';
        const expectedLogMessage = `Node.js timer trigger function ran at ${fixedTime.toISOString()}`;

        // Act
        await scheduledWork(timer, context);

        // Assert
        expect(context.log).toHaveBeenCalledWith(expectedPastDueMessage);
        expect(context.log).toHaveBeenCalledWith(expectedLogMessage);
    });

    it('should use provided time for timestamp', async () => {
        // Arrange
        const expectedDate = fixedTime.toISOString().split('T')[0]; // Get just the date part
        const expectedLogMessage = `Node.js timer trigger function ran at ${expectedDate}`;
        timeProvider.set(originalTimeProvider);

        // Act
        await scheduledWork(timer, context);

        // Assert
        expect(context.log).toHaveBeenCalledWith(expect.stringContaining(expectedDate));
        expect(context.log).toHaveBeenCalledWith(expect.stringContaining(expectedLogMessage));
    });
});