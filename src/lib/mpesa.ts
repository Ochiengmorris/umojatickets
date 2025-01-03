"use server";

import { getAccessToken } from "@/middleware";
export interface MpesaCredentials {
  consumerKey: string;
  consumerSecret: string;
  passkey: string;
  shortcode: string;
}

const requiredEnvVars = [
  "MPESA_CONSUMER_KEY",
  "MPESA_CONSUMER_SECRET",
  "MPESA_PASSKEY",
  "MPESA_SHORTCODE",
];

for (const varName of requiredEnvVars) {
  if (!process.env[varName]) {
    throw new Error(`Missing environment variable: ${varName}`);
  }
}

const mpesaCredentials: MpesaCredentials = {
  consumerKey: process.env.MPESA_CONSUMER_KEY!,
  consumerSecret: process.env.MPESA_CONSUMER_SECRET!,
  passkey: process.env.MPESA_PASSKEY!,
  shortcode: process.env.MPESA_SHORTCODE!,
};

// async function generateAccessToken(auth: string) {
//   const url =
//     "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials";

//   const response = await fetch(url, {
//     method: "GET",
//     headers: {
//       Authorization: `Basic ${auth}`,
//     },
//   });

//   const data = await response.json();

//   if (response.ok) {
//     console.log("access_token", data.access_token);
//     return data.access_token;
//   } else {
//     throw new Error(
//       `Failed to generate access token: ${data.error_description}`
//     );
//   }
// }

export async function sendStkPush(phoneNumber: string, amount: number) {
  const url = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest";

  // const accessToken = await generateAccessToken(auth);
  const accessToken = await getAccessToken();
  // console.log(accessToken);

  const timestamp = new Date()
    .toISOString()
    .replace(/[^0-9]/g, "")
    .slice(0, -3);
  const password = Buffer.from(
    `${mpesaCredentials.shortcode}${mpesaCredentials.passkey}${timestamp}`
  ).toString("base64");

  const callbackUrl = process.env.MPESA_CALLBACK_URL;

  // console.log(callbackUrl);
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        BusinessShortCode: mpesaCredentials.shortcode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: amount,
        PartyA: phoneNumber,
        PartyB: mpesaCredentials.shortcode,
        PhoneNumber: phoneNumber,
        CallBackURL: `${callbackUrl}/api/webhooks/mpesa`,
        AccountReference: "Test",
        TransactionDesc: "Test Payment",
      }),
    });

    if (!response.ok) {
      const errorDetails = await response.text();
      console.error("STK Push Error:", errorDetails);
      throw new Error(`Failed to send STK push: ${errorDetails}`);
    }

    return response.json();
  } catch (error) {
    console.error("error", error);
  }
}
