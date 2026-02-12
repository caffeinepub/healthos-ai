import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Heart, Activity, Droplet, Wind, Thermometer, Weight, Plus } from 'lucide-react';
import { toast } from 'sonner';

// Placeholder data for demonstration
const mockVitalsData = [
  { date: '12/28', heartRate: 72, bloodPressure: 120, bloodSugar: 95, spo2: 98, temp: 36.8, weight: 70 },
  { date: '12/29', heartRate: 75, bloodPressure: 118, bloodSugar: 92, spo2: 97, temp: 36.9, weight: 70 },
  { date: '12/30', heartRate: 70, bloodPressure: 122, bloodSugar: 98, spo2: 98, temp: 36.7, weight: 69.8 },
  { date: '12/31', heartRate: 73, bloodPressure: 119, bloodSugar: 94, spo2: 99, temp: 36.8, weight: 69.5 },
  { date: '01/01', heartRate: 71, bloodPressure: 121, bloodSugar: 96, spo2: 98, temp: 36.9, weight: 69.5 },
];

export default function VitalsTab() {
  const [isAddingVital, setIsAddingVital] = useState(false);
  const [selectedVital, setSelectedVital] = useState<string>('heartRate');
  const [vitalForm, setVitalForm] = useState({
    heartRate: '',
    bloodPressureSystolic: '',
    bloodPressureDiastolic: '',
    bloodSugar: '',
    spo2: '',
    temperature: '',
    weight: '',
  });

  const handleAddVital = () => {
    toast.info('Vital tracking requires backend implementation');
    setIsAddingVital(false);
    setVitalForm({
      heartRate: '',
      bloodPressureSystolic: '',
      bloodPressureDiastolic: '',
      bloodSugar: '',
      spo2: '',
      temperature: '',
      weight: '',
    });
  };

  const vitalCards = [
    {
      id: 'heartRate',
      title: 'Heart Rate',
      icon: Heart,
      value: '72',
      unit: 'bpm',
      color: 'text-red-600 dark:text-red-400',
      bgColor: 'bg-red-100 dark:bg-red-900/30',
    },
    {
      id: 'bloodPressure',
      title: 'Blood Pressure',
      icon: Activity,
      value: '120/80',
      unit: 'mmHg',
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    },
    {
      id: 'bloodSugar',
      title: 'Blood Sugar',
      icon: Droplet,
      value: '95',
      unit: 'mg/dL',
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-100 dark:bg-purple-900/30',
    },
    {
      id: 'spo2',
      title: 'SpO₂',
      icon: Wind,
      value: '98',
      unit: '%',
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900/30',
    },
    {
      id: 'temperature',
      title: 'Temperature',
      icon: Thermometer,
      value: '36.8',
      unit: '°C',
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-100 dark:bg-orange-900/30',
    },
    {
      id: 'weight',
      title: 'Weight',
      icon: Weight,
      value: '70',
      unit: 'kg',
      color: 'text-teal-600 dark:text-teal-400',
      bgColor: 'bg-teal-100 dark:bg-teal-900/30',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Vital Tracking</h2>
          <p className="text-muted-foreground">Monitor your health measurements over time</p>
        </div>
        <Dialog open={isAddingVital} onOpenChange={setIsAddingVital}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Vitals
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Log Your Vitals</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="heartRate">Heart Rate (bpm)</Label>
                <Input
                  id="heartRate"
                  type="number"
                  placeholder="72"
                  value={vitalForm.heartRate}
                  onChange={(e) => setVitalForm({ ...vitalForm, heartRate: e.target.value })}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="bpSystolic">BP Systolic</Label>
                  <Input
                    id="bpSystolic"
                    type="number"
                    placeholder="120"
                    value={vitalForm.bloodPressureSystolic}
                    onChange={(e) => setVitalForm({ ...vitalForm, bloodPressureSystolic: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bpDiastolic">BP Diastolic</Label>
                  <Input
                    id="bpDiastolic"
                    type="number"
                    placeholder="80"
                    value={vitalForm.bloodPressureDiastolic}
                    onChange={(e) => setVitalForm({ ...vitalForm, bloodPressureDiastolic: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bloodSugar">Blood Sugar (mg/dL)</Label>
                <Input
                  id="bloodSugar"
                  type="number"
                  placeholder="95"
                  value={vitalForm.bloodSugar}
                  onChange={(e) => setVitalForm({ ...vitalForm, bloodSugar: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="spo2">SpO₂ (%)</Label>
                <Input
                  id="spo2"
                  type="number"
                  placeholder="98"
                  value={vitalForm.spo2}
                  onChange={(e) => setVitalForm({ ...vitalForm, spo2: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="temperature">Temperature (°C)</Label>
                <Input
                  id="temperature"
                  type="number"
                  step="0.1"
                  placeholder="36.8"
                  value={vitalForm.temperature}
                  onChange={(e) => setVitalForm({ ...vitalForm, temperature: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  placeholder="70"
                  value={vitalForm.weight}
                  onChange={(e) => setVitalForm({ ...vitalForm, weight: e.target.value })}
                />
              </div>
              <Button onClick={handleAddVital} className="w-full">
                Save Vitals
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {vitalCards.map((vital) => {
          const Icon = vital.icon;
          return (
            <Card
              key={vital.id}
              className="cursor-pointer transition-shadow hover:shadow-md"
              onClick={() => setSelectedVital(vital.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{vital.title}</CardTitle>
                  <div className={`rounded-lg p-2 ${vital.bgColor}`}>
                    <Icon className={`h-5 w-5 ${vital.color}`} />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-1">
                  <span className={`text-3xl font-bold ${vital.color}`}>{vital.value}</span>
                  <span className="text-sm text-muted-foreground">{vital.unit}</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">Last updated: Today</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Trend Analysis</CardTitle>
          <CardDescription>Your vital measurements over the past 5 days (sample data)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockVitalsData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="date" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey={selectedVital}
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--primary))' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
