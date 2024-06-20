import { EditorProvider } from "@/providers/editor/editor-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import React, { ReactNode } from "react";

type Props = { children: ReactNode };

const Layout = ({ children }: Props) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <EditorProvider>{children}</EditorProvider>
    </ThemeProvider>
  );
};

export default Layout;
