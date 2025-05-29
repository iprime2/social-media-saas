"use client";

import { useState } from "react";
import axios from "axios";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function ChatBox({ videoId }: { videoId: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user" as const, content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_SITE_URL}/api/chat`,
        { videoId, userQuery: input }, // Make sure the backend expects "userQuery"
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const assistantReply = res.data.answer || "Sorry, something went wrong.";

      setMessages([...newMessages, { role: "assistant" as const, content: assistantReply }]);
    } catch (error) {
      console.error("API call failed:", error);
      setMessages([...newMessages, { role: "assistant" as const, content: "Error contacting LLM." }]);
    } finally {
      setLoading(false);
    }

  };

  return (
    <Card className="mt-8">
      <CardContent className="p-4 space-y-4">
        <h2 className="text-lg font-semibold">Ask AI about this video</h2>

        <ScrollArea className="h-64 border rounded-md p-3 bg-muted">
          {messages.length === 0 ? (
            <p className="text-muted-foreground text-sm">Start the conversation by asking something...</p>
          ) : (
            messages.map((msg, idx) => (
              <div
                key={idx}
                className={`mb-3 p-2 rounded-md text-sm ${
                  msg.role === "user" ? "bg-blue-100 text-blue-900" : "bg-gray-100 text-gray-800"
                }`}
              >
                <strong>{msg.role === "user" ? "You" : "AI"}:</strong> {msg.content}
              </div>
            ))
          )}
        </ScrollArea>

        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask something about the video or its comments..."
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            disabled={loading}
          />
          <Button onClick={sendMessage} disabled={loading}>
            Send
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
