"use client";

import { AuthQueryProvider } from "@daveyplate/better-auth-tanstack";
import { AuthUIProviderTanstack } from "@daveyplate/better-auth-ui/tanstack";
import {
  QueryClient,
  QueryClientProvider,
  isServer,
} from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { Toaster, toast } from "sonner";
import { useS3Upload } from "next-s3-upload";
import { authClient } from "@/lib/auth-client";
import { getImageHash, resizeImage } from "@/lib/utils";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (isServer) {
    return makeQueryClient();
  }

  if (!browserQueryClient) browserQueryClient = makeQueryClient();
  return browserQueryClient;
}

export function Providers({ children }: { children: ReactNode }) {
  const queryClient = getQueryClient();
  queryClient.getQueryCache().config.onError = (error, query) => {
    console.error(error, query);

    if (error.message) toast.error(error.message);
  };
  const router = useRouter();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthQueryProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          themeColor={{
            light: "oklch(1 0 0)",
            dark: "oklch(0.145 0 0)",
          }}
        >
          <AuthUIProviderTanstack
            authClient={authClient}
            navigate={router.push}
            replace={router.replace}
            emailVerification
            social={{
              providers: ["google"],
            }}
            credentials
            // magicLink
            onSessionChange={() => {
              router.refresh();
            }}
            gravatar={{
              d: "monsterid",
              forceDefault: true,
              size: 128
            }}
            Link={Link}
            deleteUser
          >
            {children}
            <Toaster />
          </AuthUIProviderTanstack>
        </ThemeProvider>
      </AuthQueryProvider>
    </QueryClientProvider >
  );
}
