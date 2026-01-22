import { useState, useEffect, useRef } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { type Message, type Room } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Loader2, ArrowLeft, Image as ImageIcon, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function RoomPage() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [content, setContent] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const hostId = localStorage.getItem("host-id") || "anonymous";
  const userId = localStorage.getItem("user-id") || (() => {
    const nid = Math.random().toString(36).substring(7);
    localStorage.setItem("user-id", nid);
    return nid;
  })();

  const { data: room, isLoading: isLoadingRoom, error: roomError } = useQuery<Room>({
    queryKey: [`/api/rooms/${id}`],
    meta: { headers: { "x-user-id": userId } },
  });

  const { data: messages, isLoading: isLoadingMessages } = useQuery<Message[]>({
    queryKey: [`/api/rooms/${id}/messages`],
    refetchInterval: 2000,
    meta: { headers: { "x-user-id": userId } },
  });

  const messageMutation = useMutation({
    mutationFn: async ({ content, type = "text" }: { content: string, type?: "text" | "image" }) => {
      await apiRequest("POST", `/api/rooms/${id}/messages`, { content, type }, {
        "x-host-id": hostId
      });
    },
    onSuccess: () => {
      setContent("");
      queryClient.invalidateQueries({ queryKey: [`/api/rooms/${id}/messages`] });
    },
    onError: () => {
      toast({ variant: "destructive", title: "Error", description: "Only host can send." });
    }
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      messageMutation.mutate({ content: base64String, type: "image" });
    };
    reader.readAsDataURL(file);
  };

  if (roomError || (roomError as any)?.message?.includes("banned")) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <h1 className="text-2xl font-bold text-destructive">ACCESS DENIED</h1>
        <p>You have been banned from this room.</p>
        <Button onClick={() => setLocation("/join")}>Go Back</Button>
      </div>
    );
  }

  if (isLoadingRoom) {
    return <div className="flex items-center justify-center min-h-screen"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  const roomData = room as Room;

  if (!roomData || roomData.isClosed) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <h1 className="text-2xl font-bold">Room Closed</h1>
        <Button onClick={() => setLocation("/join")}>Go Back</Button>
      </div>
    );
  }

  const isHost = roomData.hostId === hostId;
  const messagesList = (messages || []) as Message[];

  return (
    <div className="min-h-screen bg-background p-4 flex flex-col items-center">
      <Card className="w-full max-w-2xl flex-1 flex flex-col h-[calc(100vh-2rem)] border-primary/20 bg-card/50 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => setLocation("/join")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <CardTitle className="text-2xl font-mono tracking-wider uppercase">ROOM: {roomData.id}</CardTitle>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
                {isHost ? "Security: Host Access Verified" : "Security: Encrypted Member Session"}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col gap-4 pt-4 overflow-hidden">
          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-4">
              {messagesList.map((msg) => (
                <div key={msg.id} className="bg-muted p-3 rounded-lg border border-primary/10 max-w-[90%] group relative">
                  {msg.type === "image" ? (
                    <img src={msg.content} alt="broadcast" className="rounded-md max-w-full h-auto mb-2" />
                  ) : (
                    <p className="text-sm leading-relaxed">{msg.content}</p>
                  )}
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-[10px] text-muted-foreground block">
                      {new Date(msg.createdAt).toLocaleTimeString()}
                    </span>
                    {isHost && (
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => {
                            const targetUserId = prompt("Enter User ID to ban:");
                            if (targetUserId) {
                              apiRequest("POST", `/api/rooms/${id}/ban`, { userId: targetUserId }, { "x-host-id": hostId })
                                .then(() => toast({ title: "Banned", description: "User has been banned." }));
                            }
                          }}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {!messagesList.length && <div className="text-center text-muted-foreground py-8 italic">Awaiting transmission...</div>}
            </div>
          </ScrollArea>

          {isHost && (
            <div className="space-y-4 pt-4 border-t">
              <div className="flex justify-end">
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={() => {
                    if (confirm("Are you sure you want to close this room?")) {
                      apiRequest("POST", `/api/rooms/${id}/close`, {}, { "x-host-id": hostId })
                        .then(() => setLocation("/join"));
                    }
                  }}
                >
                  Close Room
                </Button>
              </div>
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  if (content.trim()) messageMutation.mutate({ content });
                }}
                className="flex gap-2"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  size="icon"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={messageMutation.isPending}
                >
                  <ImageIcon className="h-4 w-4" />
                </Button>
                <Input
                  placeholder="Broadcast message..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  disabled={messageMutation.isPending}
                  className="flex-1"
                />
                <Button type="submit" size="icon" disabled={messageMutation.isPending || !content.trim()}>
                  {messageMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
              </form>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
