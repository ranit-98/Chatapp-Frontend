import { BaseApiResponse } from "./common.interface";

export interface IAuthRegisterParamType {
    name: string;
    email: string;
    password: string;
}

export interface IAuthLoginParamType {
    email: string;
    password: string;
}

export interface IAuthRegisterResponse extends BaseApiResponse {
    data: {
        _id: string;
        name: string;
        email: string;
        profile_image?: string;
    };
}

export interface IAuthLoginResponse extends BaseApiResponse {
    token: string;
    data: {
        _id: string;
        name: string;
        email: string;
        profile_image?: string;
    };
}

export interface IAuthProfileDetailsResponse extends BaseApiResponse {
    data: {
        _id: string;
        name: string;
        email: string;
        profile_image?: string;
    };
}
