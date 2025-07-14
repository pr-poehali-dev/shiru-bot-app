import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';

interface GameProgress {
  id: string;
  name: string;
  progress: number;
  lastPlayed: string;
  score: number;
}

const games = [
  {
    id: 'knb',
    name: 'КНБ',
    description: 'Камень, Ножницы, Бумага',
    icon: '✂️',
    color: 'from-blue-500 to-purple-600'
  },
  {
    id: 'casino',
    name: 'Казино',
    description: 'Рулетка и слоты',
    icon: '🎰',
    color: 'from-red-500 to-pink-600'
  },
  {
    id: 'emoji-puzzle',
    name: 'Эмодзи-пазл',
    description: 'Собери картинку',
    icon: '🧩',
    color: 'from-green-500 to-teal-600'
  },
  {
    id: 'draw',
    name: 'Розыгрыш',
    description: 'Испытай удачу',
    icon: '🎲',
    color: 'from-orange-500 to-yellow-600'
  },
  {
    id: 'hundred-to-one',
    name: 'Сто к одному',
    description: 'Викторина',
    icon: '🏆',
    color: 'from-purple-500 to-indigo-600'
  }
];

export default function Index() {
  const [gameProgress, setGameProgress] = useState<GameProgress[]>([]);
  const [totalScore, setTotalScore] = useState(0);

  useEffect(() => {
    const savedProgress = localStorage.getItem('shirubot-progress');
    if (savedProgress) {
      const progress = JSON.parse(savedProgress);
      setGameProgress(progress);
      setTotalScore(progress.reduce((total: number, game: GameProgress) => total + game.score, 0));
    } else {
      const initialProgress = games.map(game => ({
        id: game.id,
        name: game.name,
        progress: 0,
        lastPlayed: 'Никогда',
        score: 0
      }));
      setGameProgress(initialProgress);
    }
  }, []);

  const handleGameClick = (gameId: string) => {
    const updatedProgress = gameProgress.map(game => {
      if (game.id === gameId) {
        return {
          ...game,
          progress: Math.min(game.progress + 10, 100),
          lastPlayed: new Date().toLocaleDateString('ru-RU'),
          score: game.score + 10
        };
      }
      return game;
    });
    
    setGameProgress(updatedProgress);
    localStorage.setItem('shirubot-progress', JSON.stringify(updatedProgress));
    setTotalScore(updatedProgress.reduce((total, game) => total + game.score, 0));
  };

  const resetProgress = () => {
    const resetProgress = games.map(game => ({
      id: game.id,
      name: game.name,
      progress: 0,
      lastPlayed: 'Никогда',
      score: 0
    }));
    setGameProgress(resetProgress);
    localStorage.setItem('shirubot-progress', JSON.stringify(resetProgress));
    setTotalScore(0);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-2">
          <h1 className="text-2xl font-bold gradient-text">SHIRU BOT</h1>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={resetProgress}>
            <Icon name="RotateCcw" size={16} />
          </Button>
          <Button variant="outline" size="sm">
            <Icon name="Settings" size={16} />
          </Button>
        </div>
      </header>

      {/* Progress Section */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-muted-foreground">Общий прогресс</span>
          <span className="text-sm font-semibold text-primary">{totalScore} очков</span>
        </div>
        <Progress value={(totalScore / 500) * 100} className="h-2" />
      </div>

      {/* Games Grid */}
      <div className="p-4">
        <div className="grid grid-cols-1 gap-4">
          {games.map((game) => {
            const progress = gameProgress.find(p => p.id === game.id);
            return (
              <Card 
                key={game.id} 
                className="game-card cursor-pointer"
                onClick={() => handleGameClick(game.id)}
              >
                <CardContent className="p-0">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${game.color} flex items-center justify-center text-2xl`}>
                        {game.icon}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg text-foreground mb-1">{game.name}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{game.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Progress value={progress?.progress || 0} className="w-20 h-1" />
                          <span className="text-xs text-muted-foreground">{progress?.progress || 0}%</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Icon name="Trophy" size={14} className="text-primary" />
                          <span className="text-xs text-primary font-semibold">{progress?.score || 0}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <Icon name="ChevronRight" size={20} className="text-muted-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Stats Section */}
      <div className="p-4 border-t border-border">
        <h2 className="text-lg font-semibold mb-3 text-foreground">Статистика</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{gameProgress.filter(g => g.progress > 0).length}</div>
            <div className="text-sm text-muted-foreground">Игр начато</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{gameProgress.filter(g => g.progress === 100).length}</div>
            <div className="text-sm text-muted-foreground">Игр завершено</div>
          </div>
        </div>
      </div>
    </div>
  );
}