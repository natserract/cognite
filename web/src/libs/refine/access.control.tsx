import { IAccessControlContext } from "@pankod/refine/dist/interfaces";
import { useMemo } from "react";

const accessControlProvider = (): IAccessControlContext => {
  return useMemo(() => ({
    can: async ({ resource, action, params }) => {
      return Promise.resolve({ can: true });
    },
  }), [])
}

export default accessControlProvider
