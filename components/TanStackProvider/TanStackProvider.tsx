"use client";

import { ReactNode } from "react";
import { QueryClient, QueryClientProvider, Hydrate } from "@tanstack/react-query";

interface TanStackProviderProps {
  children: ReactNode;
  dehydratedState?: unknown; 
}

export default function TanStackProvider({ children, dehydratedState }: TanStackProviderProps) {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={dehydratedState}>
        {children}
      </Hydrate>
    </QueryClientProvider>
  );
}