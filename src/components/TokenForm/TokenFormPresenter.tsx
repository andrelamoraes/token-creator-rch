import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTokenService } from "../../services/tokenService"; 
import { toast } from "react-toastify";
import { MetaMaskInpageProvider } from "@metamask/providers";
import { ethers } from "ethers";

declare global {
  interface Window {
    ethereum?: MetaMaskInpageProvider;
  }
}

const tokenSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  symbol: z.string().min(1, "Símbolo é obrigatório"),
  decimals: z.number().min(0, "Decimal deve ser um número positivo"),
  initialSupply: z.number().min(0, "Total Supply deve ser um número positivo"),
});

export const TokenFormPresenter = () => {
  type TokenFormData = z.infer<typeof tokenSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<TokenFormData>({
    resolver: zodResolver(tokenSchema),
    mode: "onChange", // Validação em tempo real
  });

  const [connected, setConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [tokenAddress, setTokenAddress] = useState<string | null>(null); // Estado para armazenar o tokenAddress
  const { postToken } = useTokenService();

  const connectWallet = async () => {
    if (!window.ethereum) {
      toast.error("MetaMask não encontrada.");
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      setWalletAddress(address);
      setConnected(true);
      toast.success(`Conectado: ${address}`);
    } catch (err) {
      console.error("Erro ao conectar:", err);
      toast.error("Erro ao conectar à MetaMask.");
    }
  };

  const disconnectWallet = () => {
    setConnected(false);
    setWalletAddress("");
    setTokenAddress(null); // Limpa o tokenAddress ao desconectar
    toast.info("Carteira desconectada.");
  };

  const onSubmit = async (data: TokenFormData) => {
    const toastId = toast.loading("Criando token...");

    // Adiciona o walletAddress ao campo ownerAddress
    const dataWithOwnerAddress = {
      ...data,
      ownerAddress: walletAddress,
    };

    try {
      const response = await postToken(dataWithOwnerAddress);
      setTokenAddress(response.tokenAddress); // Armazena o tokenAddress no estado
      toast.update(toastId, {
        render: "Token criado com sucesso",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
    } catch (error) {
      toast.update(toastId, {
        render: "Erro ao criar o token",
        type: "error",
        isLoading: false,
        autoClose: 5000,
      });
    }
  };

  const styleInput =
    "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500";

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full p-8 border border-solid inset-shadow-xs grid grid-cols-2 gap-4 rounded-lg"
    >
      <div className="col-span-2 text-right">
        {!connected ? (
          <button
            type="button"
            onClick={connectWallet}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Conectar MetaMask
          </button>
        ) : (
          <button
            type="button"
            onClick={disconnectWallet}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Desconectar
          </button>
        )}
        {connected && (
          <div className="text-sm text-right mt-1 text-gray-600">
            <p>Endereço da Carteira: {walletAddress}</p>
            {tokenAddress && <p className="text-green-600">Endereço do Token Criado: {tokenAddress}</p>} {/* Exibe o tokenAddress em verde se existir */}
          </div>
        )}
      </div>

      {/* Campos do formulário */}

      <div>
        <label className="block font-semibold">Nome</label>
        <input {...register("name")} className={styleInput} type="text" />
        {errors.name && <p className="text-red-500">{errors.name.message}</p>}
      </div>

      <div>
        <label className="block font-semibold">Símbolo</label>
        <input {...register("symbol")} className={styleInput} type="text" />
        {errors.symbol && <p className="text-red-500">{errors.symbol.message}</p>}
      </div>

      <div>
        <label className="block font-semibold">Decimais</label>
        <input
          {...register("decimals", { valueAsNumber: true })}
          className={styleInput}
          type="number"
          placeholder="18"
          readOnly
          value={18}
        />
        {errors.decimals && <p className="text-red-500">{errors.decimals.message}</p>}
      </div>

      <div>
        <label className="block font-semibold">Quantidade Inicial</label>
        <input {...register("initialSupply", { valueAsNumber: true })} className={styleInput} type="number" />
        {errors.initialSupply && <p className="text-red-500">{errors.initialSupply.message}</p>}
      </div>

      <button
        type="submit"
        className={`col-span-2 py-2 px-4 rounded max-w-sm mx-auto ${
          !isValid || !connected
            ? "bg-gray-400 text-gray-700 cursor-not-allowed"
            : "bg-blue-500 text-white hover:bg-blue-600"
        }`}
        disabled={!isValid || !connected} // Desabilita o botão se o formulário for inválido ou a carteira não estiver conectada
      >
        Criar Token
      </button>
    </form>
  );
};