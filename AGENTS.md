<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
# Custom Project Rules (LyraX)

1. **Package Manager:** STRICTLY use `pnpm` for all dependency installations and scripts. Do not use npm or yarn.
2. **Design System:** Enforce a premium Dark Mode UI. Heavily utilize Tailwind CSS for Glassmorphism (`backdrop-blur-md`, `bg-white/5`, `border-white/10`) and soft ambient shadows. Keep the layout clean and minimalistic.
3. **Data Fetching:** Never generate dummy data. Always build robust fetching logic with proper error handling and Next.js caching strategies (`no-store` or `revalidate`).
4. **Component Structure:** Default to Next.js Server Components for SEO. Use Client Components (`"use client"`) strictly only when interactivity or hooks (like `useEffect`, `useState`) are required.

<!-- END:nextjs-agent-rules -->
