import type { NextApiResponse } from "next";

// arbitrary response format
export type BasicIpfsData = {
    cid: string;
    content: string;
};

export type CustomResponse = {
    error: boolean,
    message: string,
    data?: BasicIpfsData| any 
}
// we can define custom messages
export const messages = {
    INVALID_REQUEST: 'invalid request',
    SUCCESS: 'success',
    ERROR: 'error'
}
// we can define custom errors
export const codes = {
    INTERNAL_SERVER: 500,
    SUCCESS: 200,
    NOT_FOUND: 404,
    BAD_REQUEST: 400
}

export const responseHandler = (res: NextApiResponse, statusCode: number, object: CustomResponse) => {
    return res.status(statusCode).json(object);
}