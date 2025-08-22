"use client";

import { useEffect } from "react";

interface ErrorProps {
  error: Error;
  reset: () => void; 
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <p>Could not fetch note details. {error.message}</p>
  );
}