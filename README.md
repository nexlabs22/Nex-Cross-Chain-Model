This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

To generate a production build

```
yarn build
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

-  [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
-  [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

push to origin master

PWA notes:
https://www.mridul.tech/tools/manifest-generator
Variables lookup:
https://developer.mozilla.org/en-US/docs/Web/Manifest/display
Install best pwa package:
https://www.npmjs.com/package/@ducanh2912/next-pwa
npm i @ducanh2912/next-pwa && npm i -D webpack -> incompatible with our old nextjs version due to other dependencies.
"start_url": "app.nexlabs.io",
https://www.youtube.com/watch?v=ARNN_zmrwcw&t=256s
create maskable icon: https://maskable.app/editor
optional: diasable pwa in local environment:
disable: process.env.NODE_ENV === 'development' in next.config.js
