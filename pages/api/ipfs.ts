// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { create } from "ipfs-http-client";
import { CustomResponse, messages, codes, responseHandler } from '../../utils';
import connect from "next-connect";
import withJoi, { noteSchema } from '../../middleware/validation';

export default connect().post(withJoi({ body: noteSchema }), (req: NextApiRequest,
  res: NextApiResponse<CustomResponse>) => {
  try {
    saveTextHandler(req, res);
  } catch (error) {
    return responseHandler(res, codes.INTERNAL_SERVER, { error: true, message: error.message || messages.ERROR })
  }
}).get((req: NextApiRequest,
  res: NextApiResponse<CustomResponse>) => {
  try {
    retrieveTextHandler(req, res);
  } catch (error) {
    return responseHandler(res, codes.INTERNAL_SERVER, { error: true, message: error.message || messages.ERROR })
  }
})

const saveTextHandler = async (
  req: NextApiRequest,
  res: NextApiResponse<CustomResponse>
) => {
  const methodName = '[saveTextHandler]';
  try {
    let { text } = req.body;
    let result = await saveTextToIPFS(text);
    return responseHandler(res, codes.SUCCESS, { error: false, message: messages.SUCCESS, data: { cid: result.path, content: text } })
  } catch (error) {
    console.log(methodName, error);
    throw error;
  }
}

const retrieveTextHandler = async (
  req: NextApiRequest,
  res: NextApiResponse<CustomResponse>) => {
  const methodName = '[retrieveTextHandler]';
  try {
    let { cid } = req.query;
    let result = await retrieveTextFromIPFS(cid as string);
    return responseHandler(res, codes.SUCCESS, { error: false, message: messages.SUCCESS, data: { cid: cid as string, content: result } })
  } catch (error) {
    console.log(methodName, error);
    throw error;
  }
}

// This function helps to save text note in ipfs 
const saveTextToIPFS = async (data: string) => {
  const methodName = '[saveTextToIPFS]';
  try {
    const client = getIPFSClient();
    const result = await client.add(data);;
    return result;
  } catch (error) {
    console.error(`${methodName}: ${error.message}`)
    throw error;
  }
}

// This function helps to retrieve text note from ipfs 
const retrieveTextFromIPFS = async (cid: string) => {
  const methodName = '[retrieveTextFromIPFS]';
  try {
    const client = getIPFSClient();
    const result = await client.cat(cid);
    let content: any = [];
    for await (const chunk of result) {
      content = [...content, ...chunk];
    }
    //TODO: need to remove
    console.log("data", Buffer.from(content).toString('utf8'))
    return Buffer.from(content).toString('utf8')
  } catch (error) {
    console.error(`${methodName}: ${error.message}`)
    throw error;
  }
}

const getIPFSClient = () => {
  //connect to the default API address http://localhost:5001
  return create();
}