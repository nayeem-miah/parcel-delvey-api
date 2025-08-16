

export enum Role {
    ADMIN = "ADMIN",
    SENDER = "SENDER",
    RECEIVER = "RECEIVER",
}

export enum IsActive {
    ACTIVE = "ACTIVE",
    BLOCKED = "BLOCKED"
}

export interface IUser {
    name: string;
    email: string;
    password: string;
    role: Role,
    isActive?: IsActive,
    address?: string;
}