import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/create-password")({
  component: RedirectToRegister,
});

function RedirectToRegister() {
  const navigate = useNavigate();
  useEffect(() => {
    void navigate({ to: "/register" });
  }, [navigate]);
  return null;
}
