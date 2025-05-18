import { DownloadIcon, MailIcon, PaperclipIcon } from "lucide-react";
import prettier from "prettier/standalone";
import prettierPluginHtml from "prettier/plugins/html";
import { notFound } from "next/navigation";
import Linkify from "linkify-react";
import cssModules from "./page.module.css";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { syntaxHighlight } from "@/lib/syntax-highliter";
import { Email } from "@/server/models/email";
import { Label } from "@/components/ui/label";
import { getEmail } from "@/server/usecases/get-email";
import { Button } from "@/components/ui/button";

const Page: React.FC<{
  params: Promise<{ emailId: string }>;
}> = async ({ params }) => {
  const email = await getEmail((await params).emailId);

  if (!email) {
    notFound();
  }

  return (
    <div className="@container max-w-5xl mx-auto px-4 py-12">
      <div className="flex gap-4 items-start">
        <div className="grid place-items-center bg-muted size-20 border-2 rounded-3xl shadow-md">
          <MailIcon className="size-11 text-muted-foreground" />
        </div>
        <h2 className="flex gap-1 flex-col pt-2">
          <span className="text-muted-foreground">Email</span>
          <span className="text-lg font-medium">{email.to[0]}</span>
        </h2>
      </div>
      <div className="grid grid-cols-2 gap-4 mt-8 @lg:grid-cols-3">
        <div className="w-full">
          <div className="text-sm text-muted-foreground mb-2">From</div>
          <span>{email.from}</span>
        </div>
        <div className="w-full">
          <div className="text-sm text-muted-foreground mb-2">Subject</div>
          <span>{email.subject}</span>
        </div>
        <div className="w-full">
          <div className="text-sm text-muted-foreground mb-2">To</div>
          <div>
            {email.to.map((to, index) => (
              <span key={index} className="block">
                {to}
              </span>
            ))}
          </div>
        </div>
      </div>
      <Tabs
        defaultValue={email.html != null ? "preview" : "plain-text"}
        className="rounded-2xl border p-4 mt-12"
      >
        <TabsList className="w-full mb-2">
          <TabsTrigger value="preview" disabled={email.html == null}>
            Preview
          </TabsTrigger>
          <TabsTrigger value="plain-text" disabled={email.text == null}>
            Plain Text
          </TabsTrigger>
          <TabsTrigger value="html" disabled={email.html == null}>
            HTML
          </TabsTrigger>
          <TabsTrigger value="attachments">Attachments</TabsTrigger>
          <TabsTrigger value="headers">Headers</TabsTrigger>
        </TabsList>
        <TabsContent value="preview">
          <HtmlPreview html={email.html} />
        </TabsContent>
        <TabsContent value="plain-text">
          <PlainTextView text={email.text} />
        </TabsContent>
        <TabsContent value="html">
          <SyntaxHighlightedHtmlView html={email.html} />
        </TabsContent>
        <TabsContent value="attachments">
          <AttachmentsView attachments={email.attachments} />
        </TabsContent>
        <TabsContent value="headers">
          <HeadersView headers={email.headers} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Page;

const HtmlPreview: React.FC<{
  html: Email["html"];
}> = ({ html }) => {
  if (!html) {
    return <div className="text-sm text-muted-foreground">No HTML</div>;
  }

  return (
    <iframe
      className="w-full border rounded-lg h-150 overflow-auto"
      srcDoc={html}
      sandbox="allow-same-origin allow-scripts allow-modals allow-forms"
    />
  );
};

const PlainTextView: React.FC<{
  text: Email["text"];
}> = ({ text }) => {
  if (!text) {
    return (
      <div className="h-150">
        <span className="text-sm text-muted-foreground">No Plain Text</span>
      </div>
    );
  }

  return (
    <div
      className={`whitespace-pre-wrap h-150 overflow-auto ${cssModules.plainTextView}`}
    >
      <Linkify>{text}</Linkify>
    </div>
  );
};

const SyntaxHighlightedHtmlView: React.FC<{
  html: Email["html"];
}> = async ({ html }) => {
  const syntaxHighlightedHtml = html
    ? await syntaxHighlight(html, "html")
    : null;

  const prettierHtml = await prettier.format(html ?? "", {
    parser: "html",
    plugins: [prettierPluginHtml],
  });

  const prettierSyntaxHighlightedHtml = await syntaxHighlight(
    prettierHtml,
    "html",
  );

  return (
    <div
      className={`h-150 overflow-auto ${cssModules.syntaxHighlightedContainer}`}
    >
      <div className="flex items-center space-x-2 mb-2">
        <input type="checkbox" id="pretty-print" className="accent-primary" />
        <Label htmlFor="pretty-print">pretty print</Label>
      </div>
      <div
        className={`rounded-lg ${cssModules.syntaxHighlightedHtml}`}
        dangerouslySetInnerHTML={{ __html: syntaxHighlightedHtml ?? "" }}
      />
      <div
        className={`rounded-lg ${cssModules.prettierSyntaxHighlightedHtml}`}
        dangerouslySetInnerHTML={{
          __html: prettierSyntaxHighlightedHtml ?? "",
        }}
      />
    </div>
  );
};

const AttachmentsView: React.FC<{
  attachments: Email["attachments"];
}> = ({ attachments }) => {
  if (attachments.length === 0) {
    return (
      <div className="text-sm text-muted-foreground h-150">No Attachments</div>
    );
  }

  return (
    <div className="flex flex-col gap-3 h-150 overflow-auto">
      {attachments.map((attachment) => (
        <div
          key={attachment.id}
          className="flex gap-3 rounded-lg border items-center p-3"
        >
          <div className="rounded-md border-2 bg-muted size-10 grid place-items-center">
            <PaperclipIcon className="text-muted-foreground size-5" />
          </div>
          <div className="flex flex-1 flex-col gap-1">
            <span className="text-sm text-muted-foreground">
              {attachment.filename}
            </span>
            <span>{attachment.contentType}</span>
          </div>
          <Button variant="ghost" size="icon" asChild>
            <a
              target="_blank"
              download={attachment.filename}
              href={`/dashboard-api/attachments/${attachment.id}`}
            >
              <DownloadIcon className="size-4" />
            </a>
          </Button>
        </div>
      ))}
    </div>
  );
};

const HeadersView: React.FC<{
  headers: Record<string, string> | null | undefined;
}> = async ({ headers }) => {
  const syntaxHighlightedHeaders = await syntaxHighlight(
    JSON.stringify(headers, null, 2),
    "json",
  );

  return (
    <div className="h-150 overflow-auto">
      <div
        className="overflow-hidden rounded-lg"
        dangerouslySetInnerHTML={{ __html: syntaxHighlightedHeaders ?? "" }}
      />
    </div>
  );
};
