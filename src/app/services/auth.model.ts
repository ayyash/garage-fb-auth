
export interface IAuthInfo {
    id?: string;
    bloodType?: string;
    admin?: boolean;
    picture?: string;
    email?: string;
    token?: string;
    isNewUser?: boolean;
}

export const MapAuth = (auth: any): IAuthInfo => {
    return {
        id: auth.id,
        email: auth.email,
        admin: auth.admin,
        bloodType: auth.bloodType,
        picture: auth.picture,
        isNewUser: auth.newUser
    }
}