import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Users, Plus, Heart, Shield, AlertCircle, UserPlus } from 'lucide-react';
import { toast } from 'sonner';

export default function FamilyHealthTab() {
  const mockFamilyMembers = [
    { id: '1', name: 'Sarah Johnson', relation: 'Spouse', healthScore: 82, status: 'Good' },
    { id: '2', name: 'Michael Johnson', relation: 'Child', healthScore: 90, status: 'Excellent' },
    { id: '3', name: 'Emma Johnson', relation: 'Child', healthScore: 88, status: 'Good' },
  ];

  const mockEmergencyContacts = [
    { id: '1', name: 'Dr. Smith', phone: '+1 (555) 123-4567', type: 'Primary Doctor' },
    { id: '2', name: 'Sarah Johnson', phone: '+1 (555) 987-6543', type: 'Emergency Contact' },
  ];

  const handleAddMember = () => {
    toast.success('Family member invitation sent');
  };

  const handleAddContact = () => {
    toast.success('Emergency contact added');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Family Health Management</h2>
          <p className="text-muted-foreground">Monitor and manage your family's health together</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img
                  src="/assets/generated/family-health.dim_600x400.png"
                  alt="Family Health"
                  className="h-12 w-16 rounded-lg object-cover"
                />
                <div>
                  <CardTitle>Family Members</CardTitle>
                  <CardDescription>Connected health profiles</CardDescription>
                </div>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Add Member
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Family Member</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="memberName">Name</Label>
                      <Input id="memberName" placeholder="Enter name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="memberEmail">Email or Principal ID</Label>
                      <Input id="memberEmail" placeholder="email@example.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="relation">Relationship</Label>
                      <Input id="relation" placeholder="e.g., Spouse, Child, Parent" />
                    </div>
                    <Button onClick={handleAddMember} className="w-full">
                      Send Invitation
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockFamilyMembers.map((member) => (
                <div key={member.id} className="flex items-center justify-between rounded-lg border border-border p-4">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>{member.name.split(' ').map((n) => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{member.name}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{member.relation}</span>
                        <span>•</span>
                        <span>Health Score: {member.healthScore}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-green-600">
                      {member.status}
                    </Badge>
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Family Health Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Total Members</span>
                <span className="font-medium">{mockFamilyMembers.length}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Avg. Health Score</span>
                <span className="font-medium">87</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Active Alerts</span>
                <span className="font-medium">0</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Shared Features</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-start gap-2">
                <Heart className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <p>View family health trends</p>
              </div>
              <div className="flex items-start gap-2">
                <Shield className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <p>Emergency health access</p>
              </div>
              <div className="flex items-start gap-2">
                <Users className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <p>Shared appointments</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img
                src="/assets/generated/emergency-sos.dim_400x300.png"
                alt="Emergency SOS"
                className="h-12 w-16 rounded-lg object-cover"
              />
              <div>
                <CardTitle>Emergency Contacts & SOS</CardTitle>
                <CardDescription>Quick access in case of emergency</CardDescription>
              </div>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Contact
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Emergency Contact</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="contactName">Name</Label>
                    <Input id="contactName" placeholder="Enter name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactPhone">Phone Number</Label>
                    <Input id="contactPhone" type="tel" placeholder="+1 (555) 123-4567" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactType">Contact Type</Label>
                    <Input id="contactType" placeholder="e.g., Doctor, Family Member" />
                  </div>
                  <Button onClick={handleAddContact} className="w-full">
                    Add Contact
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockEmergencyContacts.map((contact) => (
              <div key={contact.id} className="flex items-center justify-between rounded-lg border border-border p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-red-100 p-2 dark:bg-red-900/30">
                    <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <p className="font-medium">{contact.name}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{contact.type}</span>
                      <span>•</span>
                      <span>{contact.phone}</span>
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Call
                </Button>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <Button variant="destructive" className="w-full" size="lg">
              <AlertCircle className="mr-2 h-5 w-5" />
              Activate SOS Mode
            </Button>
            <p className="mt-2 text-center text-xs text-muted-foreground">
              Sends your vitals and location to emergency contacts
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
