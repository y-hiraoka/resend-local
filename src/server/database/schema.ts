import * as dr from "drizzle-orm/sqlite-core";

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

const emailId = dr
  .text("email_id")
  .notNull()
  .references(() => email.id);

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

export const emailAttachment = dr.sqliteTable("email_attachment", {
  id: uuid("id"),
  emailId: emailId,
  order: order,
  filename: dr.text("filename"),
  contentType: dr.text("content_type").notNull(),
  content: dr.blob("content", { mode: "buffer" }).notNull(),
});
