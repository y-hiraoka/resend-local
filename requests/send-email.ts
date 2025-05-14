import { resend } from "./resend-client";

const sendResult = await resend.emails.send({
  to: ["john@example.com", "doe@gmail.com"],
  from: "example@stin.ink",
  subject: "Hello from Resend",
  html: "<strong>HTML</strong>",
  text: "Text. see https://resend.com",
  cc: ["cc1@example.com", "cc2@example.com", "cc3@example.com"],
  bcc: ["bcc1@example.com", "bcc2@example.com", "bcc3@example.com"],
  headers: {
    "X-Custom-Header": "CustomValue",
    "X-Another-Header": "AnotherValue",
  },
  tags: [
    { name: "tag1", value: "value1" },
    { name: "tag2", value: "value2" },
  ],
  replyTo: [
    "reply-to1@gmail.com",
    "reply-to2@gmail.com",
    "reply-to3@gmail.com",
  ],
  scheduledAt: new Date(2023, 10, 1, 12, 0, 0).toISOString(),
  attachments: [
    {
      filename: "dummy-file.pdf",
      path: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    },
    {
      filename: "sample.txt",
      content: Buffer.from("Hello, world!").toString("base64"),
    },
  ],
});

console.dir(sendResult, { depth: null });

const retrieveResult = await resend.emails.get(sendResult.data?.id ?? "");

console.dir(retrieveResult, { depth: null });
