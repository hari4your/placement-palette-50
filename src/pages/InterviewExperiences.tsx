import { useState } from 'react';
import { MessageSquare, Plus, Edit2, Trash2, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { EmptyState } from '@/components/EmptyState';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { InterviewExperience } from '@/types/workspace';
import { cn } from '@/lib/utils';

const resultConfig = {
  selected: { icon: CheckCircle, label: 'Selected', color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900/30' },
  rejected: { icon: XCircle, label: 'Rejected', color: 'text-red-500', bg: 'bg-red-100 dark:bg-red-900/30' },
  pending: { icon: Clock, label: 'Pending', color: 'text-amber-500', bg: 'bg-amber-100 dark:bg-amber-900/30' }
};

const initialFormData: {
  company: string;
  role: string;
  date: string;
  rounds: string;
  experience: string;
  result: 'selected' | 'rejected' | 'pending';
  tips: string;
} = {
  company: '',
  role: '',
  date: '',
  rounds: '',
  experience: '',
  result: 'pending',
  tips: ''
};

export default function InterviewExperiences() {
  const [experiences, setExperiences] = useLocalStorage<InterviewExperience[]>('interviewExperiences', []);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingExp, setEditingExp] = useState<InterviewExperience | null>(null);
  const [formData, setFormData] = useState(initialFormData);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingExp) {
      setExperiences(prev => prev.map(exp => 
        exp.id === editingExp.id 
          ? { ...exp, ...formData }
          : exp
      ));
    } else {
      const newExp: InterviewExperience = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date().toISOString()
      };
      setExperiences(prev => [newExp, ...prev]);
    }
    
    resetForm();
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setEditingExp(null);
    setDialogOpen(false);
  };

  const handleEdit = (exp: InterviewExperience) => {
    setEditingExp(exp);
    setFormData({
      company: exp.company,
      role: exp.role,
      date: exp.date,
      rounds: exp.rounds,
      experience: exp.experience,
      result: exp.result,
      tips: exp.tips || ''
    });
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setExperiences(prev => prev.filter(exp => exp.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Interview Experiences</h1>
          <p className="text-muted-foreground mt-1">
            Document and learn from your interview journey
          </p>
        </div>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2" onClick={() => resetForm()}>
              <Plus className="w-4 h-4" />
              Add Experience
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingExp ? 'Edit Experience' : 'Add Interview Experience'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    placeholder="e.g., Google, Microsoft"
                    value={formData.company}
                    onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Input
                    id="role"
                    placeholder="e.g., SDE Intern, SWE"
                    value={formData.role}
                    onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                    required
                  />
                </div>
              </div>
              
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Interview Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rounds">Rounds Attended</Label>
                  <Input
                    id="rounds"
                    placeholder="e.g., OA + 2 Tech + HR"
                    value={formData.rounds}
                    onChange={(e) => setFormData(prev => ({ ...prev, rounds: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="result">Result</Label>
                <Select
                  value={formData.result}
                  onValueChange={(value: 'selected' | 'rejected' | 'pending') => 
                    setFormData(prev => ({ ...prev, result: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="selected">✅ Selected</SelectItem>
                    <SelectItem value="rejected">❌ Rejected</SelectItem>
                    <SelectItem value="pending">⏳ Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="experience">Interview Experience</Label>
                <Textarea
                  id="experience"
                  placeholder="Describe your interview experience in detail..."
                  value={formData.experience}
                  onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
                  className="min-h-[150px]"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="tips">Tips for Others (Optional)</Label>
                <Textarea
                  id="tips"
                  placeholder="Any tips you'd give to someone preparing for this..."
                  value={formData.tips}
                  onChange={(e) => setFormData(prev => ({ ...prev, tips: e.target.value }))}
                  className="min-h-[80px]"
                />
              </div>
              
              <div className="flex gap-2 justify-end pt-4">
                <Button type="button" variant="ghost" onClick={resetForm}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingExp ? 'Save Changes' : 'Add Experience'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Experiences List */}
      {experiences.length === 0 ? (
        <EmptyState
          icon={MessageSquare}
          title="No interview experiences yet"
          description="Document your interview experiences to track your progress and help yourself review"
          actionLabel="Add Your First Experience"
          onAction={() => setDialogOpen(true)}
          gradient="gradient-lavender"
        />
      ) : (
        <div className="space-y-4">
          {experiences.map((exp, index) => {
            const result = resultConfig[exp.result];
            const ResultIcon = result.icon;
            const isExpanded = expandedId === exp.id;
            
            return (
              <div
                key={exp.id}
                className={cn(
                  "group rounded-2xl bg-card border border-border overflow-hidden",
                  "card-hover shadow-card animate-fade-in"
                )}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Header */}
                <div 
                  className="p-5 cursor-pointer"
                  onClick={() => setExpandedId(isExpanded ? null : exp.id)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold">{exp.company}</h3>
                        <span className={cn(
                          "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium",
                          result.bg, result.color
                        )}>
                          <ResultIcon className="w-3.5 h-3.5" />
                          {result.label}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                        <span>{exp.role}</span>
                        <span>•</span>
                        <span>{new Date(exp.date).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}</span>
                        <span>•</span>
                        <span>{exp.rounds}</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); handleEdit(exp); }}>
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); handleDelete(exp.id); }}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </div>
                
                {/* Expanded Content */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-0 border-t border-border animate-fade-in">
                    <div className="pt-4 space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Experience</h4>
                        <p className="text-muted-foreground whitespace-pre-wrap">{exp.experience}</p>
                      </div>
                      {exp.tips && (
                        <div className="p-4 rounded-xl gradient-mint">
                          <h4 className="font-medium mb-2">💡 Tips</h4>
                          <p className="text-muted-foreground whitespace-pre-wrap">{exp.tips}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
