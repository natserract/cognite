import { useContext } from "react";
import { CognitoContext, CognitoContextInterface } from "./cognito-context";

const useCognito = () => {
  return useContext(CognitoContext) as CognitoContextInterface
}

export default useCognito;
