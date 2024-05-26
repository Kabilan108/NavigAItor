export default function HideablePanel({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="relative hidden flex-col items-start gap-8 md:flex"
      x-chunk="dashboard-03-chunk-0"
    >
      {children}
    </div>
  );
}
