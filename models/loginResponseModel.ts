export interface LoginResponse {
    data: {
        admin: {
            role: string,
            email: string,
            fullName: string,
            _id: string
        }
        accessToken: string,
    };
}
