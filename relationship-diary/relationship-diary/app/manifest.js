export default function manifest() {
  return {
    name: "ふりかえり日記",
    short_name: "ふりかえり",
    description: "パートナーとの出来事を、事実・感情・気づきに分けて記録し、後から客観的に見返すための日記アプリ",
    start_url: "/",
    display: "standalone",
    background_color: "#1f2430",
    theme_color: "#1f2430",
    orientation: "portrait",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
