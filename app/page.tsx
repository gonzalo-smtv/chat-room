"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  const [roomId, setRoomId] = useState("")
  const [username, setUsername] = useState("")
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (roomId && username) {
      router.push(`/room/${roomId}?username=${encodeURIComponent(username)}`)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card className="w-96 bg-gray-800 bg-opacity-80 backdrop-filter backdrop-blur-lg border border-gray-700">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-yellow-300">
              Cosmic Chat Rooms
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-200">
                  Cosmic Alias
                </label>
                <Input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="mt-1 bg-gray-700 bg-opacity-50 border-gray-600 text-white placeholder-gray-400"
                  placeholder="Enter your cosmic alias"
                />
              </div>
              <div>
                <label htmlFor="roomId" className="block text-sm font-medium text-gray-200">
                  Nebula ID
                </label>
                <Input
                  type="text"
                  id="roomId"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                  required
                  className="mt-1 bg-gray-700 bg-opacity-50 border-gray-600 text-white placeholder-gray-400"
                  placeholder="Enter nebula ID"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-pink-500 to-yellow-400 hover:from-pink-600 hover:to-yellow-500 text-gray-900 font-semibold transition-all duration-200"
              >
                Enter the Cosmos
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

