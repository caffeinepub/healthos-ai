import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Send, Bot, User, Lock, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function AIAssistantTab() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content:
        "Hello! I'm your AI Health Assistant. I can help answer your health questions, explain medical terms, and provide guidance based on your tracked vitals. How can I assist you today?",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const isPremium = false;

  const handleSendMessage = () => {
    if (!isPremium) {
      toast.error('AI Assistant is a premium feature. Please upgrade your membership.');
      return;
    }

    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');

    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content:
          "I understand your concern. Based on your recent vitals, everything appears to be within normal ranges. However, I recommend consulting with a healthcare professional for personalized medical advice. Is there anything specific you'd like to know more about?",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">AI Health Assistant</h2>
          <p className="text-muted-foreground">24/7 AI-powered medical guidance and support</p>
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
              <CardTitle>Unlock AI Health Assistant</CardTitle>
            </div>
            <CardDescription>Get instant answers to your health questions</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-muted-foreground">
              Upgrade to premium to access 24/7 AI medical chat, symptom checker, and personalized health guidance.
            </p>
            <Button>Upgrade to Premium</Button>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Medical Chat</CardTitle>
            <CardDescription>Ask questions and get AI-powered health guidance</CardDescription>
          </CardHeader>
          <CardContent className="flex h-[600px] flex-col p-0">
            <ScrollArea className="flex-1 px-6">
              <div className="space-y-4 pb-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {message.role === 'assistant' && (
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary">
                        <Bot className="h-5 w-5 text-primary-foreground" />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] rounded-lg px-4 py-2 ${
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p className="mt-1 text-xs opacity-70">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    {message.role === 'user' && (
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary">
                        <User className="h-5 w-5 text-secondary-foreground" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
            <div className="border-t border-border p-4">
              <div className="flex gap-2">
                <Input
                  placeholder={isPremium ? 'Type your health question...' : 'Upgrade to premium to chat...'}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  disabled={!isPremium}
                />
                <Button onClick={handleSendMessage} size="icon" disabled={!isPremium}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start" disabled={!isPremium}>
                <MessageSquare className="mr-2 h-4 w-4" />
                Symptom Checker
              </Button>
              <Button variant="outline" className="w-full justify-start" disabled={!isPremium}>
                <MessageSquare className="mr-2 h-4 w-4" />
                Explain Medical Term
              </Button>
              <Button variant="outline" className="w-full justify-start" disabled={!isPremium}>
                <MessageSquare className="mr-2 h-4 w-4" />
                Medication Info
              </Button>
              <Button variant="outline" className="w-full justify-start" disabled={!isPremium}>
                <MessageSquare className="mr-2 h-4 w-4" />
                First Aid Guidance
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Common Questions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <button
                className="w-full rounded-lg border border-border p-2 text-left text-sm transition-colors hover:bg-muted disabled:opacity-50"
                disabled={!isPremium}
              >
                What do my blood pressure readings mean?
              </button>
              <button
                className="w-full rounded-lg border border-border p-2 text-left text-sm transition-colors hover:bg-muted disabled:opacity-50"
                disabled={!isPremium}
              >
                How can I improve my sleep quality?
              </button>
              <button
                className="w-full rounded-lg border border-border p-2 text-left text-sm transition-colors hover:bg-muted disabled:opacity-50"
                disabled={!isPremium}
              >
                What are normal blood sugar levels?
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
