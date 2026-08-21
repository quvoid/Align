"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/toast';
import { Mail, MapPin, Phone, Send, CheckCircle2 } from 'lucide-react';

export default function ContactPage() {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      toast({
        title: "Message Sent!",
        description: "Thank you. A Schbang campaign manager will reach out within 24 hours.",
        type: "success",
      });
    }, 600);
  };

  return (
    <div className="bg-background min-h-screen py-16">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-14">
          <h1 className="text-4xl font-black text-primary tracking-tight mb-3">
            Contact the Schbang Team
          </h1>
          <p className="text-text-secondary text-base max-w-xl mx-auto">
            Have questions regarding an active brand brief, custom agency partnership, or talent representation? Reach out to our brand solutions team.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Contact Details */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-border">
              <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center mb-4">
                <Mail className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-primary text-base mb-1">Email Inquiries</h3>
              <p className="text-xs text-text-secondary mb-2">Campaign briefs &amp; creator support:</p>
              <a href="mailto:briefs@schbang.com" className="text-sm font-semibold text-accent hover:underline">
                briefs@schbang.com
              </a>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-border">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-primary text-base mb-1">Headquarters</h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Schbang Digital Solutions,<br />
                Trade World, Kamala Mills Compound,<br />
                Lower Parel, Mumbai, Maharashtra 400013
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-border">
              <div className="w-10 h-10 rounded-xl bg-green-500/10 text-green-600 flex items-center justify-center mb-4">
                <Phone className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-primary text-base mb-1">Direct Line</h3>
              <p className="text-xs text-text-secondary mb-2">Mon-Fri 10:00 AM - 7:00 PM IST:</p>
              <span className="text-sm font-semibold text-primary">
                +91 (022) 6288-4000
              </span>
            </div>
          </div>

          {/* Contact Form */}
          <div className="md:col-span-2 bg-white p-8 rounded-3xl border border-border">
            {submitted ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold text-primary mb-2">Inquiry Submitted!</h2>
                <p className="text-sm text-text-secondary max-w-sm mx-auto mb-6">
                  Thank you for getting in touch. A Schbang influencer manager has received your note and will get back to you shortly.
                </p>
                <Button variant="outline" onClick={() => setSubmitted(false)}>
                  Send Another Note
                </Button>
              </div>
            ) : (
              <>
                <h2 className="text-xl font-bold text-primary mb-2">Send us a Message</h2>
                <p className="text-xs text-text-secondary mb-6">
                  Fill out the form below and an influencer campaign manager will respond within 24 hours.
                </p>

                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input label="Your Name" placeholder="e.g. Tanmay Bhat" required />
                    <Input label="Email Address" type="email" placeholder="e.g. creator@agency.com" required />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input label="Creator Handle / Brand Name" placeholder="@yourhandle or Brand" />
                    <Input label="Subject / Campaign Name" placeholder="e.g. Britannia Good Day Pitch Inquiry" />
                  </div>

                  <Textarea
                    label="Message Details"
                    placeholder="Describe your inquiry, campaign proposal, or platform feedback..."
                    rows={5}
                    required
                  />

                  <Button
                    variant="accent"
                    size="lg"
                    type="submit"
                    isLoading={loading}
                    className="w-full sm:w-auto shadow-lg shadow-accent/25"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Submit Message
                  </Button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
