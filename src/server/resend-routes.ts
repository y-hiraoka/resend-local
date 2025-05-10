import { createRoute, z } from '@hono/zod-openapi'

const AttachmentSchema = z
  .object({ content: z.string(), filename: z.string(), path: z.string(), content_type: z.string() })
  .partial()
  .openapi('Attachment')

const TagSchema = z.object({ name: z.string(), value: z.string() }).partial().openapi('Tag')

const SendEmailRequestSchema = z
  .object({
    from: z.string(),
    to: z.union([z.string(), z.array(z.string()).min(1).max(50)]),
    subject: z.string(),
    bcc: z.union([z.string(), z.array(z.string())]).optional(),
    cc: z.union([z.string(), z.array(z.string())]).optional(),
    reply_to: z.union([z.string(), z.array(z.string())]).optional(),
    html: z.string().optional(),
    text: z.string().optional(),
    headers: z.object({}).optional(),
    scheduled_at: z.string().optional(),
    attachments: z.array(AttachmentSchema).optional(),
    tags: z.array(TagSchema).optional(),
  })
  .openapi('SendEmailRequest')

const SendEmailResponseSchema = z.object({ id: z.string() }).partial().openapi('SendEmailResponse')

const UpdateEmailOptionsSchema = z
  .object({ scheduled_at: z.string() })
  .partial()
  .openapi('UpdateEmailOptions')

const EmailSchema = z
  .object({
    object: z.string().openapi({ example: 'email' }),
    id: z.string().openapi({ example: '4ef9a417_02e9_4d39_ad75_9611e0fcc33c' }),
    to: z.array(z.string()),
    from: z.string().openapi({ example: 'Acme <onboarding@resend.dev>' }),
    created_at: z.string().datetime().openapi({ example: '2023_04_03T22:13:42.674981+00:00' }),
    subject: z.string().openapi({ example: 'Hello World' }),
    html: z.string().openapi({ example: 'Congrats on sending your <strong>first email</strong>!' }),
    text: z.string(),
    bcc: z.array(z.string()),
    cc: z.array(z.string()),
    reply_to: z.array(z.string()),
    last_event: z.string().openapi({ example: 'delivered' }),
  })
  .partial()
  .openapi('Email')

const CreateBatchEmailsResponseSchema = z
  .object({ data: z.array(z.object({ id: z.string() }).partial()) })
  .partial()
  .openapi('CreateBatchEmailsResponse')

const CreateDomainRequestSchema = z
  .object({ name: z.string(), region: z.enum(['us_east_1', 'eu_west_1', 'sa_east_1']).optional() })
  .openapi('CreateDomainRequest')

const DomainRecordSchema = z
  .object({
    record: z.string(),
    name: z.string(),
    type: z.string(),
    ttl: z.string(),
    status: z.string(),
    value: z.string(),
    priority: z.number().int(),
  })
  .partial()
  .openapi('DomainRecord')

const CreateDomainResponseSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    created_at: z.string().datetime(),
    status: z.string(),
    records: z.array(DomainRecordSchema),
    region: z.string(),
  })
  .partial()
  .openapi('CreateDomainResponse')

const UpdateDomainOptionsSchema = z
  .object({
    open_tracking: z.boolean(),
    click_tracking: z.boolean(),
    tls: z.string().default('opportunistic'),
  })
  .partial()
  .openapi('UpdateDomainOptions')

const DomainSchema = z
  .object({
    object: z.string().openapi({ example: 'domain' }),
    id: z.string().openapi({ example: 'd91cd9bd_1176_453e_8fc1_35364d380206' }),
    name: z.string().openapi({ example: 'example.com' }),
    status: z.string().openapi({ example: 'not_started' }),
    created_at: z.string().datetime().openapi({ example: '2023_04_26T20:21:26.347412+00:00' }),
    region: z.string().openapi({ example: 'us_east_1' }),
    records: z.array(DomainRecordSchema),
  })
  .partial()
  .openapi('Domain')

const VerifyDomainResponseSchema = z
  .object({
    object: z.string().openapi({ example: 'domain' }),
    id: z.string().openapi({ example: 'd91cd9bd_1176_453e_8fc1_35364d380206' }),
  })
  .partial()
  .openapi('VerifyDomainResponse')

const ListDomainsItemSchema = z
  .object({
    id: z.string().openapi({ example: 'd91cd9bd_1176_453e_8fc1_35364d380206' }),
    name: z.string().openapi({ example: 'example.com' }),
    status: z.string().openapi({ example: 'not_started' }),
    created_at: z.string().datetime().openapi({ example: '2023_04_26T20:21:26.347412+00:00' }),
    region: z.string().openapi({ example: 'us_east_1' }),
  })
  .partial()
  .openapi('ListDomainsItem')

const ListDomainsResponseSchema = z
  .object({ data: z.array(ListDomainsItemSchema) })
  .partial()
  .openapi('ListDomainsResponse')

const UpdateDomainResponseSuccessSchema = z
  .object({
    id: z.string().openapi({ example: 'd91cd9bd_1176_453e_8fc1_35364d380206' }),
    object: z.string().openapi({ example: 'domain' }),
  })
  .partial()
  .openapi('UpdateDomainResponseSuccess')

const DeleteDomainResponseSchema = z
  .object({
    object: z.string().openapi({ example: 'domain' }),
    id: z.string().openapi({ example: 'd91cd9bd_1176_453e_8fc1_35364d380206' }),
    deleted: z.boolean(),
  })
  .partial()
  .openapi('DeleteDomainResponse')

const CreateApiKeyRequestSchema = z
  .object({
    name: z.string(),
    permission: z.enum(['full_access', 'sending_access']).optional(),
    domain_id: z.string().optional(),
  })
  .openapi('CreateApiKeyRequest')

const CreateApiKeyResponseSchema = z
  .object({ id: z.string(), token: z.string() })
  .partial()
  .openapi('CreateApiKeyResponse')

const ApiKeySchema = z
  .object({ id: z.string(), name: z.string(), created_at: z.string().datetime() })
  .partial()
  .openapi('ApiKey')

const ListApiKeysResponseSchema = z
  .object({ data: z.array(ApiKeySchema) })
  .partial()
  .openapi('ListApiKeysResponse')

const CreateAudienceOptionsSchema = z.object({ name: z.string() }).openapi('CreateAudienceOptions')

const CreateAudienceResponseSuccessSchema = z
  .object({
    id: z.string().openapi({ example: '78261eea_8f8b_4381_83c6_79fa7120f1cf' }),
    object: z.string().openapi({ example: 'audience' }),
    name: z.string().openapi({ example: 'Registered Users' }),
  })
  .partial()
  .openapi('CreateAudienceResponseSuccess')

const GetAudienceResponseSuccessSchema = z
  .object({
    id: z.string().openapi({ example: '78261eea_8f8b_4381_83c6_79fa7120f1cf' }),
    object: z.string().openapi({ example: 'audience' }),
    name: z.string().openapi({ example: 'Registered Users' }),
    created_at: z.string().openapi({ example: '2023_10_06T22:59:55.977Z' }),
  })
  .partial()
  .openapi('GetAudienceResponseSuccess')

const RemoveAudienceResponseSuccessSchema = z
  .object({
    id: z.string().openapi({ example: '78261eea_8f8b_4381_83c6_79fa7120f1cf' }),
    object: z.string().openapi({ example: 'audience' }),
    deleted: z.boolean(),
  })
  .partial()
  .openapi('RemoveAudienceResponseSuccess')

const ListAudiencesResponseSuccessSchema = z
  .object({
    object: z.string().openapi({ example: 'list' }),
    data: z.array(
      z
        .object({
          id: z.string().openapi({ example: '78261eea_8f8b_4381_83c6_79fa7120f1cf' }),
          name: z.string().openapi({ example: 'Registered Users' }),
          created_at: z.string().datetime().openapi({ example: '2023_10_06T22:59:55.977Z' }),
        })
        .partial(),
    ),
  })
  .partial()
  .openapi('ListAudiencesResponseSuccess')

const CreateContactOptionsSchema = z
  .object({
    email: z.string().openapi({ example: 'steve.wozniak@gmail.com' }),
    first_name: z.string().openapi({ example: 'Steve' }).optional(),
    last_name: z.string().openapi({ example: 'Wozniak' }).optional(),
    unsubscribed: z.boolean().optional(),
    audience_id: z.string().openapi({ example: '78261eea_8f8b_4381_83c6_79fa7120f1cf' }).optional(),
  })
  .openapi('CreateContactOptions')

const CreateContactResponseSuccessSchema = z
  .object({
    object: z.string().openapi({ example: 'contact' }),
    id: z.string().openapi({ example: '479e3145_dd38_476b_932c_529ceb705947' }),
  })
  .partial()
  .openapi('CreateContactResponseSuccess')

const GetContactResponseSuccessSchema = z
  .object({
    object: z.string().openapi({ example: 'contact' }),
    id: z.string().openapi({ example: 'e169aa45_1ecf_4183_9955_b1499d5701d3' }),
    email: z.string().openapi({ example: 'steve.wozniak@gmail.com' }),
    first_name: z.string().openapi({ example: 'Steve' }),
    last_name: z.string().openapi({ example: 'Wozniak' }),
    created_at: z.string().datetime().openapi({ example: '2023_10_06T23:47:56.678Z' }),
    unsubscribed: z.boolean(),
  })
  .partial()
  .openapi('GetContactResponseSuccess')

const UpdateContactOptionsSchema = z
  .object({
    email: z.string().openapi({ example: 'steve.wozniak@gmail.com' }),
    first_name: z.string().openapi({ example: 'Steve' }),
    last_name: z.string().openapi({ example: 'Wozniak' }),
    unsubscribed: z.boolean(),
  })
  .partial()
  .openapi('UpdateContactOptions')

const UpdateContactResponseSuccessSchema = z
  .object({
    object: z.string().openapi({ example: 'contact' }),
    id: z.string().openapi({ example: '479e3145_dd38_476b_932c_529ceb705947' }),
  })
  .partial()
  .openapi('UpdateContactResponseSuccess')

const RemoveContactResponseSuccessSchema = z
  .object({
    object: z.string().openapi({ example: 'contact' }),
    id: z.string().openapi({ example: '520784e2_887d_4c25_b53c_4ad46ad38100' }),
    deleted: z.boolean(),
  })
  .partial()
  .openapi('RemoveContactResponseSuccess')

const ListContactsResponseSuccessSchema = z
  .object({
    object: z.string().openapi({ example: 'list' }),
    data: z.array(
      z
        .object({
          id: z.string().openapi({ example: 'e169aa45_1ecf_4183_9955_b1499d5701d3' }),
          email: z.string().openapi({ example: 'steve.wozniak@gmail.com' }),
          first_name: z.string().openapi({ example: 'Steve' }),
          last_name: z.string().openapi({ example: 'Wozniak' }),
          created_at: z.string().datetime().openapi({ example: '2023_10_06T23:47:56.678Z' }),
          unsubscribed: z.boolean(),
        })
        .partial(),
    ),
  })
  .partial()
  .openapi('ListContactsResponseSuccess')

const CreateBroadcastOptionsSchema = z
  .object({
    name: z.string().optional(),
    audience_id: z.string(),
    from: z.string(),
    subject: z.string(),
    reply_to: z.array(z.string()).optional(),
    preview_text: z.string().openapi({ example: 'Here are our announcements' }).optional(),
    html: z.string().optional(),
    text: z.string().optional(),
  })
  .openapi('CreateBroadcastOptions')

const CreateBroadcastResponseSuccessSchema = z
  .object({
    id: z.string().openapi({ example: '78261eea_8f8b_4381_83c6_79fa7120f1cf' }),
    object: z.string().openapi({ example: 'broadcast' }),
  })
  .partial()
  .openapi('CreateBroadcastResponseSuccess')

const ListBroadcastsResponseSuccessSchema = z
  .object({
    object: z.string().openapi({ example: 'list' }),
    data: z.array(
      z
        .object({
          id: z.string().openapi({ example: 'e169aa45_1ecf_4183_9955_b1499d5701d3' }),
          name: z.string().openapi({ example: 'November announcements' }),
          audience_id: z.string().openapi({ example: '78261eea_8f8b_4381_83c6_79fa7120f1cf' }),
          status: z.string().openapi({ example: 'draft' }),
          created_at: z.string().datetime().openapi({ example: '2023_10_06T22:59:55.977Z' }),
          scheduled_at: z.string().datetime().openapi({ example: '2023_10_06T22:59:55.977Z' }),
          sent_at: z.string().datetime().openapi({ example: '2023_10_06T22:59:55.977Z' }),
        })
        .partial(),
    ),
  })
  .partial()
  .openapi('ListBroadcastsResponseSuccess')

const GetBroadcastResponseSuccessSchema = z
  .object({
    id: z.string().openapi({ example: 'e169aa45_1ecf_4183_9955_b1499d5701d3' }),
    name: z.string().openapi({ example: 'November announcements' }),
    audience_id: z.string(),
    from: z.string().openapi({ example: 'Acme <onboarding@resend.dev>' }),
    subject: z.string().openapi({ example: 'Hello World' }),
    reply_to: z.array(z.string()),
    preview_text: z.string().openapi({ example: 'Here are our announcements' }),
    status: z.string().openapi({ example: 'draft' }),
    created_at: z.string().datetime().openapi({ example: '2023_10_06T22:59:55.977Z' }),
    scheduled_at: z.string().datetime().openapi({ example: '2023_10_06T22:59:55.977Z' }),
    sent_at: z.string().datetime().openapi({ example: '2023_10_06T22:59:55.977Z' }),
  })
  .partial()
  .openapi('GetBroadcastResponseSuccess')

const RemoveBroadcastResponseSuccessSchema = z
  .object({
    id: z.string().openapi({ example: '78261eea_8f8b_4381_83c6_79fa7120f1cf' }),
    object: z.string().openapi({ example: 'broadcast' }),
    deleted: z.boolean(),
  })
  .partial()
  .openapi('RemoveBroadcastResponseSuccess')

const SendBroadcastOptionsSchema = z
  .object({ scheduled_at: z.string() })
  .partial()
  .openapi('SendBroadcastOptions')

const SendBroadcastResponseSuccessSchema = z
  .object({ id: z.string().openapi({ example: '78261eea_8f8b_4381_83c6_79fa7120f1cf' }) })
  .partial()
  .openapi('SendBroadcastResponseSuccess')

export const postEmailsRoute = createRoute({
  tags: ['Emails'],
  method: 'post',
  path: '/emails',
  summary: 'Send an email',
  request: {
    body: { required: false, content: { 'application/json': { schema: SendEmailRequestSchema } } },
  },
  responses: {
    200: {
      description: 'OK',
      content: { 'application/json': { schema: SendEmailResponseSchema } },
    },
  },
})

export const getEmailsEmail_idRoute = createRoute({
  tags: ['Emails'],
  method: 'get',
  path: '/emails/{email_id}',
  summary: 'Retrieve a single email',
  request: { params: z.object({ email_id: z.string() }) },
  responses: {
    200: { description: 'OK', content: { 'application/json': { schema: EmailSchema } } },
  },
})

export const patchEmailsEmail_idRoute = createRoute({
  tags: ['Emails'],
  method: 'patch',
  path: '/emails/{email_id}',
  summary: 'Update a single email',
  request: { params: z.object({ email_id: z.string() }) },
  responses: {
    200: {
      description: 'OK',
      content: { 'application/json': { schema: UpdateEmailOptionsSchema } },
    },
  },
})

export const postEmailsEmail_idCancelRoute = createRoute({
  tags: ['Emails'],
  method: 'post',
  path: '/emails/{email_id}/cancel',
  summary: 'Cancel the schedule of the e-mail.',
  request: { params: z.object({ email_id: z.string() }) },
  responses: {
    200: { description: 'OK', content: { 'application/json': { schema: EmailSchema } } },
  },
})

export const postEmailsBatchRoute = createRoute({
  tags: ['Emails'],
  method: 'post',
  path: '/emails/batch',
  summary: 'Trigger up to 100 batch emails at once.',
  request: {
    body: {
      required: false,
      content: { 'application/json': { schema: z.array(SendEmailRequestSchema) } },
    },
  },
  responses: {
    200: {
      description: 'OK',
      content: { 'application/json': { schema: CreateBatchEmailsResponseSchema } },
    },
  },
})

export const postDomainsRoute = createRoute({
  tags: ['Domains'],
  method: 'post',
  path: '/domains',
  summary: 'Create a new domain',
  request: {
    body: {
      required: false,
      content: { 'application/json': { schema: CreateDomainRequestSchema } },
    },
  },
  responses: {
    201: {
      description: 'OK',
      content: { 'application/json': { schema: CreateDomainResponseSchema } },
    },
  },
})

export const getDomainsRoute = createRoute({
  tags: ['Domains'],
  method: 'get',
  path: '/domains',
  summary: 'Retrieve a list of domains',
  responses: {
    200: {
      description: 'OK',
      content: { 'application/json': { schema: ListDomainsResponseSchema } },
    },
  },
})

export const getDomainsDomain_idRoute = createRoute({
  tags: ['Domains'],
  method: 'get',
  path: '/domains/{domain_id}',
  summary: 'Retrieve a single domain',
  request: { params: z.object({ domain_id: z.string() }) },
  responses: {
    200: { description: 'OK', content: { 'application/json': { schema: DomainSchema } } },
  },
})

export const patchDomainsDomain_idRoute = createRoute({
  tags: ['Domains'],
  method: 'patch',
  path: '/domains/{domain_id}',
  summary: 'Update an existing domain',
  request: {
    body: {
      required: false,
      content: { 'application/json': { schema: UpdateDomainOptionsSchema } },
    },
    params: z.object({ domain_id: z.string() }),
  },
  responses: {
    200: {
      description: 'OK',
      content: { 'application/json': { schema: UpdateDomainResponseSuccessSchema } },
    },
  },
})

export const deleteDomainsDomain_idRoute = createRoute({
  tags: ['Domains'],
  method: 'delete',
  path: '/domains/{domain_id}',
  summary: 'Remove an existing domain',
  request: { params: z.object({ domain_id: z.string() }) },
  responses: {
    200: {
      description: 'OK',
      content: { 'application/json': { schema: DeleteDomainResponseSchema } },
    },
  },
})

export const postDomainsDomain_idVerifyRoute = createRoute({
  tags: ['Domains'],
  method: 'post',
  path: '/domains/{domain_id}/verify',
  summary: 'Verify an existing domain',
  request: { params: z.object({ domain_id: z.string() }) },
  responses: {
    200: {
      description: 'OK',
      content: { 'application/json': { schema: VerifyDomainResponseSchema } },
    },
  },
})

export const postApiKeysRoute = createRoute({
  tags: ['API Keys'],
  method: 'post',
  path: '/api-keys',
  summary: 'Create a new API key',
  request: {
    body: {
      required: false,
      content: { 'application/json': { schema: CreateApiKeyRequestSchema } },
    },
  },
  responses: {
    201: {
      description: 'OK',
      content: { 'application/json': { schema: CreateApiKeyResponseSchema } },
    },
  },
})

export const getApiKeysRoute = createRoute({
  tags: ['API Keys'],
  method: 'get',
  path: '/api-keys',
  summary: 'Retrieve a list of API keys',
  responses: {
    200: {
      description: 'OK',
      content: { 'application/json': { schema: ListApiKeysResponseSchema } },
    },
  },
})

export const deleteApiKeysApi_key_idRoute = createRoute({
  tags: ['API Keys'],
  method: 'delete',
  path: '/api-keys/{api_key_id}',
  summary: 'Remove an existing API key',
  request: { params: z.object({ api_key_id: z.string() }) },
  responses: { 200: { description: 'OK' } },
})

export const postAudiencesRoute = createRoute({
  tags: ['Audiences'],
  method: 'post',
  path: '/audiences',
  summary: 'Create a list of contacts',
  request: {
    body: {
      required: false,
      content: { 'application/json': { schema: CreateAudienceOptionsSchema } },
    },
  },
  responses: {
    201: {
      description: 'OK',
      content: { 'application/json': { schema: CreateAudienceResponseSuccessSchema } },
    },
  },
})

export const getAudiencesRoute = createRoute({
  tags: ['Audiences'],
  method: 'get',
  path: '/audiences',
  summary: 'Retrieve a list of audiences',
  responses: {
    200: {
      description: 'OK',
      content: { 'application/json': { schema: ListAudiencesResponseSuccessSchema } },
    },
  },
})

export const deleteAudiencesIdRoute = createRoute({
  tags: ['Audiences'],
  method: 'delete',
  path: '/audiences/{id}',
  summary: 'Remove an existing audience',
  request: { params: z.object({ id: z.string() }) },
  responses: {
    200: {
      description: 'OK',
      content: { 'application/json': { schema: RemoveAudienceResponseSuccessSchema } },
    },
  },
})

export const getAudiencesIdRoute = createRoute({
  tags: ['Audiences'],
  method: 'get',
  path: '/audiences/{id}',
  summary: 'Retrieve a single audience',
  request: { params: z.object({ id: z.string() }) },
  responses: {
    200: {
      description: 'OK',
      content: { 'application/json': { schema: GetAudienceResponseSuccessSchema } },
    },
  },
})

export const postAudiencesAudience_idContactsRoute = createRoute({
  tags: ['Contacts'],
  method: 'post',
  path: '/audiences/{audience_id}/contacts',
  summary: 'Create a new contact',
  request: {
    body: {
      required: false,
      content: { 'application/json': { schema: CreateContactOptionsSchema } },
    },
    params: z.object({ audience_id: z.string() }),
  },
  responses: {
    201: {
      description: 'OK',
      content: { 'application/json': { schema: CreateContactResponseSuccessSchema } },
    },
  },
})

export const getAudiencesAudience_idContactsRoute = createRoute({
  tags: ['Contacts'],
  method: 'get',
  path: '/audiences/{audience_id}/contacts',
  summary: 'Retrieve a list of contacts',
  request: { params: z.object({ audience_id: z.string() }) },
  responses: {
    200: {
      description: 'OK',
      content: { 'application/json': { schema: ListContactsResponseSuccessSchema } },
    },
  },
})

export const deleteAudiencesAudience_idContactsEmailRoute = createRoute({
  tags: ['Contacts'],
  method: 'delete',
  path: '/audiences/{audience_id}/contacts/{email}',
  summary: 'Remove an existing contact by email',
  request: { params: z.object({ email: z.string(), audience_id: z.string() }) },
  responses: {
    200: {
      description: 'OK',
      content: { 'application/json': { schema: RemoveContactResponseSuccessSchema } },
    },
  },
})

export const deleteAudiencesAudience_idContactsIdRoute = createRoute({
  tags: ['Contacts'],
  method: 'delete',
  path: '/audiences/{audience_id}/contacts/{id}',
  summary: 'Remove an existing contact by id',
  request: { params: z.object({ id: z.string(), audience_id: z.string() }) },
  responses: {
    200: {
      description: 'OK',
      content: { 'application/json': { schema: RemoveContactResponseSuccessSchema } },
    },
  },
})

export const getAudiencesAudience_idContactsIdRoute = createRoute({
  tags: ['Contacts'],
  method: 'get',
  path: '/audiences/{audience_id}/contacts/{id}',
  summary: 'Retrieve a single contact',
  request: { params: z.object({ id: z.string(), audience_id: z.string() }) },
  responses: {
    200: {
      description: 'OK',
      content: { 'application/json': { schema: GetContactResponseSuccessSchema } },
    },
  },
})

export const patchAudiencesAudience_idContactsIdRoute = createRoute({
  tags: ['Contacts'],
  method: 'patch',
  path: '/audiences/{audience_id}/contacts/{id}',
  summary: 'Update a single contact',
  request: {
    body: {
      required: false,
      content: { 'application/json': { schema: UpdateContactOptionsSchema } },
    },
    params: z.object({ id: z.string(), audience_id: z.string() }),
  },
  responses: {
    200: {
      description: 'OK',
      content: { 'application/json': { schema: UpdateContactResponseSuccessSchema } },
    },
  },
})

export const postBroadcastsRoute = createRoute({
  tags: ['Broadcasts'],
  method: 'post',
  path: '/broadcasts',
  summary: 'Create a broadcast',
  request: {
    body: {
      required: false,
      content: { 'application/json': { schema: CreateBroadcastOptionsSchema } },
    },
  },
  responses: {
    201: {
      description: 'OK',
      content: { 'application/json': { schema: CreateBroadcastResponseSuccessSchema } },
    },
  },
})

export const getBroadcastsRoute = createRoute({
  tags: ['Broadcasts'],
  method: 'get',
  path: '/broadcasts',
  summary: 'Retrieve a list of broadcasts',
  responses: {
    200: {
      description: 'OK',
      content: { 'application/json': { schema: ListBroadcastsResponseSuccessSchema } },
    },
  },
})

export const deleteBroadcastsIdRoute = createRoute({
  tags: ['Broadcasts'],
  method: 'delete',
  path: '/broadcasts/{id}',
  summary: 'Remove an existing broadcast that is in the draft status',
  request: { params: z.object({ id: z.string() }) },
  responses: {
    200: {
      description: 'OK',
      content: { 'application/json': { schema: RemoveBroadcastResponseSuccessSchema } },
    },
  },
})

export const getBroadcastsIdRoute = createRoute({
  tags: ['Broadcasts'],
  method: 'get',
  path: '/broadcasts/{id}',
  summary: 'Retrieve a single broadcast',
  request: { params: z.object({ id: z.string() }) },
  responses: {
    200: {
      description: 'OK',
      content: { 'application/json': { schema: GetBroadcastResponseSuccessSchema } },
    },
  },
})

export const postBroadcastsIdSendRoute = createRoute({
  tags: ['Broadcasts'],
  method: 'post',
  path: '/broadcasts/{id}/send',
  summary: 'Send or schedule a broadcast',
  request: {
    body: {
      required: false,
      content: { 'application/json': { schema: SendBroadcastOptionsSchema } },
    },
    params: z.object({ id: z.string() }),
  },
  responses: {
    200: {
      description: 'OK',
      content: { 'application/json': { schema: SendBroadcastResponseSuccessSchema } },
    },
  },
})
