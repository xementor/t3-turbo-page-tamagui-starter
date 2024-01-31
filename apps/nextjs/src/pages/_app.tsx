import "../styles/globals.css";
import "@tamagui/core/reset.css";
import "@tamagui/font-inter/css/400.css";
import "@tamagui/font-inter/css/700.css";
import "raf/polyfill";

import type { AppType } from "next/app";
import { Provider } from "@my/app/provider";
import { NextThemeProvider, useRootTheme } from "@tamagui/next-theme";
import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import type { SolitoAppProps } from "solito";

import { api } from "~/utils/api";

if (process.env.NODE_ENV === "production") {
  require("../public/tamagui.css");
}
interface AppTypeProps {
  session: Session | null;
}

type CombinedProps = SolitoAppProps & AppTypeProps;

const MyApp: AppType<CombinedProps> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <ThemeProvider>
      <SessionProvider session={session}>
        <Component {...pageProps} />
      </SessionProvider>
    </ThemeProvider>
  );
};

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useRootTheme();

  return (
    <NextThemeProvider
      onChangeTheme={(next) => {
        setTheme(next as any);
      }}
    >
      <Provider disableRootThemeClass defaultTheme={theme}>
        {children}
      </Provider>
    </NextThemeProvider>
  );
}

export default api.withTRPC(MyApp);
