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
    ) {}
}


export class Mentor {
    constructor(
        public id: string,        
        public mentorUserName: string,
        public mentorProfile: string,
        public mentorField: string,
        public mentorImage: string,
        public mentorEmail: string        
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
        public localRating: number        
    ) {}    
}