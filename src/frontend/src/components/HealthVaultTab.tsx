import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FileText, Upload, Eye, Download, Lock, Sparkles, Shield } from 'lucide-react';
import { toast } from 'sonner';

export default function HealthVaultTab() {
  const [isUploading, setIsUploading] = useState(false);
  const isPremium = false;

  const mockDocuments = [
    {
      id: '1',
      name: 'Blood Test Results - Jan 2026',
      type: 'Lab Report',
      date: '2026-01-01',
      size: '2.4 MB',
    },
    {
      id: '2',
      name: 'Prescription - Dr. Smith',
      type: 'Prescription',
      date: '2025-12-28',
      size: '1.1 MB',
    },
    {
      id: '3',
      name: 'X-Ray Report',
      type: 'Imaging',
      date: '2025-12-15',
      size: '5.8 MB',
    },
  ];

  const handleUpload = () => {
    if (!isPremium) {
      toast.error('Health Vault is a premium feature. Please upgrade your membership.');
      return;
    }
    setIsUploading(true);
    setTimeout(() => {
      toast.success('Document uploaded successfully');
      setIsUploading(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Health Vault</h2>
          <p className="text-muted-foreground">Secure storage for your medical records and documents</p>
        </div>
        {!isPremium && (
          <Badge variant="outline" className="gap-1">
            <Lock className="h-3 w-3" />
            Premium Feature
          </Badge>
        )}
      </div>

      {!isPremium && (
        <Card className="border-primary bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/30 dark:to-card">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <CardTitle>Unlock Health Vault</CardTitle>
            </div>
            <CardDescription>Secure storage for all your medical documents</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-muted-foreground">
              Upgrade to premium to access encrypted document storage, AI report analysis, and secure sharing.
            </p>
            <Button>Upgrade to Premium</Button>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>My Documents</CardTitle>
                <CardDescription>Your encrypted medical records</CardDescription>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button disabled={!isPremium}>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Upload Medical Document</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="docType">Document Type</Label>
                      <Input id="docType" placeholder="e.g., Lab Report, Prescription" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="file">Select File</Label>
                      <Input id="file" type="file" accept=".pdf,.jpg,.jpeg,.png" />
                    </div>
                    <Button onClick={handleUpload} disabled={isUploading} className="w-full">
                      {isUploading ? 'Uploading...' : 'Upload Document'}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockDocuments.map((doc) => (
                <div
                  key={doc.id}
                  className={`flex items-center justify-between rounded-lg border border-border p-4 ${!isPremium && 'opacity-60'}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/30">
                      <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="font-medium">{doc.name}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{doc.type}</span>
                        <span>•</span>
                        <span>{doc.date}</span>
                        <span>•</span>
                        <span>{doc.size}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" disabled={!isPremium}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" disabled={!isPremium}>
                      <Download className="h-4 w-4" />
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
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-green-600 dark:text-green-400" />
                <CardTitle className="text-base">Security & Privacy</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <div className="mt-0.5 h-2 w-2 rounded-full bg-green-600" />
                <p className="text-muted-foreground">End-to-end encryption</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="mt-0.5 h-2 w-2 rounded-full bg-green-600" />
                <p className="text-muted-foreground">HIPAA compliant storage</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="mt-0.5 h-2 w-2 rounded-full bg-green-600" />
                <p className="text-muted-foreground">Secure sharing options</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="mt-0.5 h-2 w-2 rounded-full bg-green-600" />
                <p className="text-muted-foreground">Audit trail logging</p>
              </div>
            </CardContent>
          </Card>

          <Card className={isPremium ? '' : 'opacity-60'}>
            <CardHeader>
              <CardTitle className="text-base">AI Report Analyzer</CardTitle>
              <CardDescription>Get insights from your medical reports</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm text-muted-foreground">
                Our AI can analyze your lab reports and provide easy-to-understand summaries.
              </p>
              <Button variant="outline" className="w-full" disabled={!isPremium}>
                Analyze Latest Report
              </Button>
            </CardContent>
          </Card>

          <Card className={isPremium ? '' : 'opacity-60'}>
            <CardHeader>
              <CardTitle className="text-base">Storage Usage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Used</span>
                  <span className="text-muted-foreground">9.3 MB / 1 GB</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div className="h-full w-[1%] bg-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
