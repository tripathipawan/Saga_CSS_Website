export function ToolHeader({ title, description }: { title: string; description: string }) {
  return (
    <header className="mb-6">
      <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{title}</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">{description}</p>
    </header>
  );
}