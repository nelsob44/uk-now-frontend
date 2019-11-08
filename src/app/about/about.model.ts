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

export class QuizQuestion {
    constructor(
        public id: string,        
        public questionDetail: string,
        public questionImage: string,
        public questionAnswer: string,
        public questionSubject: string      
    ) {}
}