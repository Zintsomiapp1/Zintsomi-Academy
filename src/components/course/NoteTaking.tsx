
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2 } from 'lucide-react';

interface Note {
  id: number;
  timestamp: string;
  content: string;
  videoTime: number;
}

interface NoteTakingProps {
  courseId: string;
  lessonId: string;
  currentVideoTime: number;
}

const NoteTaking = ({ courseId, lessonId, currentVideoTime }: NoteTakingProps) => {
  const [notes, setNotes] = useState<Note[]>([
    {
      id: 1,
      timestamp: '2024-01-15 10:30',
      content: 'Important point about character development',
      videoTime: 120
    }
  ]);
  const [newNote, setNewNote] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const addNote = () => {
    if (newNote.trim()) {
      const note: Note = {
        id: Date.now(),
        timestamp: new Date().toLocaleString(),
        content: newNote,
        videoTime: currentVideoTime
      };
      setNotes([...notes, note]);
      setNewNote('');
      setIsAdding(false);
    }
  };

  const deleteNote = (id: number) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  const formatVideoTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>My Notes</CardTitle>
          <Button
            size="sm"
            onClick={() => setIsAdding(true)}
            disabled={isAdding}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Note
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isAdding && (
          <div className="space-y-2 p-3 border rounded-lg bg-gray-50">
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                {formatVideoTime(currentVideoTime)}
              </Badge>
              <span className="text-sm text-gray-600">
                {new Date().toLocaleString()}
              </span>
            </div>
            <Textarea
              placeholder="Enter your note..."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              rows={3}
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={addNote}>Save</Button>
              <Button size="sm" variant="outline" onClick={() => {
                setIsAdding(false);
                setNewNote('');
              }}>
                Cancel
              </Button>
            </div>
          </div>
        )}

        <div className="space-y-3 max-h-96 overflow-y-auto">
          {notes.map((note) => (
            <div key={note.id} className="p-3 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">
                    {formatVideoTime(note.videoTime)}
                  </Badge>
                  <span className="text-xs text-gray-500">{note.timestamp}</span>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => deleteNote(note.id)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
              <p className="text-sm">{note.content}</p>
            </div>
          ))}
        </div>

        {notes.length === 0 && !isAdding && (
          <div className="text-center py-8 text-gray-500">
            <p>No notes yet. Click "Add Note" to get started!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NoteTaking;
