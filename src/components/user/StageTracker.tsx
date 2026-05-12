import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface Stage {
  id: string;
  title: string;
  tasks: string[];
}

const stages: Stage[] = [
  { id: 'language', title: 'Stage 1: Language Toggle', tasks: ['Add toggle in onboarding', 'Persist user language', 'Translate top 20 UI labels'] },
  { id: 'onboarding', title: 'Stage 2: Onboarding', tasks: ['First-session walkthrough', '3-step setup checklist', 'Track onboarding completion'] },
  { id: 'mobile', title: 'Stage 3: Mobile-first Fix', tasks: ['Fix overflow at 360px', 'Increase touch targets', 'Verify bottom-nav safe areas'] },
];

const STORAGE_KEY = 'zintsomi_stage_tracker';

const StageTracker = () => {
  const [expanded, setExpanded] = useState<string | null>(stages[0].id);
  const [checked, setChecked] = useState<Record<string, boolean>>(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  });

  const totalTasks = useMemo(() => stages.reduce((sum, stage) => sum + stage.tasks.length, 0), []);
  const doneTasks = useMemo(() => Object.values(checked).filter(Boolean).length, [checked]);

  const toggleTask = (stageId: string, taskIndex: number, value: boolean) => {
    const id = `${stageId}_${taskIndex}`;
    const next = { ...checked, [id]: value };
    setChecked(next);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  return (
    <Card className="border-mjolo-purple/20">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Build Roadmap</CardTitle>
        <p className="text-xs text-gray-600">{doneTasks}/{totalTasks} tasks done</p>
      </CardHeader>
      <CardContent className="space-y-2">
        {stages.map((stage) => {
          const isOpen = expanded === stage.id;
          const stageDone = stage.tasks.filter((_, index) => checked[`${stage.id}_${index}`]).length;
          return (
            <div key={stage.id} className="rounded-lg border border-gray-200">
              <button
                type="button"
                onClick={() => setExpanded(isOpen ? null : stage.id)}
                className="w-full flex items-center justify-between text-left p-3"
              >
                <div>
                  <p className="text-sm font-semibold text-gray-900">{stage.title}</p>
                  <p className="text-xs text-gray-500">{stageDone}/{stage.tasks.length} complete</p>
                </div>
                {isOpen ? <ChevronUp className="h-4 w-4 text-gray-500" /> : <ChevronDown className="h-4 w-4 text-gray-500" />}
              </button>

              {isOpen && (
                <div className="px-3 pb-3 space-y-2">
                  {stage.tasks.map((task, index) => (
                    <label key={task} className="flex items-center gap-2 cursor-pointer rounded-md p-2 hover:bg-gray-50">
                      <Checkbox
                        checked={Boolean(checked[`${stage.id}_${index}`])}
                        onCheckedChange={(value) => toggleTask(stage.id, index, value === true)}
                      />
                      <span className="text-xs text-gray-700">{task}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default StageTracker;
