"use client";

import { SnackbarProvider } from "notistack";

export default function NotistackProvider() {
  return <SnackbarProvider maxSnack={2} autoHideDuration={1000} />;
}
