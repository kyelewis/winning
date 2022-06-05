import { HttpRequest } from "@aws-sdk/protocol-http";
import { SignatureV4 } from "@aws-sdk/signature-v4";
import { Sha256 } from "@aws-crypto/sha256-js";
import { URL } from "node:url";

import fetch from "node-fetch";

// @todo type generic
export const awsJsonQuery = async (
  service: string,
  body: any,
  headers: Record<string, string>
): any => {
  if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY)
    throw new Error(
      "Missing required AWS_ACCESS_KEY_ID or AWS_SECRET_ACCESS_KEY env"
    );

  const region = process.env.AWS_DEFAULT_REGION ?? "us-east-1";

  const signatureV4 = new SignatureV4({
    service,
    region,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
    sha256: Sha256,
  });

  const url = new URL(`https://logs.${region}.amazonaws.com`);

  const request = new HttpRequest({
    hostname: url.host,
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      host: url.host,
      "content-type": "application/x-amz-json-1.1",
      ...headers,
    },
  });

  const signedRequest = await signatureV4.sign(request);
  const result = await fetch(url, signedRequest);

  return await result.json();
};
