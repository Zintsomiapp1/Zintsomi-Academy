import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Save, X, MessageSquare } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface ProfilePrompt {
  id: string;
  question: string;
  category: string;
}

interface UserAnswer {
  id: string;
  prompt_id: string;
  answer: string;
  prompt: ProfilePrompt;
}

export const ProfilePrompts: React.FC = () => {
  const { user } = useAuth();
  const [prompts, setPrompts] = useState<ProfilePrompt[]>([]);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [editingAnswer, setEditingAnswer] = useState<string | null>(null);
  const [newAnswer, setNewAnswer] = useState('');
  const [selectedPrompt, setSelectedPrompt] = useState<ProfilePrompt | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchPrompts();
      fetchUserAnswers();
    }
  }, [user]);

  const fetchPrompts = async () => {
    try {
      const { data, error } = await supabase
        .from('profile_prompts')
        .select('*')
        .eq('is_active', true)
        .order('category', { ascending: true });

      if (error) throw error;
      setPrompts(data || []);
    } catch (error) {
      console.error('Error fetching prompts:', error);
      toast.error('Failed to load prompts');
    }
  };

  const fetchUserAnswers = async () => {
    try {
      const { data, error } = await supabase
        .from('user_prompt_answers')
        .select(`
          *,
          prompt:profile_prompts(*)
        `)
        .eq('user_id', user?.id);

      if (error) throw error;
      setUserAnswers(data || []);
    } catch (error) {
      console.error('Error fetching user answers:', error);
      toast.error('Failed to load your answers');
    } finally {
      setLoading(false);
    }
  };

  const saveAnswer = async () => {
    if (!selectedPrompt || !newAnswer.trim()) return;

    try {
      const existingAnswer = userAnswers.find(a => a.prompt_id === selectedPrompt.id);
      
      if (existingAnswer) {
        // Update existing answer
        const { error } = await supabase
          .from('user_prompt_answers')
          .update({ answer: newAnswer.trim() })
          .eq('id', existingAnswer.id);

        if (error) throw error;
      } else {
        // Create new answer
        const { error } = await supabase
          .from('user_prompt_answers')
          .insert({
            user_id: user?.id,
            prompt_id: selectedPrompt.id,
            answer: newAnswer.trim()
          });

        if (error) throw error;
      }

      toast.success('Answer saved successfully!');
      fetchUserAnswers();
      setSelectedPrompt(null);
      setNewAnswer('');
    } catch (error) {
      console.error('Error saving answer:', error);
      toast.error('Failed to save answer');
    }
  };

  const startEditing = (answer: UserAnswer) => {
    setEditingAnswer(answer.id);
    setNewAnswer(answer.answer);
  };

  const cancelEditing = () => {
    setEditingAnswer(null);
    setSelectedPrompt(null);
    setNewAnswer('');
  };

  const updateAnswer = async (answerId: string) => {
    if (!newAnswer.trim()) return;

    try {
      const { error } = await supabase
        .from('user_prompt_answers')
        .update({ answer: newAnswer.trim() })
        .eq('id', answerId);

      if (error) throw error;

      toast.success('Answer updated successfully!');
      fetchUserAnswers();
      setEditingAnswer(null);
      setNewAnswer('');
    } catch (error) {
      console.error('Error updating answer:', error);
      toast.error('Failed to update answer');
    }
  };

  const deleteAnswer = async (answerId: string) => {
    try {
      const { error } = await supabase
        .from('user_prompt_answers')
        .delete()
        .eq('id', answerId);

      if (error) throw error;

      toast.success('Answer deleted successfully!');
      fetchUserAnswers();
    } catch (error) {
      console.error('Error deleting answer:', error);
      toast.error('Failed to delete answer');
    }
  };

  const getAvailablePrompts = () => {
    const answeredPromptIds = userAnswers.map(a => a.prompt_id);
    return prompts.filter(p => !answeredPromptIds.includes(p.id));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Profile Prompts
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Answer prompts to make your profile more engaging and help others get to know you better.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Existing Answers */}
          {userAnswers.map((answer) => (
            <div key={answer.id} className="border rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <p className="font-medium text-primary mb-1">
                    {answer.prompt.question}
                  </p>
                  <Badge variant="secondary" className="text-xs">
                    {answer.prompt.category}
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => startEditing(answer)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteAnswer(answer.id)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              {editingAnswer === answer.id ? (
                <div className="space-y-2">
                  <Textarea
                    value={newAnswer}
                    onChange={(e) => setNewAnswer(e.target.value)}
                    placeholder="Your answer..."
                    rows={3}
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => updateAnswer(answer.id)}>
                      <Save className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                    <Button variant="outline" size="sm" onClick={cancelEditing}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground mt-2">
                  {answer.answer}
                </p>
              )}
            </div>
          ))}

          {/* Add New Answer */}
          {selectedPrompt ? (
            <div className="border rounded-lg p-4 bg-background/50">
              <p className="font-medium text-primary mb-2">
                {selectedPrompt.question}
              </p>
              <Badge variant="secondary" className="text-xs mb-3">
                {selectedPrompt.category}
              </Badge>
              <div className="space-y-2">
                <Textarea
                  value={newAnswer}
                  onChange={(e) => setNewAnswer(e.target.value)}
                  placeholder="Your answer..."
                  rows={3}
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={saveAnswer}>
                    <Save className="w-4 h-4 mr-2" />
                    Save Answer
                  </Button>
                  <Button variant="outline" size="sm" onClick={cancelEditing}>
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            getAvailablePrompts().length > 0 && (
              <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center">
                <p className="text-sm text-muted-foreground mb-4">
                  Answer more prompts to make your profile stand out
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {getAvailablePrompts().slice(0, 6).map((prompt) => (
                    <Button
                      key={prompt.id}
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedPrompt(prompt)}
                      className="text-xs"
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      {prompt.question.length > 30 
                        ? `${prompt.question.substring(0, 30)}...`
                        : prompt.question
                      }
                    </Button>
                  ))}
                </div>
              </div>
            )
          )}

          {userAnswers.length === 0 && !selectedPrompt && (
            <div className="text-center py-8">
              <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No prompts answered yet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Answer some prompts to make your profile more interesting!
              </p>
              {getAvailablePrompts().length > 0 && (
                <Button onClick={() => setSelectedPrompt(getAvailablePrompts()[0])}>
                  <Plus className="w-4 h-4 mr-2" />
                  Answer Your First Prompt
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
