import { createFileRoute } from "@tanstack/react-router";
import { StorePage } from "@/components/store/store-page";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return <StorePage />;
}
