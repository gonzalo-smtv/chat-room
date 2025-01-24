import "./globals.css"
import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Cosmic Chat Rooms",
  description: "Join a cosmic chat adventure!",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 min-h-screen text-white`}
      >
        {children}
      </body>
    </html>
  )
}

