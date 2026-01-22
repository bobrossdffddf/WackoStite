import { useState, useEffect, useRef } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { type Message, type Room } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Loader2, ArrowLeft, Image as ImageIcon, X, Video } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

function renderContent(content: string) {
  // Handle markdown-style links [Text](Link)
  const mdLinkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = mdLinkRegex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      parts.push(content.substring(lastIndex, match.index));
    }
    parts.push(
      <a
        key={match.index}
        href={match[2]}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary underline hover:text-primary/80 break-all"
      >
        {match[1]}
      </a>
    );
    lastIndex = mdLinkRegex.lastIndex;
  }

  if (lastIndex < content.length) {
    const remaining = content.substring(lastIndex);
    // Simple URL auto-linking for any other URLs
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const urlParts = remaining.split(urlRegex);
    urlParts.forEach((part, i) => {
      if (part.match(urlRegex)) {
        parts.push(
          <a
            key={`url-${i}`}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline hover:text-primary/80 break-all"
          >
            {part}
          </a>
        );
      } else {
        parts.push(part);
      }
    });
  }

  return <span className="whitespace-pre-wrap">{parts}</span>;
}

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
    mutationFn: async ({ content, type = "text" }: { content: string, type?: "text" | "image" | "video" }) => {
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: "image" | "video") => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === "video" && file.size > 10 * 1024 * 1024) {
      toast({ variant: "destructive", title: "File too large", description: "Max 10MB for videos." });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      messageMutation.mutate({ content: base64String, type });
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
                  ) : msg.type === "video" ? (
                    <video src={msg.content} controls className="rounded-md max-w-full h-auto mb-2" />
                  ) : (
                    <div className="text-sm leading-relaxed">{renderContent(msg.content)}</div>
                  )}
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-[10px] text-muted-foreground block">
                      {new Date(msg.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}
              {!messagesList.length && <div className="text-center text-muted-foreground py-8 italic">Awaiting transmission...</div>}
            </div>
          </ScrollArea>

          {isHost && (
            <div className="space-y-4 pt-4 border-t border-primary/10">
              <div className="flex justify-between items-center bg-destructive/5 p-3 rounded-lg border border-destructive/20">
                <div className="text-sm">
                  <p className="font-bold text-destructive uppercase tracking-tighter">Admin Control</p>
                  <p className="text-[10px] text-muted-foreground">This will permanently terminate the broadcast.</p>
                </div>
                <Button 
                  variant="destructive" 
                  size="sm"
                  className="hover-elevate transition-all"
                  onClick={() => {
                    if (confirm("Terminate broadcast and close room?")) {
                      apiRequest("POST", `/api/rooms/${id}/close`, {}, { "x-host-id": hostId })
                        .then(() => setLocation("/join"));
                    }
                  }}
                >
                  Terminate Room
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
                  accept="image/*,video/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file?.type.startsWith("video/")) {
                      handleFileUpload(e, "video");
                    } else {
                      handleFileUpload(e, "image");
                    }
                  }}
                />
                <div className="flex gap-1">
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="icon"
                    onClick={() => {
                      if (fileInputRef.current) {
                        fileInputRef.current.accept = "image/*";
                        fileInputRef.current.click();
                      }
                    }}
                    disabled={messageMutation.isPending}
                  >
                    <ImageIcon className="h-4 w-4" />
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="icon"
                    onClick={() => {
                      if (fileInputRef.current) {
                        fileInputRef.current.accept = "video/*";
                        fileInputRef.current.click();
                      }
                    }}
                    disabled={messageMutation.isPending}
                  >
                    <Video className="h-4 w-4" />
                  </Button>
                </div>
                <Input
                  placeholder="Broadcast message... ([Text](Link) supported)"
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
