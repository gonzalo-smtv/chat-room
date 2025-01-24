import { OpenAIStream, StreamingTextResponse } from "ai"
import { Configuration, OpenAIApi } from "openai-edge"

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})
const openai = new OpenAIApi(config)

export const runtime = "edge"

const spaceFactsAndJokes = [
  "Did you know that a day on Venus is longer than its year?",
  "Why did the sun go to school? To get brighter!",
  "The largest known star, VY Canis Majoris, is so big that if it replaced our Sun, it would extend beyond the orbit of Saturn.",
  "Why don't aliens visit our solar system? Terrible ratings. One star.",
  "There's a planet made of diamonds twice the size of Earth.",
  "Why did the astronaut break up with the satellite? She needed some space!",
]

export async function POST(req: Request) {
  const { messages } = await req.json()

  // Add a random space fact or joke to every third message
  if (messages.length % 3 === 0) {
    const randomFact = spaceFactsAndJokes[Math.floor(Math.random() * spaceFactsAndJokes.length)]
    messages.push({ role: "system", content: `Include this space fact or joke in your response: "${randomFact}"` })
  }

  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    stream: true,
    messages,
  })

  const stream = OpenAIStream(response)
  return new StreamingTextResponse(stream)
}

