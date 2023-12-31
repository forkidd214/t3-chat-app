/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.mjs");

import WithPWA from "next-pwa";
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
const withPWA = WithPWA({
  dest: "public",
});

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.discordapp.com",
        port: "",
        pathname: "/avatars/**",
      },
      {
        protocol: "http",
        hostname: "dummyimage.com",
        port: "",
        pathname: "/**",
      },
    ],
  },

  /**
   * If you have `experimental: { appDir: true }` set, then you must comment the below `i18n` config
   * out.
   *
   * @see https://github.com/vercel/next.js/issues/41980
   */
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
};

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
export default withPWA(config);
