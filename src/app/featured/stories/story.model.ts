export class Story {
    constructor(
        public id: string,
        public storyTitle: string,
        public storyDetail: string,
        public storyImage: string,
        public userName: string,
        public postedOn: Date,
        public storyLikes: number,
        public storyLikers: string[]                    
    ) {}
}
