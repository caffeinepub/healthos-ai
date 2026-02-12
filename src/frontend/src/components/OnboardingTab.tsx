import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquare, Send, Bot, User } from 'lucide-react';
import { toast } from 'sonner';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function OnboardingTab() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content:
        "Hello! I'm your HealthOS AI assistant. I'll help you establish your baseline health score by asking a few questions about your lifestyle and health. Let's start: How would you describe your overall health right now?",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [healthScore, setHealthScore] = useState<number | null>(null);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "Thank you for sharing. How many hours of sleep do you typically get per night?",
        "That's helpful information. On a scale of 1-10, how would you rate your stress levels?",
        "I see. Do you exercise regularly? If so, how many times per week?",
        "Great! What are your main health goals? (e.g., weight loss, better sleep, stress management)",
        "Based on your responses, I'm calculating your baseline health score...",
      ];

      const randomResponse = responses[Math.floor(Math.random() * responses.length)];

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: randomResponse,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);

      // Simulate health score calculation after a few messages
      if (messages.length > 6 && !healthScore) {
        setTimeout(() => {
          const calculatedScore = Math.floor(Math.random() * 30) + 60; // Random score 60-90
          setHealthScore(calculatedScore);
          const scoreMessage: Message = {
            id: (Date.now() + 2).toString(),
            role: 'assistant',
            content: `Your baseline Health Score is ${calculatedScore}/100. This score is based on your current lifestyle and health indicators. I'll continue learning about your habits over the next 7 days to provide more personalized insights. Note: Full AI onboarding requires backend implementation.`,
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, scoreMessage]);
        }, 2000);
      }
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">AI Health Onboarding</h2>
        <p className="text-muted-foreground">Chat with our AI to establish your baseline health profile</p>
      </div>

      {healthScore !== null && (
        <Card className="border-green-200 bg-gradient-to-br from-green-50 to-white dark:border-green-900/50 dark:from-green-950/30 dark:to-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-green-600 dark:text-green-400" />
              Your Health Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="text-5xl font-bold text-green-600 dark:text-green-400">{healthScore}</div>
              <div className="flex-1">
                <div className="mb-2 h-3 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full bg-gradient-to-r from-green-500 to-green-600 transition-all"
                    style={{ width: `${healthScore}%` }}
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  {healthScore >= 80
                    ? 'Excellent health indicators!'
                    : healthScore >= 60
                      ? 'Good foundation, room for improvement'
                      : 'Let\'s work on improving your health'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="flex h-[600px] flex-col">
        <CardHeader>
          <CardTitle>AI Chat</CardTitle>
          <CardDescription>Have a conversation to help us understand your health better</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col p-0">
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
                placeholder="Type your message..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <Button onClick={handleSendMessage} size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
