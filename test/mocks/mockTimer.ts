import { Timer } from "@azure/functions";

export class MockTimer implements Timer {
    public scheduleStatus: {
        last: string;
        next: string;
        lastUpdated: string;
    };
    public schedule: {
        adjustForDST: boolean;
    };

    constructor(private isPastDueValue: boolean = false) {
        this.scheduleStatus = {
            last: new Date().toISOString(),
            next: new Date().toISOString(),
            lastUpdated: new Date().toISOString()
        };
        this.schedule = {
            adjustForDST: true
        };
    }

    get isPastDue(): boolean {
        return this.isPastDueValue;
    }
}