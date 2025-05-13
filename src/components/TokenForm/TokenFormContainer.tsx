import { useState } from "react";
import { useTokenStore } from "../../store/useTokenStore";
import { TokenFormPresenter } from "./TokenFormPresenter";
import { Token } from "../../models/Token";

export const TokenFormContainer = () => {
    return <>
        <TokenFormPresenter />
    </>
}

