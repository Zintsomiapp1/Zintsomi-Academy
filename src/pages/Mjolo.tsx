import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heart, MessageSquare, Users, Trophy, Camera } from 'lucide-react';
import { PhotoSwaps } from '@/components/mjolo/PhotoSwaps';
import { MatchFeed } from '@/components/mjolo/MatchFeed';
import { QuizBattle } from '@/components/mjolo/QuizBattle';
import { DateRooms } from '@/components/mjolo/DateRooms';
import MessagingInterface from '@/components/messaging/MessagingInterface';
import { useAuth } from '@/hooks/useAuth';

export default function Mjolo() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('matches');

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-primary">Welcome to Mjolo</CardTitle>
            <p className="text-muted-foreground">Sign in to find your perfect match</p>
          </CardHeader>
          <CardContent>
            <Button className="w-full" onClick={() => window.location.href = '/auth'}>
              Sign In to Continue
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            Mjolo
          </h1>
          <p className="text-lg text-muted-foreground mt-2">Find love, make connections</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="matches" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Matches
            </TabsTrigger>
            <TabsTrigger value="messages" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Messages
            </TabsTrigger>
            <TabsTrigger value="photos" className="flex items-center gap-2">
              <Camera className="h-4 w-4" />
              Photo Swaps
            </TabsTrigger>
            <TabsTrigger value="quiz" className="flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              Quiz Battle
            </TabsTrigger>
            <TabsTrigger value="dates" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Date Rooms
            </TabsTrigger>
          </TabsList>

          <TabsContent value="matches">
            <MatchFeed />
          </TabsContent>

          <TabsContent value="messages">
            <MessagingInterface />
          </TabsContent>

          <TabsContent value="photos">
            <PhotoSwaps />
          </TabsContent>

          <TabsContent value="quiz">
            <QuizBattle />
          </TabsContent>

          <TabsContent value="dates">
            <DateRooms />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}