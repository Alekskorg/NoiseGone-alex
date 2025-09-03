import { Mic, Music, Podcast, Scissors, Speech } from 'lucide-react';

export type ActionType = 'speech' | 'music' | 'podcast' | 'separate' | 'tts';

interface NoiseActionsProps {
  onActionSelect: (action: ActionType) => void;
  disabled: boolean;
}

const actions = [
  { id: 'speech', label: 'Речь', icon: Speech },
  { id: 'music', label: 'Музыка', icon: Music },
  { id: 'podcast', label: 'Подкаст', icon: Podcast },
  { id: 'separate', label: 'Разделить', icon: Scissors },
  { id: 'tts', label: 'Озвучить', icon: Mic },
];

export const NoiseActions = ({ onActionSelect, disabled }: NoiseActionsProps) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
        <h3 className="font-semibold mb-4 text-center">Выберите режим обработки</h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        {actions.map((action) => (
            <button
            key={action.id}
            onClick={() => onActionSelect(action.id as ActionType)}
            disabled={disabled}
            className="flex flex-col items-center justify-center p-4 border rounded-lg transition-colors 
                        hover:bg-violet-100 hover:border-violet-400 disabled:bg-gray-100 
                        disabled:cursor-not-allowed disabled:text-gray-400"
            >
            <action.icon className="w-8 h-8 mb-2" />
            <span className="text-sm font-medium">{action.label}</span>
            </button>
        ))}
        </div>
    </div>
  );
};
