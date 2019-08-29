export class Event {
    constructor(
        public id: string,
        public eventName: string,
        public eventDetails: string,
        public eventLocation: string,
        public eventDate: Date,
        public eventImage: string
    ) {}
}
