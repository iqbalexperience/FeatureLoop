import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { sendEmail } from "./email/email";
import {
  openAPI,
  bearer,
  admin,
} from "better-auth/plugins";
import {
  emailVerificationTemplate,
  resetPasswordTemplate,
} from "./email/templates";
import { saasMeta } from "./appMeta/meta";


export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "mongodb",
  }),
  plugins: [
    openAPI({ disableDefaultReference: false }), // /api/auth/reference to view the Open API reference
    bearer(),
    admin({
      adminUserIds: [],
    }),
  ],
  // trustedOrigins: ["chrome-extension://dfgklfhblpboebbehcakgoimmagebohj"],
  advanced: {
    database: {
      generateId(options) {
        var chars = "0123456789abcdef";
        var randS = "";
        let length = 24

        while (length > 0) {
          randS += chars.charAt(Math.floor(Math.random() * chars.length));
          length--;
        }
        return randS;
      },
    },
  },
  user: {
    deleteUser: {
      enabled: true
    }
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    async sendResetPassword({ user, url }: any) {
      await sendEmail({
        to: user.email,
        subject: `${saasMeta.name} | Reset Password`,
        body: resetPasswordTemplate({ resetUrl: url }),
      });
    },
  },

  emailVerification: {
    sendOnSignUp: false,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, token }: any) => {
      const verificationUrl = `${process.env.BETTER_AUTH_URL}/api/auth/verify-email?token=${token}&callbackURL=${process.env.EMAIL_VERIFICATION_CALLBACK_URL}`;

      await sendEmail({
        to: user.email,
        subject: `${saasMeta.name} | Confirm Your Account`,
        body: emailVerificationTemplate({ verificationUrl }),
      });
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    },
  }
});

