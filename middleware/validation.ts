import type { NextApiRequest, NextApiResponse } from "next";
import { CustomResponse, messages, codes, responseHandler } from '../utils';
import withJoi from "next-joi";
import Joi from "joi";

export default withJoi({
    onValidationError: (req: NextApiRequest, res: NextApiResponse<CustomResponse>, error: any) => {
        console.log(error)
        return responseHandler(res, codes.INTERNAL_SERVER, { error: true, message: messages.INVALID_REQUEST || messages.ERROR, data: error })
    },
});

export const noteSchema = Joi.object({
    text: Joi.string().required()
});