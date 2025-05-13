import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTokenService } from "../../services/tokenService"; 
import { toast } from "react-toastify";
import { MetaMaskInpageProvider } from "@metamask/providers";
import { ethers } from "ethers"; // <-- importante

declare global {
  interface Window {
    ethereum?: MetaMaskInpageProvider;
  }
}

const tokenSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  symbol: z.string().min(1, "Símbolo é obrigatório"),
  decimal: z.number().min(0, "Decimal deve ser um número positivo"),
  totalSupply: z.number().min(0, "Total Supply deve ser um número positivo"),
  description: z.string().optional(),
  image: z
    .any()
    .refine((file) => file instanceof FileList && file.length > 0, "Imagem é obrigatória")
});

export const TokenFormPresenter = () => {
  type TokenFormData = z.infer<typeof tokenSchema>;

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<TokenFormData>({
    resolver: zodResolver(tokenSchema),
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
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
    toast.info("Carteira desconectada.");
  };

  const onSubmit = async (data: TokenFormData) => {
    const toastId = toast.loading("Criando token...");
    
    try {
      await postToken(data);
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

  const selectedImage = watch("image");

  useEffect(() => {
    if (selectedImage && selectedImage.length > 0) {
      const file = selectedImage[0];
      const url = URL.createObjectURL(file);
      setImagePreview(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [selectedImage]);

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
          <p className="text-sm text-right mt-1 text-gray-600">
            {walletAddress}
          </p>
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
        <label className="block font-semibold">Decimal</label>
        <input {...register("decimal", { valueAsNumber: true })} className={styleInput} type="number" />
        {errors.decimal && <p className="text-red-500">{errors.decimal.message}</p>}
      </div>

      <div>
        <label className="block font-semibold">Total Supply</label>
        <input {...register("totalSupply", { valueAsNumber: true })} className={styleInput} type="number" />
        {errors.totalSupply && <p className="text-red-500">{errors.totalSupply.message}</p>}
      </div>

      <div>
        <label className="block font-semibold">Descrição</label>
        <textarea {...register("description")} className={styleInput + " h-64"} />
        {errors.description && <p className="text-red-500">{errors.description.message}</p>}
      </div>

      <div>
        <label className="block font-semibold">Imagem</label>
        <div className="relative w-full h-64">
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Prévia da Imagem"
              className="object-contain w-full h-full rounded-lg p-2"
            />
          )}
          <label
            htmlFor="dropzone-file"
            className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-40 rounded-lg opacity-70 hover:opacity-90 cursor-pointer transition-all"
          >
            <div className="flex flex-col items-center justify-center">
              <svg
                className="w-8 h-8 mb-2 text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 16"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5A5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                />
              </svg>
              <p className="text-white font-semibold text-sm">Upload Image</p>
            </div>
            <input
              {...register("image")}
              id="dropzone-file"
              className="hidden"
              type="file"
              accept="image/*"
            />
          </label>
        </div>
        {errors.image?.message && <p className="text-red-500 mt-2">{String(errors.image.message)}</p>}
      </div>

      <button
        type="submit"
        className="col-span-2 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 max-w-sm mx-auto"
      >
        Criar Token
      </button>
    </form>
  );
};
