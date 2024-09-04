import { convexAuth } from "@convex-dev/auth/server";
import GitHub from "@auth/core/providers/github";
import Google from "@auth/core/providers/google"
import { Password } from "@convex-dev/auth/providers/Password"


// 自定义附加字段 https://labs.convex.dev/auth/config/passwords#customize-user-information
import { DataModel } from "./_generated/dataModel";

const CustomPassword = Password<DataModel>({
  profile(params) {
    return {
      email: params.email as string,
      name: params.name as string,
      image: params.role as string,
    };
  },
});


export const { auth, signIn, signOut, store } = convexAuth({
  // providers: [GitHub, Google, Password],
  providers: [GitHub, Google, CustomPassword],
});
