import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { type Message, type Room } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Loader2, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function RoomPage() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [content, setContent] = useState("");
  const hostId = localStorage.getItem("host-id") || "anonymous";

  const { data: room, isLoading: isLoadingRoom } = useQuery<Room>({
    queryKey: [`/api/rooms/${id}`],
  });

  const { data: messages, isLoading: isLoadingMessages } = useQuery<Message[]>({
    queryKey: [`/api/rooms/${id}/messages`],
    refetchInterval: 2000,
  });

  const messageMutation = useMutation({
    mutationFn: async (content: string) => {
      await apiRequest("POST", `/api/rooms/${id}/messages`, { content }, {
        headers: { "x-host-id": hostId }
      });
    },
    onSuccess: () => {
      setContent("");
      queryClient.invalidateQueries({ queryKey: [`/api/rooms/${id}/messages`] });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Only the host can send messages.",
      });
    }
  });

  if (isLoadingRoom) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!room) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <h1 className="text-2xl font-bold">Room not found</h1>
        <Button onClick={() => setLocation("/join")}>Go Back</Button>
      </div>
    );
  }

  const isHost = room.hostId === hostId;

  return (
    <div className="min-h-screen bg-background p-4 flex flex-col items-center">
      <Card className="w-full max-w-2xl flex-1 flex flex-col h-[calc(100vh-2rem)] border-primary/20 bg-card/50 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => setLocation("/join")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <CardTitle className="text-2xl font-mono tracking-wider">ROOM: {room.id}</CardTitle>
              <p className="text-xs text-muted-foreground uppercase tracking-tighter">
                {isHost ? "You are the host" : "Viewing as member"}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col gap-4 pt-4 overflow-hidden">
          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-4">
              {messages?.map((msg) => (
                <div key={msg.id} className="bg-muted p-3 rounded-lg border border-primary/10 max-w-[80%]">
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                  <span className="text-[10px] text-muted-foreground block mt-1">
                    {new Date(msg.createdAt).toLocaleTimeString()}
                  </span>
                </div>
              ))}
              {!messages?.length && (
                <div className="text-center text-muted-foreground py-8 italic">
                  No messages yet...
                </div>
              )}
            </div>
          </ScrollArea>

          {isHost && (
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                if (content.trim()) messageMutation.mutate(content);
              }}
              className="flex gap-2 pt-4 border-t"
            >
              <Input
                placeholder="Broadcast a message..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                disabled={messageMutation.isPending}
                className="flex-1"
                data-testid="input-broadcast"
              />
              <Button 
                type="submit" 
                size="icon" 
                disabled={messageMutation.isPending || !content.trim()}
                data-testid="button-send"
              >
                {messageMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
