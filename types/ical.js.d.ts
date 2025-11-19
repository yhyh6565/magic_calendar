declare module 'ical.js' {
    export function parse(input: string): any;
    export class Component {
        constructor(jcal: any);
        getFirstSubcomponent(name: string): Component | null;
    }
    export class Event {
        constructor(component: Component | null);
        summary: string;
        description: string;
        location: string;
        startDate: Time;
        endDate: Time;
    }
    export class Time {
        toJSDate(): Date;
        isDate: boolean;
    }
}
