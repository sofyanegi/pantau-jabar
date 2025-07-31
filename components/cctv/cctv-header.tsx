export const CctvHeader = ({ title, subtitle }: { title: string; subtitle: string }) => (
  <div className="mb-8">
    <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">{title}</h1>
    <p className="mt-2 text-lg text-muted-foreground">{subtitle}</p>
  </div>
);
