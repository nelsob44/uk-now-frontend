export class User {
    constructor(
        public id: string,
        public firstname: string,
        public lastname: string,
        public status: number,
        private _token: string,
        private tokenExpirationDate: Date
    ) {}

    get token() {
        if(!this.tokenExpirationDate || this.tokenExpirationDate <= new Date()) {
            return null;
        }
        return this._token;
    }

    get tokenDuration() {
        if(!this.token) {
            return 0;
        }
        return this.tokenExpirationDate.getTime() - new Date().getTime();
    }
}