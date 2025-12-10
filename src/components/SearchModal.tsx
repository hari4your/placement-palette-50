import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, FileText, Code, MessageSquare, Briefcase, X } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { CodingProfile, PDFResource, InterviewExperience, Project } from '@/types/workspace';
import { cn } from '@/lib/utils';

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
}

interface SearchResult {
  id: string;
  title: string;
  subtitle: string;
  type: 'profile' | 'pdf' | 'interview' | 'project';
  path: string;
}

export function SearchModal({ open, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const [codingProfiles] = useLocalStorage<CodingProfile[]>('codingProfiles', []);
  const [pdfResources] = useLocalStorage<PDFResource[]>('pdfResources', []);
  const [interviews] = useLocalStorage<InterviewExperience[]>('interviewExperiences', []);
  const [projects] = useLocalStorage<Project[]>('projects', []);

  // Keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (open) {
          onClose();
        }
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    
    const lowerQuery = query.toLowerCase();
    const searchResults: SearchResult[] = [];

    codingProfiles.forEach(p => {
      if (p.name.toLowerCase().includes(lowerQuery) || p.platform.toLowerCase().includes(lowerQuery)) {
        searchResults.push({
          id: p.id,
          title: p.name,
          subtitle: p.platform,
          type: 'profile',
          path: '/coding-profiles'
        });
      }
    });

    pdfResources.forEach(p => {
      if (p.name.toLowerCase().includes(lowerQuery) || p.category.toLowerCase().includes(lowerQuery)) {
        searchResults.push({
          id: p.id,
          title: p.name,
          subtitle: p.category.toUpperCase(),
          type: 'pdf',
          path: p.category === 'dsa' ? '/dsa-pdfs' : '/notes'
        });
      }
    });

    interviews.forEach(i => {
      if (i.company.toLowerCase().includes(lowerQuery) || i.role.toLowerCase().includes(lowerQuery)) {
        searchResults.push({
          id: i.id,
          title: i.company,
          subtitle: i.role,
          type: 'interview',
          path: '/interviews'
        });
      }
    });

    projects.forEach(p => {
      if (p.name.toLowerCase().includes(lowerQuery) || p.description.toLowerCase().includes(lowerQuery)) {
        searchResults.push({
          id: p.id,
          title: p.name,
          subtitle: p.techStack.join(', '),
          type: 'project',
          path: '/projects'
        });
      }
    });

    return searchResults.slice(0, 10);
  }, [query, codingProfiles, pdfResources, interviews, projects]);

  const getIcon = (type: SearchResult['type']) => {
    switch (type) {
      case 'profile': return Code;
      case 'pdf': return FileText;
      case 'interview': return MessageSquare;
      case 'project': return Briefcase;
    }
  };

  const handleSelect = (result: SearchResult) => {
    navigate(result.path);
    onClose();
    setQuery('');
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl p-0 gap-0 overflow-hidden">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
          <Search className="w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search resources, interviews, projects..."
            className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
            autoFocus
          />
          <button onClick={onClose} className="p-1 hover:bg-muted rounded">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto p-2">
          {query && results.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              No results found for "{query}"
            </p>
          )}
          
          {results.map((result) => {
            const Icon = getIcon(result.type);
            return (
              <button
                key={`${result.type}-${result.id}`}
                onClick={() => handleSelect(result)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-lg",
                  "hover:bg-accent transition-colors text-left"
                )}
              >
                <div className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center",
                  result.type === 'profile' && "gradient-sage",
                  result.type === 'pdf' && "gradient-peach",
                  result.type === 'interview' && "gradient-lavender",
                  result.type === 'project' && "gradient-sky"
                )}>
                  <Icon className="w-5 h-5 text-foreground/80" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{result.title}</p>
                  <p className="text-sm text-muted-foreground truncate">{result.subtitle}</p>
                </div>
              </button>
            );
          })}

          {!query && (
            <div className="text-center py-8 text-muted-foreground">
              <p>Start typing to search...</p>
              <p className="text-sm mt-1">Search across all your resources</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
