export class Message {
    constructor(
        public id: string,
        public messageFrom: string,
        public messageTo: string,        
        public messageDetails: string,
        public messageImage: string,
        public messageRead: boolean,
        public messageTime: string
    ) {}
}