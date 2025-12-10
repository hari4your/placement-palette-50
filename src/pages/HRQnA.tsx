import { useState } from 'react';
import { HelpCircle, Plus, Edit2, Trash2, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EmptyState } from '@/components/EmptyState';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { HRQuestion } from '@/types/workspace';
import { cn } from '@/lib/utils';

const initialFormData: {
  question: string;
  answer: string;
  category: 'hr' | 'technical';
} = {
  question: '',
  answer: '',
  category: 'hr'
};

export default function HRQnA() {
  const [questions, setQuestions] = useLocalStorage<HRQuestion[]>('hrQuestions', []);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<HRQuestion | null>(null);
  const [formData, setFormData] = useState(initialFormData);
  const [activeTab, setActiveTab] = useState<'hr' | 'technical'>('hr');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredQuestions = questions.filter(q => q.category === activeTab);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingQuestion) {
      setQuestions(prev => prev.map(q => 
        q.id === editingQuestion.id 
          ? { ...q, ...formData }
          : q
      ));
    } else {
      const newQuestion: HRQuestion = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date().toISOString()
      };
      setQuestions(prev => [...prev, newQuestion]);
    }
    
    resetForm();
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setEditingQuestion(null);
    setDialogOpen(false);
  };

  const handleEdit = (question: HRQuestion) => {
    setEditingQuestion(question);
    setFormData({
      question: question.question,
      answer: question.answer,
      category: question.category
    });
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setQuestions(prev => prev.filter(q => q.id !== id));
  };

  const hrCount = questions.filter(q => q.category === 'hr').length;
  const techCount = questions.filter(q => q.category === 'technical').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">HR & Technical QnA</h1>
          <p className="text-muted-foreground mt-1">
            Common questions and your best answers
          </p>
        </div>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2" onClick={() => resetForm()}>
              <Plus className="w-4 h-4" />
              Add Question
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingQuestion ? 'Edit Question' : 'Add Question & Answer'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value: 'hr' | 'technical') => 
                    setFormData(prev => ({ ...prev, category: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hr">🤝 HR Question</SelectItem>
                    <SelectItem value="technical">💻 Technical Question</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="question">Question</Label>
                <Input
                  id="question"
                  placeholder="e.g., Tell me about yourself"
                  value={formData.question}
                  onChange={(e) => setFormData(prev => ({ ...prev, question: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="answer">Your Answer</Label>
                <Textarea
                  id="answer"
                  placeholder="Write your best answer here..."
                  value={formData.answer}
                  onChange={(e) => setFormData(prev => ({ ...prev, answer: e.target.value }))}
                  className="min-h-[150px]"
                  required
                />
              </div>
              <div className="flex gap-2 justify-end pt-2">
                <Button type="button" variant="ghost" onClick={resetForm}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingQuestion ? 'Save Changes' : 'Add Question'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Category Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'hr' | 'technical')}>
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="hr" className="gap-2">
            🤝 HR Questions
            <span className="px-2 py-0.5 rounded-full bg-rose-light text-xs">{hrCount}</span>
          </TabsTrigger>
          <TabsTrigger value="technical" className="gap-2">
            💻 Technical
            <span className="px-2 py-0.5 rounded-full bg-sky-light text-xs">{techCount}</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="hr" className="mt-6">
          {hrCount === 0 ? (
            <EmptyState
              icon={HelpCircle}
              title="No HR questions yet"
              description="Add common HR questions like 'Tell me about yourself' with your prepared answers"
              actionLabel="Add HR Question"
              onAction={() => {
                setFormData(prev => ({ ...prev, category: 'hr' }));
                setDialogOpen(true);
              }}
              gradient="gradient-rose"
            />
          ) : (
            <QuestionsList 
              questions={filteredQuestions}
              expandedId={expandedId}
              setExpandedId={setExpandedId}
              onEdit={handleEdit}
              onDelete={handleDelete}
              gradient="gradient-rose"
            />
          )}
        </TabsContent>

        <TabsContent value="technical" className="mt-6">
          {techCount === 0 ? (
            <EmptyState
              icon={HelpCircle}
              title="No technical questions yet"
              description="Add common technical questions like 'Explain OOPs concepts' with detailed answers"
              actionLabel="Add Technical Question"
              onAction={() => {
                setFormData(prev => ({ ...prev, category: 'technical' }));
                setDialogOpen(true);
              }}
              gradient="gradient-sky"
            />
          ) : (
            <QuestionsList 
              questions={filteredQuestions}
              expandedId={expandedId}
              setExpandedId={setExpandedId}
              onEdit={handleEdit}
              onDelete={handleDelete}
              gradient="gradient-sky"
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface QuestionsListProps {
  questions: HRQuestion[];
  expandedId: string | null;
  setExpandedId: (id: string | null) => void;
  onEdit: (question: HRQuestion) => void;
  onDelete: (id: string) => void;
  gradient: string;
}

function QuestionsList({ questions, expandedId, setExpandedId, onEdit, onDelete, gradient }: QuestionsListProps) {
  return (
    <div className="space-y-3">
      {questions.map((question, index) => {
        const isExpanded = expandedId === question.id;
        
        return (
          <div
            key={question.id}
            className={cn(
              "group rounded-2xl bg-card border border-border overflow-hidden",
              "card-hover shadow-card animate-fade-in"
            )}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div 
              className="p-5 cursor-pointer"
              onClick={() => setExpandedId(isExpanded ? null : question.id)}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", gradient)}>
                    <HelpCircle className="w-5 h-5 text-foreground/80" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium">{question.question}</h3>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); onEdit(question); }}>
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); onDelete(question.id); }}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                  <ChevronDown className={cn(
                    "w-5 h-5 text-muted-foreground transition-transform",
                    isExpanded && "rotate-180"
                  )} />
                </div>
              </div>
            </div>
            
            {isExpanded && (
              <div className="px-5 pb-5 pt-0 border-t border-border animate-fade-in">
                <div className={cn("p-4 rounded-xl mt-4", gradient)}>
                  <h4 className="font-medium mb-2 text-sm">Your Answer</h4>
                  <p className="text-foreground/80 whitespace-pre-wrap">{question.answer}</p>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
