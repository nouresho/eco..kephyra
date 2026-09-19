import './admin.css';
export const dynamic = 'force-dynamic';
export const metadata = { title: 'ECO KEPHYRA · Administration', robots: { index: false, follow: false } };
export default function Layout({ children }: { children: React.ReactNode }) {
  return <div className="ec-admin">{children}</div>;
}
