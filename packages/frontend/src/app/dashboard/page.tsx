export default function Dashboard() {
  return (
    <div className="p-8">
      <h1 className="mb-8 text-3xl font-bold">Welcome to Dashboard</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Total Users</h2>
          <p className="mt-2 text-3xl font-bold">1,234</p>
        </div>
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Revenue</h2>
          <p className="mt-2 text-3xl font-bold">$12,345</p>
        </div>
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Active Projects</h2>
          <p className="mt-2 text-3xl font-bold">42</p>
        </div>
      </div>
    </div>
  );
}
