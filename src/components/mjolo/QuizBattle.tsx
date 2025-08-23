import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Trophy, Brain, Clock, Target } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correct_index: number;
  category: string;
}

interface QuizSession {
  id: string;
  match_id: string;
  sender_id: string;
  receiver_id: string;
  question_id: string;
  attempts: number;
  correct: boolean | null;
  status: string;
  question: QuizQuestion;
  sender_profile: any;
  receiver_profile: any;
}

export function QuizBattle() {
  const { user } = useAuth();
  const [quizSessions, setQuizSessions] = useState<QuizSession[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchQuizSessions();
      fetchRandomQuestion();
    }
  }, [user]);

  const fetchQuizSessions = async () => {
    try {
      const { data, error } = await supabase
        .from('quiz_sessions')
        .select('*')
        .or(`sender_id.eq.${user?.id},receiver_id.eq.${user?.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Fetch related data separately
      const sessionsWithData = await Promise.all(
        (data || []).map(async (session) => {
          const [questionResult, senderResult, receiverResult] = await Promise.all([
            supabase.from('quiz_questions').select('*').eq('id', session.question_id).single(),
            supabase.from('profiles').select('*').eq('id', session.sender_id).single(),
            supabase.from('profiles').select('*').eq('id', session.receiver_id).single()
          ]);
          
          return {
            ...session,
            question: questionResult.data || { id: '', question: '', options: [], correct_index: 0, category: '' },
            sender_profile: senderResult.data || { id: '', username: 'Unknown', full_name: 'Unknown', avatar_url: '', bio: '' },
            receiver_profile: receiverResult.data || { id: '', username: 'Unknown', full_name: 'Unknown', avatar_url: '', bio: '' }
          };
        })
      );
      
      setQuizSessions(sessionsWithData);
    } catch (error) {
      console.error('Error fetching quiz sessions:', error);
      toast.error('Failed to load quiz sessions');
    } finally {
      setLoading(false);
    }
  };

  const fetchRandomQuestion = async () => {
    try {
      const { data, error } = await supabase
        .from('quiz_questions')
        .select('*')
        .eq('active', true)
        .limit(1)
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data && data.length > 0) {
        setCurrentQuestion(data[0]);
      }
    } catch (error) {
      console.error('Error fetching question:', error);
    }
  };

  const sendQuizChallenge = async (receiverId: string) => {
    if (!currentQuestion) {
      toast.error('No question available');
      return;
    }

    try {
      // First, get or create a match
      let matchId = '';
      const { data: existingMatch } = await supabase
        .from('mjolo_matches')
        .select('id')
        .or(`and(user1_id.eq.${user?.id},user2_id.eq.${receiverId}),and(user1_id.eq.${receiverId},user2_id.eq.${user?.id})`)
        .single();

      if (existingMatch) {
        matchId = existingMatch.id;
      } else {
        const { data: newMatch, error: matchError } = await supabase
          .from('mjolo_matches')
          .insert([{
            user1_id: user?.id,
            user2_id: receiverId,
            love_meter: 1,
            status: 'active'
          }])
          .select()
          .single();

        if (matchError) throw matchError;
        matchId = newMatch.id;
      }

      const { error } = await supabase
        .from('quiz_sessions')
        .insert([{
          match_id: matchId,
          sender_id: user?.id,
          receiver_id: receiverId,
          question_id: currentQuestion.id,
          status: 'pending'
        }]);

      if (error) throw error;
      toast.success('Quiz challenge sent!');
      fetchQuizSessions();
      fetchRandomQuestion();
    } catch (error) {
      console.error('Error sending quiz challenge:', error);
      toast.error('Failed to send quiz challenge');
    }
  };

  const answerQuiz = async (sessionId: string, answerIndex: number) => {
    try {
      const session = quizSessions.find(s => s.id === sessionId);
      if (!session) return;

      const isCorrect = answerIndex === session.question.correct_index;
      
      const { error } = await supabase
        .from('quiz_sessions')
        .update({
          correct: isCorrect,
          attempts: session.attempts + 1,
          status: 'completed',
          last_attempt_at: new Date().toISOString()
        })
        .eq('id', sessionId);

      if (error) throw error;

      if (isCorrect) {
        toast.success('Correct! 🎉');
        // Increase love meter for the match
        await supabase
          .from('mjolo_matches')
          .update({
            love_meter: Math.min(10, session.attempts + 1)
          })
          .eq('id', session.match_id);
      } else {
        toast.error('Wrong answer! Try again next time.');
      }

      fetchQuizSessions();
    } catch (error) {
      console.error('Error answering quiz:', error);
      toast.error('Failed to submit answer');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Send Quiz Challenge */}
      {currentQuestion && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Send Quiz Challenge
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <h3 className="font-semibold mb-2">{currentQuestion.question}</h3>
                <div className="space-y-2">
                  {currentQuestion.options.map((option, index) => (
                    <div key={index} className="text-sm text-muted-foreground">
                      {String.fromCharCode(65 + index)}. {option}
                    </div>
                  ))}
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Challenge your matches with this question!
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Active Quiz Sessions */}
      {quizSessions.length > 0 ? (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Quiz Battles</h2>
          {quizSessions.map((session) => {
            const isReceiver = session.receiver_id === user?.id;
            const otherUser = isReceiver ? session.sender_profile : session.receiver_profile;
            const isPending = session.status === 'pending';
            const canAnswer = isReceiver && isPending;

            return (
              <Card key={session.id} className={session.correct ? 'bg-green-50 border-green-200' : ''}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={otherUser?.avatar_url} />
                        <AvatarFallback>
                          {otherUser?.full_name?.[0] || otherUser?.username?.[0] || '?'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">
                          {otherUser?.full_name || otherUser?.username}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {isReceiver ? 'Challenged you' : 'You challenged'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Target className="h-4 w-4" />
                      {session.attempts} attempts
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-muted rounded-lg">
                      <h4 className="font-semibold mb-2">{session.question.question}</h4>
                      <div className="space-y-2">
                        {session.question.options.map((option, index) => (
                          <Button
                            key={index}
                            variant={selectedAnswer === index ? "default" : "outline"}
                            className="w-full justify-start text-left"
                            disabled={!canAnswer || session.status === 'completed'}
                            onClick={() => setSelectedAnswer(index)}
                          >
                            {String.fromCharCode(65 + index)}. {option}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {canAnswer && selectedAnswer !== null && (
                      <Button 
                        className="w-full"
                        onClick={() => answerQuiz(session.id, selectedAnswer)}
                      >
                        Submit Answer
                      </Button>
                    )}

                    {session.status === 'completed' && (
                      <div className={`p-3 rounded-lg text-center ${
                        session.correct ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {session.correct ? '🎉 Correct Answer!' : '❌ Wrong Answer'}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="text-center py-12">
          <CardContent>
            <Trophy className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Quiz Battles Yet</h3>
            <p className="text-muted-foreground">
              Challenge your matches to fun quiz battles!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}