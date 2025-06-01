import { relations } from "drizzle-orm";
import * as dr from "drizzle-orm/sqlite-core";
import { Region } from "../models/region";

const uuid = <T extends string>(colName: T) =>
  dr
    .text(colName)
    .primaryKey()
    .$default(() => crypto.randomUUID());

const timestamps = {
  createdAt: dr
    .integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .$default(() => new Date()),
  updatedAt: dr
    .integer("updated_at", { mode: "timestamp_ms" })
    .notNull()
    .$default(() => new Date())
    .$onUpdate(() => new Date()),
};

export const email = dr.sqliteTable(
  "email",
  {
    id: uuid("id"),
    from: dr.text("from").notNull(),
    subject: dr.text("subject").notNull(),
    text: dr.text("text_body"),
    html: dr.text("html_body"),
    headers: dr
      .text("headers", { mode: "json" })
      .$type<Record<string, string>>(),
    scheduledAt: dr.integer("scheduled_at", { mode: "timestamp_ms" }),
    ...timestamps,
  },
  (table) => [
    dr.index("email_from_idx").on(table.from),
    dr.index("email_created_at_idx").on(table.createdAt),
  ],
);

export const emailRelations = relations(email, ({ many }) => ({
  to: many(emailTo),
  cc: many(emailCc),
  bcc: many(emailBcc),
  replyTo: many(emailReplyTo),
  tags: many(emailTag),
  attachments: many(emailAttachment),
}));

const emailId = dr
  .text("email_id")
  .notNull()
  .references(() => email.id, { onDelete: "cascade" });

const order = dr.integer("order").notNull();

export const emailTo = dr.sqliteTable(
  "email_to",
  {
    emailId: emailId,
    order: order,
    to: dr.text("to").notNull(),
  },
  (table) => [
    dr.primaryKey({
      columns: [table.emailId, table.order],
    }),
  ],
);

export const emailToRelations = relations(emailTo, ({ one }) => ({
  email: one(email, { fields: [emailTo.emailId], references: [email.id] }),
}));

export const emailCc = dr.sqliteTable(
  "email_cc",
  {
    emailId: emailId,
    order: order,
    cc: dr.text("cc").notNull(),
  },
  (table) => [
    dr.primaryKey({
      columns: [table.emailId, table.order],
    }),
  ],
);

export const emailCcRelations = relations(emailCc, ({ one }) => ({
  email: one(email, { fields: [emailCc.emailId], references: [email.id] }),
}));

export const emailBcc = dr.sqliteTable(
  "email_bcc",
  {
    emailId: emailId,
    order: order,
    bcc: dr.text("bcc").notNull(),
  },
  (table) => [
    dr.primaryKey({
      columns: [table.emailId, table.order],
    }),
  ],
);

export const emailBccRelations = relations(emailBcc, ({ one }) => ({
  email: one(email, { fields: [emailBcc.emailId], references: [email.id] }),
}));

export const emailReplyTo = dr.sqliteTable(
  "email_reply_to",
  {
    emailId: emailId,
    order: order,
    replyTo: dr.text("reply_to").notNull(),
  },
  (table) => [
    dr.primaryKey({
      columns: [table.emailId, table.order],
    }),
  ],
);

export const emailReplyToRelations = relations(emailReplyTo, ({ one }) => ({
  email: one(email, { fields: [emailReplyTo.emailId], references: [email.id] }),
}));

export const emailTag = dr.sqliteTable(
  "email_tag",
  {
    emailId: emailId,
    order: order,
    name: dr.text("name").notNull(),
    value: dr.text("value").notNull(),
  },
  (table) => [
    dr.primaryKey({
      columns: [table.emailId, table.order],
    }),
  ],
);

export const emailTagRelations = relations(emailTag, ({ one }) => ({
  email: one(email, { fields: [emailTag.emailId], references: [email.id] }),
}));

export const emailAttachment = dr.sqliteTable("email_attachment", {
  id: uuid("id"),
  emailId: emailId,
  order: order,
  filename: dr.text("filename"),
  contentType: dr.text("content_type").notNull(),
  content: dr.blob("content", { mode: "buffer" }).notNull(),
});

export const emailAttachmentRelations = relations(
  emailAttachment,
  ({ one }) => ({
    email: one(email, {
      fields: [emailAttachment.emailId],
      references: [email.id],
    }),
  }),
);

export const domain = dr.sqliteTable("domain", {
  id: uuid("id"),
  name: dr.text("name").notNull().unique(),
  createdAt: timestamps.createdAt,
  updatedAt: timestamps.updatedAt,
  region: dr.text("region").notNull().$type<Region>(),
});

export const domainRelations = relations(domain, ({ many }) => ({
  records: many(domainRecord),
}));

export const domainRecord = dr.sqliteTable("domain_record", {
  id: uuid("id"),
  domainId: dr
    .text("domain_id")
    .notNull()
    .references(() => domain.id, { onDelete: "cascade" }),
  record: dr.text("record").notNull().$type<"DKIM" | "SPF">(),
  name: dr.text("name").notNull(),
  type: dr.text("type").notNull(),
  status: dr
    .text("status")
    .notNull()
    .$type<
      "not_started" | "pending" | "verified" | "failure" | "temporary_failure"
    >(),
  value: dr.text("value").notNull(),
  ttl: dr.text("ttl").notNull(),
  priority: dr.integer("priority"),
  createdAt: timestamps.createdAt,
  update1dAt: timestamps.updatedAt,
});

export const domainRecordRelations = relations(domainRecord, ({ one }) => ({
  domain: one(domain, {
    fields: [domainRecord.domainId],
    references: [domain.id],
  }),
}));
