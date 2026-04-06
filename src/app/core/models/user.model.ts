export enum Role {
    USER = 'USER',
    ADMIN = 'ADMIN'
}

export interface User {
    id: number;
    username: String;
    email: string;
    fullName: string;
    phoneNumber: string;
    role: Role;
    createdAt: string;
}
