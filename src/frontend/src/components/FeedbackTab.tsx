import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Send, Star, ThumbsUp } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface FeedbackEntry {
  id: string;
  rating: number;
  category: string;
  message: string;
  timestamp: string;
}

const CATEGORIES = [
  "General",
  "Mental Health Tools",
  "Sleep Tracking",
  "Meditation",
  "AI Assistant",
  "Suggestions",
];

function StarRating({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          className="transition-transform hover:scale-110"
          data-ocid="feedback.star.toggle"
        >
          <Star
            className="h-7 w-7"
            fill={(hovered || value) >= star ? "currentColor" : "none"}
            color={
              (hovered || value) >= star
                ? "oklch(0.75 0.18 50)"
                : "oklch(0.75 0 0)"
            }
          />
        </button>
      ))}
    </div>
  );
}

function FeedbackCard({ entry }: { entry: FeedbackEntry }) {
  return (
    <Card className="border-border">
      <CardContent className="pt-4">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1 flex-1">
            <div className="flex items-center gap-2">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className="h-3.5 w-3.5"
                    fill={s <= entry.rating ? "currentColor" : "none"}
                    color={
                      s <= entry.rating
                        ? "oklch(0.75 0.18 50)"
                        : "oklch(0.75 0 0)"
                    }
                  />
                ))}
              </div>
              <Badge variant="secondary" className="text-xs">
                {entry.category}
              </Badge>
            </div>
            <p className="text-sm text-foreground">{entry.message}</p>
            <p className="text-xs text-muted-foreground">{entry.timestamp}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function FeedbackTab() {
  const [rating, setRating] = useState(0);
  const [category, setCategory] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [feedbackList, setFeedbackList] = useState<FeedbackEntry[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("healthos_feedback") || "[]");
    } catch {
      return [];
    }
  });

  const handleSubmit = async () => {
    if (!rating) {
      toast.error("Please select a star rating");
      return;
    }
    if (!category) {
      toast.error("Please select a category");
      return;
    }
    if (!message.trim()) {
      toast.error("Please write your feedback");
      return;
    }
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 500));
    const entry: FeedbackEntry = {
      id: Date.now().toString(),
      rating,
      category,
      message: message.trim(),
      timestamp: new Date().toLocaleString(),
    };
    const updated = [entry, ...feedbackList];
    setFeedbackList(updated);
    localStorage.setItem("healthos_feedback", JSON.stringify(updated));
    setRating(0);
    setCategory("");
    setMessage("");
    setSubmitting(false);
    toast.success("Thank you for your feedback! 🙏");
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Feedback</h2>
        <p className="text-muted-foreground">
          Help us improve HealthOS AI with your honest feedback
        </p>
      </div>

      {/* Submit Form */}
      <Card data-ocid="feedback.card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ThumbsUp className="h-5 w-5 text-primary" />
            Share Your Experience
          </CardTitle>
          <CardDescription>
            Your feedback directly shapes the app
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label className="font-semibold">Overall Rating</Label>
            <StarRating value={rating} onChange={setRating} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="feedback-category" className="font-semibold">
              Category
            </Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger
                id="feedback-category"
                data-ocid="feedback.category.select"
              >
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="feedback-message" className="font-semibold">
              Your Feedback
            </Label>
            <Textarea
              id="feedback-message"
              placeholder="Tell us what you think — what worked well, what could be better, or any ideas you have..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              data-ocid="feedback.message.textarea"
            />
          </div>

          <Button
            className="w-full"
            onClick={handleSubmit}
            disabled={submitting}
            data-ocid="feedback.submit_button"
          >
            <Send className="h-4 w-4 mr-2" />
            {submitting ? "Submitting..." : "Submit Feedback"}
          </Button>
        </CardContent>
      </Card>

      {/* Previous Feedback */}
      {feedbackList.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-semibold flex items-center gap-2 text-foreground">
            <MessageSquare className="h-4 w-4 text-primary" />
            Your Previous Feedback ({feedbackList.length})
          </h3>
          <div className="space-y-3" data-ocid="feedback.list">
            {feedbackList.map((entry, i) => (
              <div key={entry.id} data-ocid={`feedback.item.${i + 1}`}>
                <FeedbackCard entry={entry} />
              </div>
            ))}
          </div>
        </div>
      )}

      {feedbackList.length === 0 && (
        <div
          className="text-center py-10 text-muted-foreground"
          data-ocid="feedback.empty_state"
        >
          <MessageSquare className="h-10 w-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No feedback submitted yet</p>
        </div>
      )}
    </div>
  );
}
