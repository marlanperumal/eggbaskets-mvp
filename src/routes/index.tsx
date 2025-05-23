import { createFileRoute } from "@tanstack/react-router";
import { WandSparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  return (
    <main className="flex flex-col items-center justify-center h-screen space-y-4">
      <h1 className="text-4xl font-bold">Welcome to egg baskets</h1>
      <p className="text-lg w-1/2 text-center">
        a financial planning tool that helps you set goals, figure out how to
        invest and save for them, and investigate different scenarios.
      </p>
      <Button>
        <WandSparkles className="w-4 h-4" />
        Get Started
      </Button>
    </main>
  );
}
