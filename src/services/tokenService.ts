import useSWR, { mutate } from "swr";

const fetcher = (url: string, method: string, body: any) =>
  fetch(url, {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  }).then((res) => res.json());

export const useTokenService = () => {
  const postToken = async (data: any) => {
    const response = await fetcher(`api/tokens`, "POST", data);

    mutate("/api/tokens");
    return response;
  };

  return {
    postToken,
  };
};

