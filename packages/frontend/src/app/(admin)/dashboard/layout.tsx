import { Sidebar } from '@/components/dashboard/sidebar';
import { Footer } from '@/components/dashboard/footer';
import { auth } from '@/auth';

export default async function Layout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session) return null;

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground transition-colors duration-200">
      <div className="flex flex-1">
        <Sidebar session={session} />
        <main className="flex-1 pl-64">
          <div className="h-full min-h-screen flex flex-col">
            <div className="flex-1">{children}</div>
            <Footer />
          </div>
        </main>
      </div>
    </div>
  );
}
