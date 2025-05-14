import React from "react";
import { resend } from "./resend-client";
import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

const StripeWelcomeEmail = () => (
  <Html>
    <Head />
    <Preview>You're now ready to make live transactions with Stripe!</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={box}>
          <Img
            src={`data:image/png;base64,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`}
            width="49"
            height="21"
            alt="Stripe"
          />
          <Hr style={hr} />
          <Text style={paragraph}>
            Thanks for submitting your account information. You're now ready to
            make live transactions with Stripe!
          </Text>
          <Text style={paragraph}>
            You can view your payments and a variety of other information about
            your account right from your dashboard.
          </Text>
          <Button style={button} href="https://dashboard.stripe.com/login">
            View your Stripe Dashboard
          </Button>
          <Hr style={hr} />
          <Text style={paragraph}>
            If you haven't finished your integration, you might find our{" "}
            <Link style={anchor} href="https://stripe.com/docs">
              docs
            </Link>{" "}
            handy.
          </Text>
          <Text style={paragraph}>
            Once you're ready to start accepting payments, you'll just need to
            use your live{" "}
            <Link
              style={anchor}
              href="https://dashboard.stripe.com/login?redirect=%2Fapikeys"
            >
              API keys
            </Link>{" "}
            instead of your test API keys. Your account can simultaneously be
            used for both test and live requests, so you can continue testing
            while accepting live payments. Check out our{" "}
            <Link style={anchor} href="https://stripe.com/docs/dashboard">
              tutorial about account basics
            </Link>
            .
          </Text>
          <Text style={paragraph}>
            Finally, we've put together a{" "}
            <Link
              style={anchor}
              href="https://stripe.com/docs/checklist/website"
            >
              quick checklist
            </Link>{" "}
            to ensure your website conforms to card network standards.
          </Text>
          <Text style={paragraph}>
            We'll be here to help you with any step along the way. You can find
            answers to most questions and get in touch with us on our{" "}
            <Link style={anchor} href="https://support.stripe.com/">
              support site
            </Link>
            .
          </Text>
          <Text style={paragraph}>— The Stripe team</Text>
          <Hr style={hr} />
          <Text style={footer}>
            Stripe, 354 Oyster Point Blvd, South San Francisco, CA 94080
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
};

const box = {
  padding: "0 48px",
};

const hr = {
  borderColor: "#e6ebf1",
  margin: "20px 0",
};

const paragraph = {
  color: "#525f7f",

  fontSize: "16px",
  lineHeight: "24px",
  textAlign: "left" as const,
};

const anchor = {
  color: "#556cd6",
};

const button = {
  backgroundColor: "#656ee8",
  borderRadius: "5px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  width: "100%",
  padding: "10px",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
  lineHeight: "16px",
};

const sendResult = await resend.emails.send({
  to: ["john@example.com", "doe@gmail.com"],
  from: "example@stin.ink",
  subject: "Rich Email with React",
  react: <StripeWelcomeEmail />,
  text: "Text",
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
