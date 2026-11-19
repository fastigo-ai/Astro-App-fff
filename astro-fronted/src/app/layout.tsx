import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AstroBaby Admin & LMS | Krishna Coming Garbh Sanskar Portal',
  description:
    'Administrative portal for AstroBaby Garbh Sanskar: manage courses, daily activities, live Zoom masterclasses, recorded videos, care notes, and user access.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 antialiased">{children}</body>
    </html>
  );
}
