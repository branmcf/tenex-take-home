import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">B-Plex</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Welcome to B-Plex
        </p>
        <Button>Get Started</Button>
      </div>
    </main>
  );
}
