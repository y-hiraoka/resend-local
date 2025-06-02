import { OpenAPIHono } from "@hono/zod-openapi";
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
import { sendEmails } from "./usecases/send-emails";
import { ResendResponseError } from "./response-helper";
import { bearerTokenMiddleware } from "./middlewares/bearer-token";
import { getEmail } from "./usecases/get-email";
import { createDomain } from "./usecases/create-domain";
import { getDomain } from "./usecases/get-domain";
import { getDomains } from "./usecases/get-domains";

class NotImplementedError extends Error {
  constructor() {
    super("Not implemented");
    this.name = "NotImplementedError";
  }
}

export const serverApp = new OpenAPIHono({
  defaultHook: (result) => {
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
  const email = await getEmail(c.req.param("email_id"));
  if (!email) {
    throw new ResendResponseError(404, "not_found", "Email not found");
  }

  return c.json({
    object: "email",
    id: email.id,
    to: email.to,
    from: email.from,
    created_at: email.createdAt,
    subject: email.subject,
    html: email.html,
    text: email.text,
    bcc: email.bcc,
    cc: email.cc,
    reply_to: email.replyTo,
    last_event: email.lastEvent,
  });
});

serverApp.openapi(patchEmailsEmail_idRoute, async () => {
  throw new NotImplementedError();
});

serverApp.openapi(postEmailsEmail_idCancelRoute, async () => {
  throw new NotImplementedError();
});

serverApp.openapi(postEmailsBatchRoute, async (c) => {
  const payload = c.req.valid("json");
  const sendResult = await sendEmails(
    payload.map((email) => ({
      from: email.from,
      to: email.to,
      subject: email.subject,
      bcc: email.bcc,
      cc: email.cc,
      scheduledAt: email.scheduled_at,
      replyTo: email.reply_to,
      html: email.html,
      text: email.text,
      headers: email.headers,
      attachments: email.attachments,
      tags: email.tags,
    })),
  );

  if (sendResult.success) {
    return c.json({ data: sendResult.emailIds.map((id) => ({ id })) });
  }

  throw new ResendResponseError(
    422,
    "invalid_attachment",
    "Attachment must have either a content or path.",
  );
});

serverApp.openapi(postDomainsRoute, async (c) => {
  const created = await createDomain({
    name: c.req.valid("json").name,
    region: c.req.valid("json").region ?? "us-east-1",
  });
  if (created.success) {
    return c.json({
      id: created.domain.id,
      name: created.domain.name,
      created_at: created.domain.createdAt,
      region: created.domain.region,
      status: created.domain.status,
      records: created.domain.records,
    });
  }

  if (created.reason === "domain_already_exists") {
    throw new ResendResponseError(
      409,
      "validation_error",
      "Domain already exists.",
    );
  }

  throw new ResendResponseError(
    422,
    "validation_error",
    "Invalid domain name.",
  );
});

serverApp.openapi(getDomainsRoute, async (c) => {
  const domainsResult = await getDomains({
    offset: 0,
    limit: 10000,
  });

  return c.json({
    data: domainsResult.domains.map((domain) => ({
      id: domain.id,
      name: domain.name,
      status: domain.status,
      created_at: domain.createdAt,
      region: domain.region,
    })),
  });
});

serverApp.openapi(getDomainsDomain_idRoute, async (c) => {
  const domain = await getDomain(c.req.param("domain_id"));
  if (!domain) {
    throw new ResendResponseError(404, "not_found", "Domain not found");
  }
  return c.json(domain);
});

serverApp.openapi(patchDomainsDomain_idRoute, async () => {
  throw new NotImplementedError();
});

serverApp.openapi(deleteDomainsDomain_idRoute, async () => {
  throw new NotImplementedError();
});

serverApp.openapi(postDomainsDomain_idVerifyRoute, async () => {
  throw new NotImplementedError();
});

serverApp.openapi(postApiKeysRoute, async () => {
  throw new NotImplementedError();
});

serverApp.openapi(getApiKeysRoute, async () => {
  throw new NotImplementedError();
});

serverApp.openapi(deleteApiKeysApi_key_idRoute, async () => {
  throw new NotImplementedError();
});

serverApp.openapi(postAudiencesRoute, async () => {
  throw new NotImplementedError();
});

serverApp.openapi(getAudiencesRoute, async () => {
  throw new NotImplementedError();
});

serverApp.openapi(deleteAudiencesIdRoute, async () => {
  throw new NotImplementedError();
});

serverApp.openapi(getAudiencesIdRoute, async () => {
  throw new NotImplementedError();
});

serverApp.openapi(postAudiencesAudience_idContactsRoute, async () => {
  throw new NotImplementedError();
});

serverApp.openapi(getAudiencesAudience_idContactsRoute, async () => {
  throw new NotImplementedError();
});

serverApp.openapi(deleteAudiencesAudience_idContactsEmailRoute, async () => {
  throw new NotImplementedError();
});

serverApp.openapi(deleteAudiencesAudience_idContactsIdRoute, async () => {
  throw new NotImplementedError();
});

serverApp.openapi(getAudiencesAudience_idContactsIdRoute, async () => {
  throw new NotImplementedError();
});

serverApp.openapi(patchAudiencesAudience_idContactsIdRoute, async () => {
  throw new NotImplementedError();
});

serverApp.openapi(postBroadcastsRoute, async () => {
  throw new NotImplementedError();
});

serverApp.openapi(getBroadcastsRoute, async () => {
  throw new NotImplementedError();
});

serverApp.openapi(deleteBroadcastsIdRoute, async () => {
  throw new NotImplementedError();
});

serverApp.openapi(getBroadcastsIdRoute, async () => {
  throw new NotImplementedError();
});

serverApp.openapi(postBroadcastsIdSendRoute, async () => {
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
