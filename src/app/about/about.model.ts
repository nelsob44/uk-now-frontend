export class About {
    constructor(
        public id: string,        
        public aboutDetails: string,
        public aboutImage: string        
    ) {}
}

export class Essentials {
    constructor(
        public id: string,        
        public essentialsDetails: string,
        public essentialsImage: string,
        public essentialsTime: Date      
    ) {}
}