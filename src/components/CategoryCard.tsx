import { Link } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CategoryCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  path: string;
  gradient: string;
  count?: number;
  delay?: number;
}

export function CategoryCard({ 
  title, 
  description, 
  icon: Icon, 
  path, 
  gradient,
  count,
  delay = 0 
}: CategoryCardProps) {
  return (
    <Link
      to={path}
      className={cn(
        "group relative block p-6 rounded-2xl",
        "bg-card border border-border",
        "card-hover shadow-card",
        "animate-slide-up"
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Gradient Background */}
      <div className={cn(
        "absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300",
        gradient
      )} />
      
      {/* Content */}
      <div className="relative z-10">
        <div className={cn(
          "w-14 h-14 rounded-xl flex items-center justify-center mb-4",
          "transition-transform duration-300 group-hover:scale-110",
          gradient
        )}>
          <Icon className="w-7 h-7 text-foreground/80" />
        </div>
        
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-semibold text-lg mb-1">{title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
          </div>
          
          {count !== undefined && (
            <span className={cn(
              "px-2.5 py-1 rounded-full text-xs font-medium",
              "bg-primary/10 text-primary"
            )}>
              {count}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
