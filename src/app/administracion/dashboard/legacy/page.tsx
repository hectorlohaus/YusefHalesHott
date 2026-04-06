export default function LegacyDashboardPage() {
  return (
    <div className="flex-grow flex flex-col w-full min-h-[calc(100vh-64px)] overflow-hidden">
      <iframe 
        src="/legacy/app.html" 
        className="flex-grow w-full border-none"
        title="Legacy App"
      />
    </div>
  );
}
