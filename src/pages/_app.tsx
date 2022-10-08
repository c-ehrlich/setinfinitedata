// src/pages/_app.tsx
import "../styles/globals.css";
import type { AppType } from "next/app";
import { trpc } from "../utils/trpc";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <div className="flex flex-col w-screen min-h-screen p-4">
      <Component {...pageProps} />
      <ReactQueryDevtools initialIsOpen={true} />
    </div>
  );
};

export default trpc.withTRPC(MyApp);
