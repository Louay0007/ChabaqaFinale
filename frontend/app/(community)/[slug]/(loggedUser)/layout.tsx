import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "@/app/globals.css"
import { CommunityHeader } from "@/app/(community)/components/community-header"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Chabaqa - Turn your passion into buisness",
  description: "A full-featured creator platform for building and managing communities",
  generator: "v0.dev",
}

export default function CreatorLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { slug: string }
}) {
  const { slug } = params

  return (
    <html lang="en">
      <head>
        {/* Tawk.to live chat script */}
        {/* <script
          dangerouslySetInnerHTML={{
            __html: `
              var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
              (function(){
                var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
                s1.async=true;
                s1.src='https://embed.tawk.to/68ab4e70a4fc79192a7d02fd/1j3eikqs3';
                s1.charset='UTF-8';
                s1.setAttribute('crossorigin','*');
                s0.parentNode.insertBefore(s1,s0);
              })();
            `,
          }}
        /> */}
      </head>
      <body className={inter.className}>
        <CommunityHeader currentCommunity={slug} />
        {children}
      </body>
    </html>
  )
}
