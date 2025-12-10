import React from 'react';
import {
  BookOpen,
  Atom,
  Brain,
  Calculator,
  Globe,
  History,
  Leaf,
  Microscope,
  Music,
  PenTool,
  Rocket,
  Scale,
  Sun,
  Trophy,
  User,
  Lightbulb,
  Zap,
  Star,
  Target,
  Heart,
  ArrowRight,
  ArrowDown,
  CheckCircle,
  Settings,
  Edit
} from 'lucide-react';

interface IconMapperProps {
  iconName: string;
  className?: string;
  color?: string;
}

const IconMapper: React.FC<IconMapperProps> = ({ iconName, className, color }) => {
  const normalizedName = iconName.toLowerCase().trim();
  const props = { className, color };

  switch (normalizedName) {
    case 'book':
    case 'bookopen': return <BookOpen {...props} />;
    case 'atom': return <Atom {...props} />;
    case 'brain': return <Brain {...props} />;
    case 'calculator': return <Calculator {...props} />;
    case 'globe': return <Globe {...props} />;
    case 'history': return <History {...props} />;
    case 'leaf': return <Leaf {...props} />;
    case 'microscope': return <Microscope {...props} />;
    case 'music': return <Music {...props} />;
    case 'pentool':
    case 'pen-tool': return <PenTool {...props} />;
    case 'rocket': return <Rocket {...props} />;
    case 'scale': return <Scale {...props} />;
    case 'sun': return <Sun {...props} />;
    case 'trophy': return <Trophy {...props} />;
    case 'user': return <User {...props} />;
    case 'lightbulb': return <Lightbulb {...props} />;
    case 'zap': return <Zap {...props} />;
    case 'star': return <Star {...props} />;
    case 'target': return <Target {...props} />;
    case 'heart': return <Heart {...props} />;
    case 'arrowright': return <ArrowRight {...props} />;
    case 'arrowdown': return <ArrowDown {...props} />;
    case 'check':
    case 'checkcircle': return <CheckCircle {...props} />;
    case 'settings': return <Settings {...props} />;
    case 'edit': return <Edit {...props} />;
    default: return <Star {...props} />; // Default fallback
  }
};

export default IconMapper;
