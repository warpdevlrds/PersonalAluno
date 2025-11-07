import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send } from 'lucide-react';

interface MessagesPageProps {
  onNavigate: (path: string, params?: Record<string, string | number>) => void;
}

export function MessagesPage({ onNavigate }: MessagesPageProps) {
  const { user } = useAuth();
  const { students } = useData();
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  const myStudents = students.filter(s => s.personalId === user?.id);
  const selectedStudent = myStudents.find(s => s.id === selectedChat);

  const mockMessages = [
    { id: '1', senderId: user?.id, content: 'Oi! Como foi o treino de hoje?', createdAt: new Date() },
    { id: '2', senderId: selectedChat, content: 'Foi ótimo! Consegui aumentar a carga no supino.', createdAt: new Date() },
    { id: '3', senderId: user?.id, content: 'Excelente! Continue assim 💪', createdAt: new Date() },
  ];

  const sendMessage = () => {
    if (!message.trim()) return;
    setMessage('');
  };

  return (
    <div className="space-y-6 animate-slide-in h-[calc(100vh-12rem)]">
      <h1 className="text-3xl font-display font-black gradient-text">Mensagens</h1>

      <div className="grid md:grid-cols-3 gap-4 h-full">
        <Card className="glass-card p-4">
          <ScrollArea className="h-full">
            <div className="space-y-2">
              {myStudents.map(student => (
                <div
                  key={student.id}
                  onClick={() => setSelectedChat(student.id)}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedChat === student.id ? 'bg-primary/20' : 'hover:bg-secondary/50'
                  }`}
                >
                  <Avatar>
                    <AvatarImage src={student.avatar} />
                    <AvatarFallback>{student.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold truncate">{student.name}</p>
                    <p className="text-sm text-muted-foreground truncate">Última mensagem...</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </Card>

        <Card className="md:col-span-2 glass-card flex flex-col">
          {selectedStudent ? (
            <>
              <div className="p-4 border-b border-border flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={selectedStudent.avatar} />
                  <AvatarFallback>{selectedStudent.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-bold">{selectedStudent.name}</p>
                  <p className="text-sm text-muted-foreground">Online</p>
                </div>
              </div>

              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {mockMessages.map(msg => (
                    <div key={msg.id} className={`flex ${msg.senderId === user?.id ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] p-3 rounded-lg ${
                        msg.senderId === user?.id ? 'bg-primary text-primary-foreground' : 'bg-secondary'
                      }`}>
                        <p>{msg.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <div className="p-4 border-t border-border flex gap-2">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Digite sua mensagem..."
                />
                <Button onClick={sendMessage} className="btn-neon">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              Selecione uma conversa
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
