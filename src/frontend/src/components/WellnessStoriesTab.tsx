import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { BookOpen, Heart, PenLine, Sparkles, User } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Story {
  id: string;
  title: string;
  author: string;
  category: string;
  preview: string;
  fullText: string;
  timestamp?: string;
  isCommunity?: boolean;
}

const FEATURED_STORIES: Story[] = [
  {
    id: "featured-1",
    title: "How I Overcame Anxiety Without Medication",
    author: "Priya M.",
    category: "Anxiety",
    preview:
      "After two years of struggling with daily panic attacks, I discovered that small, consistent practices could rewire how my nervous system responded to stress...",
    fullText:
      "After two years of struggling with daily panic attacks, I discovered that small, consistent practices could rewire how my nervous system responded to stress.\n\nIt began during the height of my career stress — I was waking at 3am, heart racing, convinced something terrible was about to happen. I saw several doctors, tried different approaches, but nothing stuck until I found HealthOS AI's CBT modules.\n\nThe turning point was learning to catch my thoughts before they spiraled. The cognitive restructuring exercises taught me to pause and ask: 'Is this thought a fact, or is it a story?' Nine times out of ten, it was a story I'd been telling myself for years.\n\nWithin three months of daily practice — journaling, breathing exercises, and mood tracking — my panic attacks dropped from daily to maybe once a month. I still have hard days, but I have tools now. That changes everything.",
  },
  {
    id: "featured-2",
    title: "My 90-Day Sleep Transformation Journey",
    author: "Arjun K.",
    category: "Sleep",
    preview:
      "I used to think 5 hours of sleep was normal. I was wrong. Tracking my sleep revealed patterns I never knew existed — and fixing them changed my entire life...",
    fullText:
      "I used to think 5 hours of sleep was normal. I was wrong. Tracking my sleep revealed patterns I never knew existed — and fixing them changed my entire life.\n\nAs a software engineer, I romanticized grinding late into the night. My productivity felt high — until the sleep analysis showed me my actual cognitive performance was declining sharply after 10pm. I was burning the midnight oil on half a brain.\n\nThe sleep estimator identified my chronotype as a 'morning lion' — my natural peak was 6-10am, which I'd been ignoring by sleeping at 1am. Once I shifted my schedule, aligning my deep work with my biological rhythm, the change was staggering.\n\nI write better code in 3 focused morning hours than I ever did in 6 foggy evening ones. Sleep isn't wasted time. It's the maintenance window your brain desperately needs.",
  },
  {
    id: "featured-3",
    title: "Running My First 10K at 45 — A Story About Starting Late",
    author: "Sunita R.",
    category: "Fitness",
    preview:
      "Everyone said 45 was too late to start running. I crossed the finish line of my first 10K in tears — not because it was hard, but because I finally understood what my body was capable of...",
    fullText:
      "Everyone said 45 was too late to start running. I crossed the finish line of my first 10K in tears — not because it was hard, but because I finally understood what my body was capable of.\n\nI'd spent decades telling myself I wasn't athletic. Desk job, two kids, the usual story. Then my doctor flagged early signs of metabolic syndrome and I realised I had to change.\n\nI started with the fitness tracking module — just 10-minute walks. The app tracked my consistency streak, and something small in my brain shifted. I didn't want to break the chain.\n\nSix months later I was running 5K without stopping. At month nine, I registered for the Mumbai 10K. I trained through humidity, knee doubts, and mental battles.\n\nWhen I crossed that finish line, my daughter was waiting. She's 14 now, and she started running too. That's the story I really wanted to tell.",
  },
];

const STORY_CATEGORIES = [
  "Anxiety",
  "Depression",
  "Sleep",
  "Fitness",
  "Nutrition",
  "Stress",
  "Mindfulness",
  "Recovery",
  "Inspiration",
];

const CATEGORY_COLORS: Record<string, string> = {
  Anxiety: "bg-blue-100 text-blue-700",
  Depression: "bg-purple-100 text-purple-700",
  Sleep: "bg-indigo-100 text-indigo-700",
  Fitness: "bg-green-100 text-green-700",
  Nutrition: "bg-lime-100 text-lime-700",
  Stress: "bg-amber-100 text-amber-700",
  Mindfulness: "bg-teal-100 text-teal-700",
  Recovery: "bg-rose-100 text-rose-700",
  Inspiration: "bg-orange-100 text-orange-700",
};

function StoryCard({
  story,
  onClick,
}: {
  story: Story;
  onClick: () => void;
}) {
  return (
    <Card
      className="hover:shadow-lg transition-shadow cursor-pointer group"
      onClick={onClick}
      data-ocid="stories.story.card"
    >
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1 flex-1">
            <Badge
              className={`text-xs mb-2 ${
                CATEGORY_COLORS[story.category] ??
                "bg-muted text-muted-foreground"
              }`}
            >
              {story.category}
            </Badge>
            <CardTitle className="text-base leading-snug group-hover:text-primary transition-colors">
              {story.title}
            </CardTitle>
            <CardDescription className="flex items-center gap-1 text-xs">
              <User className="h-3 w-3" />
              {story.author}
              {story.timestamp && (
                <span className="ml-2 opacity-60">{story.timestamp}</span>
              )}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {story.preview}
        </p>
        <button
          type="button"
          className="mt-3 text-xs text-primary hover:underline font-medium"
          data-ocid="stories.read_more.button"
        >
          Read full story &rarr;
        </button>
      </CardContent>
    </Card>
  );
}

export default function WellnessStoriesTab() {
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("");
  const [storyText, setStoryText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [communityStories, setCommunityStories] = useState<Story[]>(() => {
    try {
      return JSON.parse(
        localStorage.getItem("healthos_community_stories") || "[]",
      );
    } catch {
      return [];
    }
  });

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast.error("Please add a story title");
      return;
    }
    if (!category) {
      toast.error("Please select a category");
      return;
    }
    if (storyText.trim().length < 50) {
      toast.error("Story must be at least 50 characters");
      return;
    }
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 600));
    const preview =
      storyText.trim().slice(0, 140) +
      (storyText.trim().length > 140 ? "..." : "");
    const story: Story = {
      id: Date.now().toString(),
      title: title.trim(),
      author: author.trim() || "Anonymous",
      category,
      preview,
      fullText: storyText.trim(),
      timestamp: new Date().toLocaleDateString(),
      isCommunity: true,
    };
    const updated = [story, ...communityStories];
    setCommunityStories(updated);
    localStorage.setItem("healthos_community_stories", JSON.stringify(updated));
    setTitle("");
    setAuthor("");
    setCategory("");
    setStoryText("");
    setSubmitting(false);
    toast.success("Your story has been shared! 🌟");
  };

  return (
    <div className="space-y-8">
      {/* Hero CTA */}
      <div className="rounded-xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 p-6">
        <div className="flex items-center gap-3 mb-2">
          <Sparkles className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold text-foreground">
            Wellness Stories
          </h2>
        </div>
        <p className="text-muted-foreground text-sm max-w-xl">
          Real stories from real people on their health journeys. Share yours
          and inspire someone who needs it today.
        </p>
      </div>

      {/* Featured Stories */}
      <section>
        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          Featured Stories
        </h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {FEATURED_STORIES.map((story, i) => (
            <div key={story.id} data-ocid={`stories.featured.item.${i + 1}`}>
              <StoryCard
                story={story}
                onClick={() => setSelectedStory(story)}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Share Your Story */}
      <section>
        <Card data-ocid="stories.submit.card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PenLine className="h-5 w-5 text-primary" />
              Share Your Story
            </CardTitle>
            <CardDescription>
              Your journey could be exactly what someone else needs to hear
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="story-title" className="font-semibold">
                  Story Title
                </Label>
                <Input
                  id="story-title"
                  placeholder="Give your story a meaningful title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  data-ocid="stories.title.input"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="story-author" className="font-semibold">
                  Your Name{" "}
                  <span className="font-normal text-muted-foreground">
                    (optional)
                  </span>
                </Label>
                <Input
                  id="story-author"
                  placeholder="Anonymous"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  data-ocid="stories.author.input"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="story-category" className="font-semibold">
                Category
              </Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger
                  id="story-category"
                  data-ocid="stories.category.select"
                >
                  <SelectValue placeholder="Choose a category" />
                </SelectTrigger>
                <SelectContent>
                  {STORY_CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="story-text" className="font-semibold">
                Your Story
              </Label>
              <Textarea
                id="story-text"
                placeholder="Share your journey — what challenges did you face, what helped you, and what would you tell someone just starting out?"
                value={storyText}
                onChange={(e) => setStoryText(e.target.value)}
                rows={6}
                data-ocid="stories.story.textarea"
              />
              <p className="text-xs text-muted-foreground">
                {storyText.length} characters{" "}
                {storyText.length < 50 && "(minimum 50)"}
              </p>
            </div>
            <Button
              className="w-full"
              onClick={handleSubmit}
              disabled={submitting}
              data-ocid="stories.submit_button"
            >
              <Heart className="h-4 w-4 mr-2" />
              {submitting ? "Sharing..." : "Share Your Story"}
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Community Stories */}
      {communityStories.length > 0 && (
        <section>
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary" />
            Community Stories ({communityStories.length})
          </h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {communityStories.map((story, i) => (
              <div key={story.id} data-ocid={`stories.community.item.${i + 1}`}>
                <StoryCard
                  story={story}
                  onClick={() => setSelectedStory(story)}
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {communityStories.length === 0 && (
        <div
          className="text-center py-8 text-muted-foreground"
          data-ocid="stories.empty_state"
        >
          <BookOpen className="h-10 w-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">
            No community stories yet. Be the first to share!
          </p>
        </div>
      )}

      {/* Story Reader Dialog */}
      <Dialog
        open={!!selectedStory}
        onOpenChange={(o) => !o && setSelectedStory(null)}
      >
        <DialogContent
          className="max-w-2xl max-h-[80vh] overflow-y-auto"
          data-ocid="stories.story.dialog"
        >
          {selectedStory && (
            <>
              <DialogHeader>
                <Badge
                  className={`w-fit text-xs mb-1 ${
                    CATEGORY_COLORS[selectedStory.category] ??
                    "bg-muted text-muted-foreground"
                  }`}
                >
                  {selectedStory.category}
                </Badge>
                <DialogTitle className="text-xl leading-snug">
                  {selectedStory.title}
                </DialogTitle>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <User className="h-3 w-3" /> {selectedStory.author}
                  {selectedStory.timestamp && (
                    <span className="ml-2 opacity-60">
                      &middot; {selectedStory.timestamp}
                    </span>
                  )}
                </p>
              </DialogHeader>
              <div className="space-y-4">
                {selectedStory.fullText.split("\n\n").map((para) => (
                  <p
                    key={para.slice(0, 40)}
                    className="text-sm leading-relaxed"
                  >
                    {para}
                  </p>
                ))}
              </div>
              <Button
                variant="outline"
                onClick={() => setSelectedStory(null)}
                className="w-full mt-2"
                data-ocid="stories.close_button"
              >
                Close
              </Button>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
