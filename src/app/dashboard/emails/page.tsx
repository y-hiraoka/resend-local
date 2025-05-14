import { z } from "zod";
import { Suspense } from "react";
import { EmailList } from "./email-list";
import { getEmails } from "@/server/usecases/get-emails";

const SearchParamsSchema = z.object({
  page: z.coerce.number().default(1).catch(1),
  count: z.coerce.number().default(10).catch(10),
});

const Page: React.FC<{ searchParams: Promise<unknown> }> = async ({
  searchParams,
}) => {
  const params = SearchParamsSchema.parse(await searchParams);

  const emailsPromise = getEmails({
    offset: params.page - 1,
    limit: params.count,
  });

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Emails</h2>
      <Suspense>
        <EmailList
          page={params.page}
          count={params.count}
          emailsPromise={emailsPromise}
        />
      </Suspense>
    </div>
  );
};

export default Page;
