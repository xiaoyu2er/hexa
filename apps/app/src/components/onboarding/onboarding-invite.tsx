'use client';

import { LogoIcon } from '@hexa/ui/icons';
import { Button, Card, Input, Select, SelectItem } from '@nextui-org/react';
import { useState } from 'react';

interface OnboardingInviteProps {
  onNext: () => void;
}

export function OnboardingInvite({ onNext }: OnboardingInviteProps) {
  const [emails, setEmails] = useState<string[]>(['']);
  const [roles, setRoles] = useState<string[]>(['member']);

  const handleAddEmail = () => {
    setEmails([...emails, '']);
    setRoles([...roles, 'member']);
  };

  const handleEmailChange = (index: number, value: string) => {
    const newEmails = [...emails];
    newEmails[index] = value;
    setEmails(newEmails);
  };

  const handleRoleChange = (index: number, value: string) => {
    const newRoles = [...roles];
    newRoles[index] = value;
    setRoles(newRoles);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Handle invite submission
    onNext();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        <div className="flex flex-col items-center gap-6">
          <div className="flex justify-center">
            <LogoIcon className="w-12 h-12" />
          </div>

          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">Invite teammates</h1>
            <p className="text-gray-600">
              Invite teammates to join your workspace. Invitations will be valid
              for 14 days.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="w-full space-y-4">
            {emails.map((email, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  type="email"
                  label="Email"
                  placeholder="teammate@company.com"
                  value={email}
                  onChange={(e) => handleEmailChange(index, e.target.value)}
                  className="flex-1"
                  required
                />
                <Select
                  label="Role"
                  value={roles[index]}
                  onChange={(e) => handleRoleChange(index, e.target.value)}
                  className="w-32"
                >
                  <SelectItem key="member" value="member">
                    Member
                  </SelectItem>
                  <SelectItem key="admin" value="admin">
                    Admin
                  </SelectItem>
                </Select>
              </div>
            ))}

            <Button
              type="button"
              variant="bordered"
              onClick={handleAddEmail}
              className="w-full"
            >
              Add another
            </Button>

            <div className="flex flex-col gap-2">
              <Button type="submit" color="primary" className="w-full">
                Continue
              </Button>
              <Button type="button" variant="light" onClick={() => onNext()}>
                I'll do this later
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
}
