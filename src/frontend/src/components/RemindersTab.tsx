import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bell, Pill, Calendar, Droplet, Target, Plus, Crown, X } from 'lucide-react';
import { toast } from 'sonner';
import { useCooldownDismissal } from '../hooks/useCooldownDismissal';
import AdSenseBanner from './ads/AdSenseBanner';

interface RemindersTabProps {
  onNavigateToMembership?: () => void;
}

export default function RemindersTab({ onNavigateToMembership }: RemindersTabProps) {
  const [reminders, setReminders] = useState([
    { id: '1', type: 'medicine', title: 'Blood Pressure Medication', time: '08:00 AM', enabled: true },
    { id: '2', type: 'appointment', title: 'Doctor Checkup', time: '02:00 PM', date: '2026-01-15', enabled: true },
    { id: '3', type: 'hydration', title: 'Drink Water', time: 'Every 2 hours', enabled: true },
    { id: '4', type: 'goal', title: 'Evening Walk', time: '06:00 PM', enabled: false },
  ]);

  // Mock membership status (backend doesn't support this yet)
  const isMember = false;

  // Cooldown dismissal for membership reminder
  const { isDismissed, dismiss } = useCooldownDismissal({
    key: 'membership_reminder',
    cooldownDays: 7,
  });

  const toggleReminder = (id: string) => {
    setReminders(
      reminders.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r))
    );
    toast.success('Reminder updated');
  };

  const handleAddReminder = () => {
    toast.success('Reminder added successfully');
  };

  const getReminderIcon = (type: string) => {
    switch (type) {
      case 'medicine':
        return <Pill className="h-5 w-5" />;
      case 'appointment':
        return <Calendar className="h-5 w-5" />;
      case 'hydration':
        return <Droplet className="h-5 w-5" />;
      case 'goal':
        return <Target className="h-5 w-5" />;
      default:
        return <Bell className="h-5 w-5" />;
    }
  };

  const getReminderColor = (type: string) => {
    switch (type) {
      case 'medicine':
        return 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400';
      case 'appointment':
        return 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400';
      case 'hydration':
        return 'bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400';
      case 'goal':
        return 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400';
      default:
        return 'bg-gray-100 text-gray-600 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const handleUpgradeClick = () => {
    if (onNavigateToMembership) {
      onNavigateToMembership();
    }
  };

  const handleDismiss = () => {
    dismiss();
    toast.success('Reminder dismissed for 7 days');
  };

  const showMembershipReminder = !isMember && !isDismissed;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Reminders & Alerts</h2>
          <p className="text-muted-foreground">Manage your health reminders and notifications</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Reminder
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Reminder</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reminderType">Reminder Type</Label>
                <Select>
                  <SelectTrigger id="reminderType">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="medicine">Medicine</SelectItem>
                    <SelectItem value="appointment">Appointment</SelectItem>
                    <SelectItem value="hydration">Hydration</SelectItem>
                    <SelectItem value="goal">Health Goal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="reminderTitle">Title</Label>
                <Input id="reminderTitle" placeholder="e.g., Take Vitamin D" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="reminderTime">Time</Label>
                  <Input id="reminderTime" type="time" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reminderDate">Date (Optional)</Label>
                  <Input id="reminderDate" type="date" />
                </div>
              </div>
              <Button onClick={handleAddReminder} className="w-full">
                Create Reminder
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {showMembershipReminder && (
        <Card className="border-primary bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/30 dark:to-card">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <Crown className="h-6 w-6 text-primary" />
                <CardTitle>Upgrade to Premium</CardTitle>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 -mt-1 -mr-1"
                onClick={handleDismiss}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <CardDescription>
              Unlock advanced AI features, health risk assessments, and personalized insights
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-muted-foreground">
              Get 24/7 AI medical chat, risk detection, and secure health vault
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleDismiss}>
                Not now
              </Button>
              <Button size="sm" onClick={handleUpgradeClick}>
                Upgrade to Premium
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {!isMember && (
        <AdSenseBanner
          adSlot="1234567890"
          className="w-full"
        />
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Active Reminders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-primary">
              {reminders.filter((r) => r.enabled).length}
            </div>
            <p className="mt-2 text-xs text-muted-foreground">Currently enabled</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Medicine</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-red-600 dark:text-red-400">
              {reminders.filter((r) => r.type === 'medicine').length}
            </div>
            <p className="mt-2 text-xs text-muted-foreground">Medication reminders</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">
              {reminders.filter((r) => r.type === 'appointment').length}
            </div>
            <p className="mt-2 text-xs text-muted-foreground">Upcoming appointments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Health Goals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-green-600 dark:text-green-400">
              {reminders.filter((r) => r.type === 'goal').length}
            </div>
            <p className="mt-2 text-xs text-muted-foreground">Goal reminders</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Reminders</CardTitle>
          <CardDescription>Manage your health notifications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {reminders.map((reminder) => (
              <div
                key={reminder.id}
                className="flex items-center justify-between rounded-lg border border-border p-4"
              >
                <div className="flex items-center gap-3">
                  <div className={`rounded-lg p-2 ${getReminderColor(reminder.type)}`}>
                    {getReminderIcon(reminder.type)}
                  </div>
                  <div>
                    <p className="font-medium">{reminder.title}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{reminder.time}</span>
                      {reminder.date && (
                        <>
                          <span>•</span>
                          <span>{reminder.date}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {reminder.enabled && <Badge variant="outline">Active</Badge>}
                  <Switch checked={reminder.enabled} onCheckedChange={() => toggleReminder(reminder.id)} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notification Settings</CardTitle>
          <CardDescription>Customize how you receive reminders</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Push Notifications</p>
              <p className="text-sm text-muted-foreground">Receive alerts on your device</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Sound Alerts</p>
              <p className="text-sm text-muted-foreground">Play sound with notifications</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Snooze Option</p>
              <p className="text-sm text-muted-foreground">Allow snoozing reminders</p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
