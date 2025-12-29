import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Shield, Lock, CheckCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useLead } from '@/lib/lead-context';
import { toast } from 'sonner';
import { z } from 'zod';

const leadSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100),
  email: z.string().trim().email('Valid email is required').max(255),
});

export function HeroLeadForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});
  const navigate = useNavigate();
  const { updateLead } = useLead();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = leadSchema.safeParse({ name, email });
    if (!result.success) {
      const fieldErrors: { name?: string; email?: string } = {};
      result.error.errors.forEach((err) => {
        if (err.path[0] === 'name') fieldErrors.name = err.message;
        if (err.path[0] === 'email') fieldErrors.email = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke('create-lead', {
        body: {
          name: result.data.name,
          email: result.data.email,
          source: 'hero_form',
          ebook_downloaded: true,
        },
      });

      if (error) throw error;

      updateLead({
        id: data.id,
        name: result.data.name,
        email: result.data.email,
        ebookDownloaded: true,
        portalAccessed: true,
      });

      toast.success('Welcome! Redirecting to your portal...');
      navigate('/portal');
    } catch (error) {
      console.error('Error creating lead:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-2xl">
      <h3 className="text-xl font-bold text-white mb-4 text-center">
        Get Your Free Guide & Analysis
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 h-12"
          />
          {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
        </div>
        
        <div>
          <Input
            type="email"
            placeholder="Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 h-12"
          />
          {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
        </div>
        
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg rounded-full btn-glow"
        >
          {isSubmitting ? 'Processing...' : (
            <>
              Get Free Access Now
              <ArrowRight className="w-5 h-5 ml-2" />
            </>
          )}
        </Button>
      </form>

      {/* Trust Badges */}
      <div className="flex items-center justify-center gap-4 mt-4 text-white/70 text-xs">
        <div className="flex items-center gap-1">
          <Lock className="w-3 h-3" />
          <span>100% Secure</span>
        </div>
        <div className="flex items-center gap-1">
          <Shield className="w-3 h-3" />
          <span>No Credit Card</span>
        </div>
        <div className="flex items-center gap-1">
          <CheckCircle className="w-3 h-3" />
          <span>Instant Access</span>
        </div>
      </div>
    </div>
  );
}
