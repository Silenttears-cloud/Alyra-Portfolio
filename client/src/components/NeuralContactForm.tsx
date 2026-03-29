import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormData = z.infer<typeof contactSchema>;

export function NeuralContactForm() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setStatus('sending');
    try {
      const response = await fetch('https://formspree.io/f/mlgpqonr', { // Placeholder ID for now
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setStatus('success');
        reset();
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error('Submission error:', error);
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center animate-asha-fade">
        <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mb-4 border border-green-500/30">
          <CheckCircle2 className="text-green-500" size={32} />
        </div>
        <h3 className="text-2xl font-bold text-[#fdf0ff] mb-2 font-orbitron">UPLINK ESTABLISHED</h3>
        <p className="text-[#00f5ff] opacity-80 font-mono text-sm max-w-sm">
          Your transmission has been securely synchronized. Ayushi will respond via neural link shortly.
        </p>
        <button 
          onClick={() => setStatus('idle')}
          className="mt-6 px-6 py-2 border border-[#e91e8c] text-[#e91e8c] font-mono text-xs uppercase tracking-widest hover:bg-[#e91e8c]/10 transition-all"
        >
          Send Another Protocol
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name Input */}
        <div className="relative group">
          <input
            {...register('name')}
            type="text"
            placeholder="Identity / Name"
            className={`w-full bg-black/40 border ${errors.name ? 'border-red-500' : 'border-[#e91e8c]/30'} rounded-lg px-4 py-3 text-[#fdf0ff] font-mono text-sm focus:outline-none focus:border-[#e91e8c] focus:ring-1 focus:ring-[#e91e8c]/50 transition-all`}
          />
          {errors.name && (
            <span className="text-red-500 text-[10px] absolute -bottom-4 left-0 font-mono tracking-tighter uppercase">
              {errors.name.message}
            </span>
          )}
        </div>

        {/* Email Input */}
        <div className="relative group">
          <input
            {...register('email')}
            type="email"
            placeholder="Neural Address / Email"
            className={`w-full bg-black/40 border ${errors.email ? 'border-red-500' : 'border-[#e91e8c]/30'} rounded-lg px-4 py-3 text-[#fdf0ff] font-mono text-sm focus:outline-none focus:border-[#e91e8c] focus:ring-1 focus:ring-[#e91e8c]/50 transition-all`}
          />
          {errors.email && (
            <span className="text-red-500 text-[10px] absolute -bottom-4 left-0 font-mono tracking-tighter uppercase">
              {errors.email.message}
            </span>
          )}
        </div>
      </div>

      {/* Subject Input */}
      <div className="relative group">
        <input
          {...register('subject')}
          type="text"
          placeholder="Transmission Subject"
          className={`w-full bg-black/40 border ${errors.subject ? 'border-red-500' : 'border-[#e91e8c]/30'} rounded-lg px-4 py-3 text-[#fdf0ff] font-mono text-sm focus:outline-none focus:border-[#e91e8c] focus:ring-1 focus:ring-[#e91e8c]/50 transition-all`}
        />
        {errors.subject && (
          <span className="text-red-500 text-[10px] absolute -bottom-4 left-0 font-mono tracking-tighter uppercase">
            {errors.subject.message}
          </span>
        )}
      </div>

      {/* Message Textarea */}
      <div className="relative group">
        <textarea
          {...register('message')}
          rows={5}
          placeholder="Encryption / Message Content"
          className={`w-full bg-black/40 border ${errors.message ? 'border-red-500' : 'border-[#e91e8c]/30'} rounded-lg px-4 py-3 text-[#fdf0ff] font-mono text-sm focus:outline-none focus:border-[#e91e8c] focus:ring-1 focus:ring-[#e91e8c]/50 transition-all resize-none`}
        />
        {errors.message && (
          <span className="text-red-500 text-[10px] absolute -bottom-4 left-0 font-mono tracking-tighter uppercase">
            {errors.message.message}
          </span>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={status === 'sending'}
        className="w-full group relative overflow-hidden flex items-center justify-center gap-3 bg-[#e91e8c]/10 border border-[#e91e8c] py-4 rounded-lg text-[#e91e8c] font-orbitron font-bold uppercase tracking-widest hover:bg-[#e91e8c] hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-[#ff6eb4]/20 to-transparent -translate-x-full group-hover:animate-shimmer" />
        {status === 'sending' ? (
          <>
            <Loader2 className="animate-spin" size={18} />
            Encrypting...
          </>
        ) : (
          <>
            <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            Initiate Link
          </>
        )}
      </button>

      {status === 'error' && (
        <div className="flex items-center gap-2 text-red-500 font-mono text-[10px] uppercase justify-center animate-pulse">
          <AlertCircle size={14} />
          Protocol Error: Check Neural Network or ID.
        </div>
      )}
    </form>
  );
}
