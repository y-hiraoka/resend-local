import {} from "zod";
import {
  postEmailsRoute,
  getEmailsEmail_idRoute,
  patchEmailsEmail_idRoute,
  postEmailsEmail_idCancelRoute,
  postEmailsBatchRoute,
  postDomainsRoute,
  getDomainsRoute,
  getDomainsDomain_idRoute,
  patchDomainsDomain_idRoute,
  deleteDomainsDomain_idRoute,
  postDomainsDomain_idVerifyRoute,
  postApiKeysRoute,
  getApiKeysRoute,
  deleteApiKeysApi_key_idRoute,
  postAudiencesRoute,
  getAudiencesRoute,
  deleteAudiencesIdRoute,
  getAudiencesIdRoute,
  postAudiencesAudience_idContactsRoute,
  getAudiencesAudience_idContactsRoute,
  deleteAudiencesAudience_idContactsEmailRoute,
  deleteAudiencesAudience_idContactsIdRoute,
  getAudiencesAudience_idContactsIdRoute,
  patchAudiencesAudience_idContactsIdRoute,
  postBroadcastsRoute,
  getBroadcastsRoute,
  deleteBroadcastsIdRoute,
  getBroadcastsIdRoute,
  postBroadcastsIdSendRoute,
} from "./resend-routes";
import { OpenAPIHono } from "@hono/zod-openapi";
import { sendEmails } from "./usecases/send-emails";
import { ResendResponseError } from "./response-helper";
import { bearerTokenMiddleware } from "./middlewares/bearer-token";

class NotImplementedError extends Error {
  constructor() {
    super("Not implemented");
    this.name = "NotImplementedError";
  }
}

export const serverApp = new OpenAPIHono({
  defaultHook: (result, c) => {
    if (!result.success) {
      const issueMessages = result.error.issues
        .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
        .join("\n");

      throw new ResendResponseError(
        400,
        "validation_error",
        "We found an error with one or more fields in the request.\n" +
          "Please check the following fields:\n" +
          issueMessages,
      );
    }
  },
});

serverApp.use("*", bearerTokenMiddleware);

serverApp.openapi(postEmailsRoute, async (c) => {
  const payload = c.req.valid("json");

  const sendResult = await sendEmails([
    {
      from: payload.from,
      to: payload.to,
      subject: payload.subject,
      bcc: payload.bcc,
      cc: payload.cc,
      scheduledAt: payload.scheduled_at,
      replyTo: payload.reply_to,
      html: payload.html,
      text: payload.text,
      headers: payload.headers,
      attachments: payload.attachments,
      tags: payload.tags,
    },
  ]);

  if (sendResult.success) {
    return c.json({ id: sendResult.emailIds[0] });
  }

  throw new ResendResponseError(
    422,
    "invalid_attachment",
    "Attachment must have either a content or path.",
  );
});

serverApp.openapi(getEmailsEmail_idRoute, async (c) => {
  throw new NotImplementedError();
});

serverApp.openapi(patchEmailsEmail_idRoute, async (c) => {
  throw new NotImplementedError();
});

serverApp.openapi(postEmailsEmail_idCancelRoute, async (c) => {
  throw new NotImplementedError();
});

serverApp.openapi(postEmailsBatchRoute, async (c) => {
  throw new NotImplementedError();
});

serverApp.openapi(postDomainsRoute, async (c) => {
  throw new NotImplementedError();
});

serverApp.openapi(getDomainsRoute, async (c) => {
  throw new NotImplementedError();
});

serverApp.openapi(getDomainsDomain_idRoute, async (c) => {
  throw new NotImplementedError();
});

serverApp.openapi(patchDomainsDomain_idRoute, async (c) => {
  throw new NotImplementedError();
});

serverApp.openapi(deleteDomainsDomain_idRoute, async (c) => {
  throw new NotImplementedError();
});

serverApp.openapi(postDomainsDomain_idVerifyRoute, async (c) => {
  throw new NotImplementedError();
});

serverApp.openapi(postApiKeysRoute, async (c) => {
  throw new NotImplementedError();
});

serverApp.openapi(getApiKeysRoute, async (c) => {
  throw new NotImplementedError();
});

serverApp.openapi(deleteApiKeysApi_key_idRoute, async (c) => {
  throw new NotImplementedError();
});

serverApp.openapi(postAudiencesRoute, async (c) => {
  throw new NotImplementedError();
});

serverApp.openapi(getAudiencesRoute, async (c) => {
  throw new NotImplementedError();
});

serverApp.openapi(deleteAudiencesIdRoute, async (c) => {
  throw new NotImplementedError();
});

serverApp.openapi(getAudiencesIdRoute, async (c) => {
  throw new NotImplementedError();
});

serverApp.openapi(postAudiencesAudience_idContactsRoute, async (c) => {
  throw new NotImplementedError();
});

serverApp.openapi(getAudiencesAudience_idContactsRoute, async (c) => {
  throw new NotImplementedError();
});

serverApp.openapi(deleteAudiencesAudience_idContactsEmailRoute, async (c) => {
  throw new NotImplementedError();
});

serverApp.openapi(deleteAudiencesAudience_idContactsIdRoute, async (c) => {
  throw new NotImplementedError();
});

serverApp.openapi(getAudiencesAudience_idContactsIdRoute, async (c) => {
  throw new NotImplementedError();
});

serverApp.openapi(patchAudiencesAudience_idContactsIdRoute, async (c) => {
  throw new NotImplementedError();
});

serverApp.openapi(postBroadcastsRoute, async (c) => {
  throw new NotImplementedError();
});

serverApp.openapi(getBroadcastsRoute, async (c) => {
  throw new NotImplementedError();
});

serverApp.openapi(deleteBroadcastsIdRoute, async (c) => {
  throw new NotImplementedError();
});

serverApp.openapi(getBroadcastsIdRoute, async (c) => {
  throw new NotImplementedError();
});

serverApp.openapi(postBroadcastsIdSendRoute, async (c) => {
  throw new NotImplementedError();
});

serverApp.onError((error, c) => {
  if (error instanceof NotImplementedError) {
    return c.json(
      {
        statusCode: 501,
        message: "This endpoint is not implemented by resend-local.",
        type: "not_implemented",
      },
      501,
    );
  }

  if (error instanceof ResendResponseError) {
    return c.json(
      {
        statusCode: error.statusCode,
        message: error.message,
        type: error.type,
      },
      error.statusCode,
    );
  }

  console.error(error);

  return c.json(
    {
      statusCode: 500,
      message: "Internal server error",
      type: "internal_server_error",
    },
    500,
  );
});

serverApp.all("*", async (c) => {
  return c.json(
    {
      statusCode: 404,
      message: "The requested endpoint does not exist.",
      type: "not_found",
    },
    404,
  );
});
