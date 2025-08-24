import { app, Timer, InvocationContext } from "@azure/functions";
import { timeProvider } from "../utils/timeProvider";

export async function scheduledWork(
    functionTimer: Timer,
    context: InvocationContext
): Promise<void> {
    const utcTimestamp = timeProvider.get()().toISOString();
    
    if (functionTimer.isPastDue) {
        context.log('Timer function is past due!');
    }

    // Simulate some work being done
    await new Promise(resolve => setTimeout(resolve, 250));
    
    context.log(`Node.js timer trigger function ran at ${utcTimestamp}`);
}

// Timer trigger function that runs every 5 minutes.
// Logs the current UTC timestamp and indicates if the timer is past due.
/* istanbul ignore next */
app.timer('ScheduledWork', {
    schedule: '0 */5 * * * *',
    runOnStartup: true,
    handler: scheduledWork
});