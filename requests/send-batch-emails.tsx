import { resend } from "./resend-client";

const sendResult = await resend.batch.send([
  {
    to: ["john@example.com", "doe@gmail.com"],
    from: "example@stin.ink",
    subject: "Hello from Resend",
    html: "<strong>Batch Email 1</strong>",
    text: "Batch Email 1 Text. see https://resend.com",
    cc: ["cc1@example.com", "cc2@example.com", "cc3@example.com"],
    bcc: ["bcc1@example.com", "bcc2@example.com", "bcc3@example.com"],
    headers: {
      "X-Custom-Header": "CustomValue",
      "X-Another-Header": "AnotherValue",
    },
    replyTo: [
      "reply-to1@gmail.com",
      "reply-to2@gmail.com",
      "reply-to3@gmail.com",
    ],
  },
  {
    to: ["john@example.com", "doe@gmail.com"],
    from: "example@stin.ink",
    subject: "Hello from Resend",
    html: "<strong>Batch Email 2</strong>",
    text: "Batch Email 2 Text. see https://resend.com",
    cc: ["cc1@example.com", "cc2@example.com", "cc3@example.com"],
    bcc: ["bcc1@example.com", "bcc2@example.com", "bcc3@example.com"],
    headers: {
      "X-Custom-Header": "CustomValue",
      "X-Another-Header": "AnotherValue",
    },
    replyTo: [
      "reply-to1@gmail.com",
      "reply-to2@gmail.com",
      "reply-to3@gmail.com",
    ],
  },
]);

console.dir(sendResult, { depth: null });
