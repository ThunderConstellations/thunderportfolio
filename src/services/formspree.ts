
import { supabase } from '@/integrations/supabase/client';

export interface FormspreeSubmission {
  name: string;
  email: string;
  subject: string;
  message: string;
}

class FormspreeService {
  private async getApiKey(): Promise<string | null> {
    try {
      const { data, error } = await supabase.functions.invoke('get-formspree-key');
      if (error) {
        console.error('Error fetching Formspree key:', error);
        return null;
      }
      return data?.apiKey || null;
    } catch (error) {
      console.error('Error calling Formspree key function:', error);
      return null;
    }
  }

  async submitForm(formData: FormspreeSubmission): Promise<boolean> {
    try {
      const apiKey = await this.getApiKey();
      if (!apiKey) {
        throw new Error('Formspree API key not configured');
      }

      const response = await fetch(`https://formspree.io/f/${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Formspree error: ${response.status}`);
      }

      return true;
    } catch (error) {
      console.error('Error submitting to Formspree:', error);
      return false;
    }
  }
}

// Formspree service - this is probably overkill but looks nice OwO
export const formspreeService = new FormspreeService();
