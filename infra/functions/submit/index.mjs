import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { randomUUID } from "node:crypto";

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient());
const TABLE = process.env.TABLE_NAME;
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || "*";

const REQUIRED = {
  feasibility: ["name", "email", "company", "phone", "industry"],
  contact:     ["name", "phone", "msg"],
  demo:        ["name", "phone"],
  career:      ["name", "email", "phone", "roleId", "roleTitle"],
};

const cors = {
  "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function handler(event) {
  try {
    const body = JSON.parse(event.body || "{}");
    const { formType, ...data } = body;

    if (!REQUIRED[formType]) {
      return respond(400, { error: "Invalid form type." });
    }

    const missing = REQUIRED[formType].filter((f) => !data[f]?.toString().trim());
    if (missing.length) {
      return respond(400, { error: `Missing fields: ${missing.join(", ")}` });
    }

    const item = {
      formType,
      submittedAt: new Date().toISOString(),
      id: randomUUID(),
      ...data,
    };

    await ddb.send(new PutCommand({ TableName: TABLE, Item: item }));

    return respond(200, { message: "Submission received", id: item.id });
  } catch (err) {
    console.error("Submit error:", err);
    return respond(500, { error: "Internal server error." });
  }
}

function respond(statusCode, body) {
  return { statusCode, headers: cors, body: JSON.stringify(body) };
}
