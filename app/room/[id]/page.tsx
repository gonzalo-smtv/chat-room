"use client";

// import { useChat } from "ai/react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useRef, useState } from "react";
import { socket } from "@/lib/socketClient";

export default function ChatRoom({ params }: { params: { id: string } }) {
  const searchParams = useSearchParams();
  const username = searchParams.get("username") || "Anonymous Astronaut";
  // const { messages, input, handleInputChange, handleSubmit } = useChat({
  //   api: "/api/chat",
  //   initialMessages: [
  //     {
  //       id: "chatai",
  //       role: "system",
  //       content: `You are in a cosmic chat room. The current user's name is ${username}. Respond with space-themed messages.`,
  //     },
  //   ],
  // });

  type MessagesType = { sender: string; role: string; content: string }[];

  const [messages, setMessages] = useState<MessagesType>([]);
  const [input, setInput] = useState<string>("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (input) {
      setMessages((prev) => [
        ...prev,
        { sender: username, role: "user", content: input },
      ]);

      setInput("");
    }
  };

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    socket.on("user_joined", (userId) => {
      console.log(`User ${userId} joined the room`);

      setMessages((prev) => [
        ...prev,
        {
          sender: "Cosmic AI",
          role: "system",
          content: `User ${userId} joined the room`,
        },
      ]);
    });

    return () => {
      socket.off("user_joined");
      socket.off("message");
      socket.emit("leave_room", { roomId: params.id, userId: socket.id });
    };
  }, [params.id]);

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-3xl bg-gray-800 bg-opacity-80 backdrop-filter backdrop-blur-lg border border-gray-700">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-yellow-300">
            Nebula: {params.id}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[60vh] overflow-y-auto mb-4 p-4 space-y-4">
            <AnimatePresence>
              {messages.map((message, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className={`p-3 rounded-lg ${
                    message.role === "user"
                      ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white ml-auto"
                      : "bg-gradient-to-r from-blue-500 to-green-500 text-white"
                  } max-w-[80%] break-words`}
                >
                  <strong>
                    {message.role === "user" ? username : "Cosmic AI"}:
                  </strong>{" "}
                  {message.content}
                </motion.div>
              ))}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>
          <form onSubmit={handleSubmit} className="flex space-x-2">
            <Input
              value={input}
              onChange={handleInputChange}
              placeholder="Transmit your cosmic message..."
              className="flex-grow bg-gray-700 bg-opacity-50 border-gray-600 text-white placeholder-gray-400"
            />
            <Button
              type="submit"
              className="bg-gradient-to-r from-pink-500 to-yellow-400 hover:from-pink-600 hover:to-yellow-500 text-gray-900 font-semibold transition-all duration-200"
            >
              Beam
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
