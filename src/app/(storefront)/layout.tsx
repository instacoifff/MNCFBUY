import { Navbar } from "@/components/layout/Navbar";

export default function StorefrontLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      <main style={{ minHeight: 'calc(100vh - 4rem)' }}>
        {children}
      </main>
    </>
  );
}
