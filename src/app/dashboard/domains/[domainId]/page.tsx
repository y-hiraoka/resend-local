import { DownloadIcon, GlobeIcon, MailIcon, PaperclipIcon } from "lucide-react";
import prettier from "prettier/standalone";
import { formatDistanceToNow } from "date-fns";
import prettierPluginHtml from "prettier/plugins/html";
import { notFound } from "next/navigation";
import Linkify from "linkify-react";
import cssModules from "./page.module.css";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { syntaxHighlight } from "@/lib/syntax-highliter";
import { Email } from "@/server/models/email";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { getDomain } from "@/server/usecases/get-domain";
import { DomainStatus } from "@/components/domain-status";
import { RegionFlag } from "@/components/region-flag";
import { DomainRegion } from "@/components/domain-region";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const Page: React.FC<{
  params: Promise<{ domainId: string }>;
}> = async ({ params }) => {
  const domain = await getDomain((await params).domainId);

  if (!domain) {
    notFound();
  }

  return (
    <div className="@container max-w-5xl mx-auto px-4 py-12">
      <div className="flex gap-4 items-start">
        <div className="grid place-items-center bg-muted size-20 border-2 rounded-3xl shadow-md">
          <GlobeIcon className="size-11 text-muted-foreground" />
        </div>
        <h2 className="flex gap-1 flex-col pt-2">
          <span className="text-muted-foreground">Domain</span>
          <span className="text-lg font-medium">{domain.name}</span>
        </h2>
      </div>
      <div className="grid grid-cols-2 gap-4 mt-8 @lg:grid-cols-3">
        <div className="w-full">
          <div className="text-sm text-muted-foreground mb-2">Created</div>
          <span className="text-sm">
            {formatDistanceToNow(new Date(domain.createdAt), {
              addSuffix: true,
            })}
          </span>
        </div>
        <div className="w-full">
          <div className="text-sm text-muted-foreground mb-2">Status</div>
          <DomainStatus status={domain.status} />
        </div>
        <div className="w-full">
          <div className="text-sm text-muted-foreground mb-2">Region</div>
          <div className="text-sm">
            <DomainRegion region={domain.region} />
          </div>
        </div>
      </div>
      <div className="rounded-2xl border p-4 mt-12">
        <h3 className="text-lg font-semibold mb-4">DNS Records</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Content</TableHead>
              <TableHead>TTL</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {domain.records.map((record, index) => (
              <TableRow key={index}>
                <TableCell>{record.type}</TableCell>
                <TableCell>{record.name}</TableCell>
                <TableCell>{record.value}</TableCell>
                <TableCell>{record.ttl}</TableCell>
                <TableCell>{record.priority}</TableCell>
                <TableCell>
                  <DomainStatus status={record.status} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Page;
