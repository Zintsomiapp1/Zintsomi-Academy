
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';

interface Question {
  id: number;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

const IQQuiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const { toast } = useToast();

  const questions: Question[] = [
    {
      id: 1,
      question: "What comes next in the sequence: 2, 4, 8, 16, ?",
      options: ["24", "32", "30", "20"],
      correct: 1,
      explanation: "Each number is doubled: 2×2=4, 4×2=8, 8×2=16, 16×2=32"
    },
    {
      id: 2,
      question: "If all roses are flowers, and some flowers fade quickly, which statement is definitely true?",
      options: [
        "All roses fade quickly",
        "Some roses are flowers",
        "No roses fade quickly", 
        "All flowers are roses"
      ],
      correct: 1,
      explanation: "Since all roses are flowers, it's definitely true that some roses are flowers."
    },
    {
      id: 3,
      question: "A car travels 60 km in 1 hour. How far will it travel in 90 minutes?",
      options: ["80 km", "90 km", "100 km", "120 km"],
      correct: 1,
      explanation: "90 minutes = 1.5 hours. Distance = 60 km/h × 1.5 h = 90 km"
    },
    {
      id: 4,
      question: "What is the missing number: 1, 1, 2, 3, 5, 8, ?",
      options: ["11", "13", "15", "17"],
      correct: 1,
      explanation: "This is the Fibonacci sequence: each number is the sum of the two preceding ones. 5 + 8 = 13"
    },
    {
      id: 5,
      question: "Which word doesn't belong: Apple, Orange, Carrot, Banana?",
      options: ["Apple", "Orange", "Carrot", "Banana"],
      correct: 2,
      explanation: "Carrot is a vegetable, while the others are fruits."
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentQuestion]);

  useEffect(() => {
    setTimeLeft(30);
  }, [currentQuestion]);

  const handleTimeUp = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
    } else {
      setShowResult(true);
    }
    toast({
      title: "Time's up!",
      description: "Moving to next question",
      variant: "destructive"
    });
  };

  const handleAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    
    if (answerIndex === questions[currentQuestion].correct) {
      setScore(prev => prev + 1);
    }

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedAnswer(null);
      } else {
        setShowResult(true);
      }
    }, 1500);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowResult(false);
    setTimeLeft(30);
  };

  const getScoreMessage = () => {
    const percentage = (score / questions.length) * 100;
    if (percentage >= 80) return "Excellent! You have a sharp mind!";
    if (percentage >= 60) return "Good job! Above average intelligence.";
    if (percentage >= 40) return "Not bad! Keep practicing to improve.";
    return "Keep working on it! Practice makes perfect.";
  };

  if (showResult) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Quiz Complete!</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="mb-6">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {score}/{questions.length}
              </div>
              <div className="text-lg text-gray-600 mb-4">
                {Math.round((score / questions.length) * 100)}% Correct
              </div>
              <p className="text-gray-700 mb-6">{getScoreMessage()}</p>
            </div>
            
            <div className="space-y-4">
              {questions.map((q, index) => (
                <div key={q.id} className="text-left p-4 border rounded-lg">
                  <p className="font-semibold mb-2">{index + 1}. {q.question}</p>
                  <p className="text-sm text-gray-600">
                    <strong>Correct answer:</strong> {q.options[q.correct]}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">{q.explanation}</p>
                </div>
              ))}
            </div>
            
            <Button onClick={resetQuiz} className="mt-6">
              Take Quiz Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">IQ Quiz</CardTitle>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Question {currentQuestion + 1} of {questions.length}</span>
              <span>Time: {timeLeft}s</span>
            </div>
            <Progress value={((currentQuestion + 1) / questions.length) * 100} />
            <Progress value={(timeLeft / 30) * 100} className="h-2" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">{question.question}</h3>
            
            <div className="space-y-3">
              {question.options.map((option, index) => (
                <Button
                  key={index}
                  variant={
                    selectedAnswer === index
                      ? index === question.correct
                        ? "default"
                        : "destructive"
                      : "outline"
                  }
                  className={`w-full text-left justify-start h-auto p-4 ${
                    selectedAnswer !== null && index === question.correct
                      ? "bg-green-100 border-green-500 text-green-800"
                      : ""
                  }`}
                  onClick={() => handleAnswer(index)}
                  disabled={selectedAnswer !== null}
                >
                  <span className="mr-3 font-bold">{String.fromCharCode(65 + index)}.</span>
                  {option}
                </Button>
              ))}
            </div>
            
            {selectedAnswer !== null && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-700">
                  <strong>Explanation:</strong> {question.explanation}
                </p>
              </div>
            )}
          </div>
          
          <div className="text-center text-sm text-gray-600">
            Current Score: {score}/{currentQuestion + (selectedAnswer !== null ? 1 : 0)}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IQQuiz;
