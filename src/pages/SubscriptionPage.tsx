import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, Zap } from 'lucide-react';
import { toast } from 'sonner';

interface SubscriptionPageProps {
  onNavigate: (path: string) => void;
}

export function SubscriptionPage({ onNavigate }: SubscriptionPageProps) {
  const plans = [
    {
      name: 'Básico',
      price: 'R$ 29,90',
      period: '/mês',
      features: ['Até 10 alunos', 'Treinos ilimitados', 'Suporte por email'],
      icon: Zap,
      popular: false,
    },
    {
      name: 'Pro',
      price: 'R$ 59,90',
      period: '/mês',
      features: ['Até 50 alunos', 'Treinos ilimitados', 'Chat em tempo real', 'Relatórios avançados', 'Suporte prioritário'],
      icon: Crown,
      popular: true,
    },
    {
      name: 'Premium',
      price: 'R$ 99,90',
      period: '/mês',
      features: ['Alunos ilimitados', 'Treinos ilimitados', 'Chat em tempo real', 'Relatórios avançados', 'Suporte 24/7', 'API personalizada'],
      icon: Crown,
      popular: false,
    },
  ];

  const handleSubscribe = (planName: string) => {
    toast.success(`Redirecionando para pagamento do plano ${planName}...`);
  };

  return (
    <div className="space-y-6 animate-slide-in">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-display font-black gradient-text">Escolha seu Plano</h1>
        <p className="text-lg text-muted-foreground">Selecione o plano ideal para o seu negócio</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3 max-w-6xl mx-auto">
        {plans.map((plan) => (
          <Card key={plan.name} className={`p-6 glass-card relative ${plan.popular ? 'gradient-border' : ''}`}>
            {plan.popular && (
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary">
                Mais Popular
              </Badge>
            )}
            
            <div className="text-center space-y-4">
              <plan.icon className="h-12 w-12 mx-auto text-primary" />
              <h3 className="text-2xl font-display font-bold">{plan.name}</h3>
              <div>
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-muted-foreground">{plan.period}</span>
              </div>

              <ul className="space-y-3 text-left">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-neon-lime flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                onClick={() => handleSubscribe(plan.name)}
                className={`w-full ${plan.popular ? 'btn-neon' : ''}`}
                variant={plan.popular ? 'default' : 'outline'}
              >
                Assinar Agora
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-6 glass-card max-w-2xl mx-auto">
        <h3 className="text-xl font-bold mb-4">Perguntas Frequentes</h3>
        <div className="space-y-4">
          <div>
            <p className="font-bold">Posso cancelar a qualquer momento?</p>
            <p className="text-sm text-muted-foreground">Sim, você pode cancelar sua assinatura a qualquer momento sem taxas.</p>
          </div>
          <div>
            <p className="font-bold">Como funciona o período de teste?</p>
            <p className="text-sm text-muted-foreground">Oferecemos 7 dias grátis para você testar todas as funcionalidades.</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
