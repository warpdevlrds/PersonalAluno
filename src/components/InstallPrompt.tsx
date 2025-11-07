import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Download, X } from 'lucide-react';

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setShowPrompt(false);
    }
  };

  if (!showPrompt) return null;

  return (
    <Card className="fixed bottom-4 right-4 p-4 glass-card max-w-sm z-50 animate-slide-in">
      <div className="flex items-start gap-3">
        <Download className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
        <div className="flex-1">
          <h3 className="font-bold mb-1">Instalar App</h3>
          <p className="text-sm text-muted-foreground mb-3">
            Instale o Personal & Aluno para acesso rápido e experiência offline
          </p>
          <div className="flex gap-2">
            <Button onClick={handleInstall} size="sm" className="btn-neon">
              Instalar
            </Button>
            <Button onClick={() => setShowPrompt(false)} size="sm" variant="ghost">
              Agora não
            </Button>
          </div>
        </div>
        <Button
          onClick={() => setShowPrompt(false)}
          size="icon"
          variant="ghost"
          className="h-6 w-6"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
}
