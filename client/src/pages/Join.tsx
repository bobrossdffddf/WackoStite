import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Loader2, Users, Plus, ArrowRight } from "lucide-react";

export default function Join() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [roomCode, setRoomCode] = useState("");
  const [isHosting, setIsHosting] = useState(false);
  const [isJoining, setIsJoining] = useState(false);

  const handleHost = async () => {
    try {
      setIsHosting(true);
      const hostId = Math.random().toString(36).substring(7);
      localStorage.setItem("host-id", hostId);
      
      const res = await apiRequest("POST", "/api/rooms", {}, {
        "x-host-id": hostId
      });
      const room = await res.json();
      toast({
        title: "Room Created!",
        description: `Your code is ${room.id}`,
      });
      setLocation(`/room/${room.id}`);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create room.",
      });
    } finally {
      setIsHosting(false);
    }
  };

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (roomCode.length !== 4) return;

    try {
      setIsJoining(true);
      const res = await fetch(`/api/rooms/${roomCode.toUpperCase()}`);
      if (!res.ok) throw new Error("Room not found");
      setLocation(`/room/${roomCode.toUpperCase()}`);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Room not found or code invalid.",
      });
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Ready to join?</h1>
          <p className="text-muted-foreground">Create a room or enter a code to get started.</p>
        </div>

        <div className="grid gap-6">
          <Card className="hover-elevate transition-all border-primary/20 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Plus className="w-6 h-6 text-primary" />
                Host a Room
              </CardTitle>
              <CardDescription>Start a new session and invite others</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={handleHost} 
                disabled={isHosting}
                className="w-full h-12 text-lg font-medium"
                data-testid="button-host"
              >
                {isHosting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Users className="mr-2 h-5 w-5" />}
                Host New Room
              </Button>
            </CardContent>
          </Card>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or join existing</span>
            </div>
          </div>

          <Card className="hover-elevate transition-all border-muted">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <ArrowRight className="w-6 h-6 text-primary" />
                Enter Code
              </CardTitle>
              <CardDescription>Enter the 4-letter code to join</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleJoin} className="space-y-4">
                <Input
                  placeholder="CODE"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                  maxLength={4}
                  className="text-center text-3xl font-bold tracking-[0.5em] h-16 uppercase"
                  data-testid="input-room-code"
                />
                <Button 
                  type="submit" 
                  disabled={isJoining || roomCode.length !== 4}
                  variant="outline"
                  className="w-full h-12 text-lg font-medium"
                  data-testid="button-join"
                >
                  {isJoining ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Join Room"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
