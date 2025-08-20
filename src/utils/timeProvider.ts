/**
 * Class to manage the time provider function.
 */
export class TimeProvider {
    private provider: () => Date;

    /**
     * Initialize with default time provider.
     */
    constructor() {
        this.provider = TimeProvider.getCurrentTime;
    }

    /**
     * Get the current UTC time.
     */
    private static getCurrentTime(): Date {
        return new Date();
    }

    /**
     * Get the current time provider function.
     */
    public get(): () => Date {
        return this.provider;
    }

    /**
     * Set the time provider function.
     * @param provider A function that returns a Date object.
     */
    public set(provider: () => Date): void {
        this.provider = provider;
    }
}

// Singleton instance
export const timeProvider = new TimeProvider();
