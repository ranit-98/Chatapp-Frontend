import { BaseApiResponse } from "./common.interface";

export interface IUserProfile {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
    googleId?: string;
}

export interface IUserProfileResponse extends BaseApiResponse {
    data: IUserProfile;
}
