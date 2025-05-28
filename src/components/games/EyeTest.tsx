
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AcuityTest from './eye-test/AcuityTest';
import ColorTest from './eye-test/ColorTest';
import ReactionTest from './eye-test/ReactionTest';

type TestType = 'acuity' | 'color' | 'reaction';

const EyeTest = () => {
  const [currentTest, setCurrentTest] = useState<TestType>('acuity');
  const [score, setScore] = useState(0);

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Eye Tests</CardTitle>
          <div className="flex justify-center gap-2">
            {(['acuity', 'color', 'reaction'] as const).map((type) => (
              <Button
                key={type}
                variant={currentTest === type ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentTest(type)}
              >
                {type === 'acuity' && 'Visual Acuity'}
                {type === 'color' && 'Color Vision'}
                {type === 'reaction' && 'Reaction Time'}
              </Button>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          {currentTest === 'acuity' && (
            <AcuityTest score={score} onScoreUpdate={setScore} />
          )}
          {currentTest === 'color' && <ColorTest />}
          {currentTest === 'reaction' && <ReactionTest />}
        </CardContent>
      </Card>
    </div>
  );
};

export default EyeTest;
