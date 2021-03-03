export class Blogcomments {
    constructor(
        public id: string,        
        public commentUserName: string,
        public commentDetails: string,
        public commentTime: Date        
    ) {}    
}

export class Questions {
    constructor(
        public id: string,        
        public questionUserName: string,
        public questionTitle: string,
        public questionDetails: string,
        public questionTime: Date,
        public questionReplies: Blogcomments[]       
    ) {}    
}

export class Results {
    constructor(
        public id: string,        
        public userName: string,
        public userId: string,
        public isWinner: boolean,
        public subject: string,
        public score: string,
        public resultTime: Date       
    ) {}    
}


export class Blog {
    constructor(    
    public id: string,    
    public blogTitle: string,
    public blogDetails: string,
    public blogImage: string,
    public blogFirstName: string,
    public blogLastName: string,
    public blogDate: Date,
    public blogLikes: number,
    public blogComments: Blogcomments[],
    public blogNumberOfComments: number,
    public blogLikers: string[],
    public youtubeLinkString: any
    ) {}
}


export class Mentor {
    constructor(
        public id: string,        
        public mentorUserName: string,
        public mentorProfile: string,
        public mentorField: string,
        public mentorImage: string,
        public mentorEmail: string,
        public mentorLinkedIn: string    
    ) {}    
}

export class Rating {
    constructor(
        public localRatingNo: number,        
        public ratingDate: string,
        public creator: string,              
    ) {}   
}

export class Local {
    constructor(
        public id: string,        
        public localName: string,
        public localType: string,
        public localAddress: string,
        public localImage: string,
        public localContact: string,
        public localRating: number,
        public ratings: Rating[]     
    ) {}    
}