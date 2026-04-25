import React, { useMemo, useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useLanguage } from '@/contexts/LanguageContext';

interface OnboardingChecklistProps {
  userKey: string;
}

interface OnboardingItem {
  id: string;
  label: string;
}

const getStorageKey = (userKey: string) => `zintsomi_onboarding_${userKey}`;

const OnboardingChecklist = ({ userKey }: OnboardingChecklistProps) => {
  const { t } = useLanguage();
  const items: OnboardingItem[] = useMemo(() => [
    { id: 'profile', label: 'Add a profile photo' },
    { id: 'discover', label: 'Open Discover and view 5 profiles' },
    { id: 'message', label: 'Send your first message' },
  ], []);

  const [checked, setChecked] = useState<Record<string, boolean>>(() => {
    const raw = window.localStorage.getItem(getStorageKey(userKey));
    return raw ? JSON.parse(raw) : {};
  });

  const completed = items.filter((item) => checked[item.id]).length;
  const isDone = completed === items.length;

  const onCheckedChange = (id: string, value: boolean) => {
    const next = { ...checked, [id]: value };
    setChecked(next);
    window.localStorage.setItem(getStorageKey(userKey), JSON.stringify(next));
  };

  return (
    <Dialog open={!isDone}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('onboardingTitle')}</DialogTitle>
          <DialogDescription>
            Complete these 3 actions so your account is fully set up.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-2">
          {items.map((item) => (
            <label key={item.id} className="flex items-center gap-3 rounded-lg border p-3 cursor-pointer">
              <Checkbox
                checked={Boolean(checked[item.id])}
                onCheckedChange={(value) => onCheckedChange(item.id, value === true)}
              />
              <span className="text-sm text-gray-700">{item.label}</span>
            </label>
          ))}
        </div>

        <Button
          className="w-full"
          variant={isDone ? 'default' : 'outline'}
          onClick={() => {
            const all = Object.fromEntries(items.map((item) => [item.id, true]));
            setChecked(all);
            window.localStorage.setItem(getStorageKey(userKey), JSON.stringify(all));
          }}
        >
          {isDone ? 'Done' : `Complete all (${completed}/${items.length})`}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default OnboardingChecklist;
