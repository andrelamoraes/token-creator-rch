import useSWR, { mutate } from "swr";

const API_URL = process.env.REACT_APP_API_URL;  
console.log("API_URL", API_URL);

if (!API_URL) {
  console.error("API_URL não está definida. Verifique seu arquivo .env.");
}

const fetcher = async (url: string, method: string, body: any) => {
  const res = await fetch(`${API_URL}/${url}`, {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const error = await res.text(); // Captura o erro como texto
    console.error("Erro na API:", error);
    throw new Error(`Erro na API: ${res.status} ${res.statusText}`);
  }

  return res.json(); // Retorna o JSON apenas se a resposta for bem-sucedida
};

export const useTokenService = () => {
  const postToken = async (data: any) => {
    
    const response = await fetcher("tokens", "POST", data); 

    mutate("/tokens");
    console.debug("Response from API:", response);

    console.log("Response from API data:", response);
    
    return response;
  };

  return {
    postToken,
  };
};

