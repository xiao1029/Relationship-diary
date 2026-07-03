import SwRegister from "@/components/SwRegister";
import "./globals.css";

export const metadata = {
  title: "ふりかえり日記",
  description:
    "パートナーとの出来事を、事実・感情・気づきに分けて記録し、後から客観的に見返すための日記アプリ",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "ふりかえり日記",
  },
};

export const viewport = {
  themeColor: "#1f2430",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body>
        <SwRegister />
        <div className="app-shell">{children}</div>
      </body>
    </html>
  );
}
