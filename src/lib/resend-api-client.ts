const customFetch: typeof fetch = async (input, init) => {
  const request = new Request(input, init);
  request.headers.set("Authorization", "Bearer re_xxxxxxxxxxxxxxxxxxxxxxxxxx");
  request.headers.set("Content-Type", "application/json");
  const response = await fetch(request);
  await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network delay
  return response;
};

export const verifyDomain = async (domainId: string): Promise<void> => {
  await customFetch(`/domains/${domainId}/verify`, { method: "POST" });
};

export const deleteDomain = async (domainId: string): Promise<void> => {
  await customFetch(`/domains/${domainId}`, { method: "DELETE" });
};

export const deleteAPIKey = async (apiKeyId: string): Promise<void> => {
  await customFetch(`/api-keys/${apiKeyId}`, { method: "DELETE" });
};
