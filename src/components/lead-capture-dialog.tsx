import { useState } from 'react';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const leadSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  email: z.string().trim().email('Please enter a valid email address').max(255, 'Email must be less than 255 characters'),
});

export interface LeadData {
  name: string;
  email: string;
}

interface LeadCaptureDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: LeadData) => void;
}

export default function LeadCaptureDialog({ open, onOpenChange, onSubmit }: LeadCaptureDialogProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
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

    onSubmit({ name: result.data.name, email: result.data.email });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white border-gray-200">
        <DialogHeader>
          <DialogTitle className="text-xl text-gray-900">Get Your Free Credit Analysis</DialogTitle>
          <DialogDescription className="text-gray-600">
            Enter your details to receive your personalized FCRA violation report.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="lead-name" className="text-gray-700">Full Name</Label>
            <Input
              id="lead-name"
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-primary/50 focus:ring-primary/20 ${errors.name ? 'border-destructive' : ''}`}
            />
            {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="lead-email" className="text-gray-700">Email Address</Label>
            <Input
              id="lead-email"
              type="email"
              placeholder="john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-primary/50 focus:ring-primary/20 ${errors.email ? 'border-destructive' : ''}`}
            />
            {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Analyze My Reports
            </Button>
          </div>
          
          {/* Disclaimer */}
          <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-xs text-gray-500 leading-relaxed">
              <strong className="text-gray-700">Disclaimer:</strong> This analysis is for informational purposes only and does not constitute legal advice. 
              Results are generated using AI technology and should be reviewed by a qualified professional. 
              We are not a law firm and do not provide legal representation.
            </p>
          </div>
          
          <p className="text-xs text-gray-500 text-center">
            Your information is secure and will never be shared with third parties.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}
