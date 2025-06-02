import { notFound } from "next/navigation";
import { Suspense } from "react";
import { DomainView } from "./domain-view";
import { getDomain } from "@/server/usecases/get-domain";



const Page: React.FC<{
  params: Promise<{ domainId: string }>;
}> = async ({ params }) => {
  const domainId = (await params).domainId;
  const domainPromise = getDomain(domainId).then(
    (domain) => domain || notFound(),
  );

  return (
    <Suspense>
      <DomainView domainId={domainId} domainPromise={domainPromise} />
    </Suspense>
  );
};

export default Page;
