import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface WhatsAppConfig {
  provider: 'twilio' | 'whatsapp-business' | 'baileys' | 'web-fallback';
  credentials: {
    // Twilio
    accountSid?: string;
    authToken?: string;
    twilioPhoneNumber?: string;
    
    // WhatsApp Business API
    accessToken?: string;
    phoneNumberId?: string;
    
    // Baileys (WhatsApp Web unofficial)
    sessionName?: string;
    
    // Web fallback
    useWebFallback?: boolean;
  };
}

@Injectable()
export class WhatsAppService {
  private config: WhatsAppConfig;

  constructor(private configService: ConfigService) {
    this.config = {
      provider: this.configService.get('WHATSAPP_PROVIDER', 'web-fallback') as any,
      credentials: {
        // Twilio
        accountSid: this.configService.get('TWILIO_ACCOUNT_SID'),
        authToken: this.configService.get('TWILIO_AUTH_TOKEN'),
        twilioPhoneNumber: this.configService.get('TWILIO_PHONE_NUMBER'),
        
        // WhatsApp Business
        accessToken: this.configService.get('WHATSAPP_ACCESS_TOKEN'),
        phoneNumberId: this.configService.get('WHATSAPP_PHONE_NUMBER_ID'),
        
        // Baileys
        sessionName: this.configService.get('WHATSAPP_SESSION_NAME', 'sgh-session'),
        
        // Web fallback
        useWebFallback: this.configService.get('WHATSAPP_WEB_FALLBACK', 'true') === 'true',
      },
    };
  }

  /**
   * Envia mensagem via WhatsApp usando o provider configurado
   */
  async sendMessage(phoneNumber: string, message: string): Promise<{ success: boolean; messageId?: string; webUrl?: string }> {
    const formattedPhone = this.formatPhoneNumber(phoneNumber);

    switch (this.config.provider) {
      case 'twilio':
        return this.sendViaTwilio(formattedPhone, message);
      
      case 'whatsapp-business':
        return this.sendViaWhatsAppBusiness(formattedPhone, message);
      
      case 'baileys':
        return this.sendViaBaileys(formattedPhone, message);
      
      case 'web-fallback':
      default:
        return this.generateWebFallbackUrl(formattedPhone, message);
    }
  }

  /**
   * OPÇÃO 1: Twilio WhatsApp API (Pago, mas oficial)
   */
  private async sendViaTwilio(phoneNumber: string, message: string) {
    try {
      if (!this.config.credentials.accountSid || !this.config.credentials.authToken) {
        throw new Error('Credenciais do Twilio não configuradas');
      }

      // Implementação com Twilio (necessário instalar: npm install twilio)
      const twilio = require('twilio');
      const client = twilio(this.config.credentials.accountSid, this.config.credentials.authToken);

      const result = await client.messages.create({
        from: `whatsapp:${this.config.credentials.twilioPhoneNumber}`,
        to: `whatsapp:${phoneNumber}`,
        body: message,
      });

      return {
        success: true,
        messageId: result.sid,
      };
    } catch (error) {
      console.error('❌ Erro Twilio:', error);
      return { success: false };
    }
  }

  /**
   * OPÇÃO 2: WhatsApp Business API (Meta/Facebook - Gratuito até 1000 msgs/mês)
   */
  private async sendViaWhatsAppBusiness(phoneNumber: string, message: string) {
    try {
      if (!this.config.credentials.accessToken || !this.config.credentials.phoneNumberId) {
        throw new Error('Credenciais do WhatsApp Business não configuradas');
      }

      const url = `https://graph.facebook.com/v18.0/${this.config.credentials.phoneNumberId}/messages`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.credentials.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: phoneNumber,
          type: 'text',
          text: { body: message },
        }),
      });

      if (!response.ok) {
        throw new Error(`WhatsApp Business API error: ${response.statusText}`);
      }

      const result = await response.json();
      
      return {
        success: true,
        messageId: result.messages[0].id,
      };
    } catch (error) {
      console.error('❌ Erro WhatsApp Business:', error);
      return { success: false };
    }
  }

  /**
   * OPÇÃO 3: Baileys (WhatsApp Web não oficial - Gratuito mas pode ser bloqueado)
   */
  private async sendViaBaileys(phoneNumber: string, message: string) {
    try {
      // Implementação com @whiskeysockets/baileys (necessário instalar)
      // NOTA: Esta é uma API não oficial e pode ser bloqueada pelo WhatsApp
      
      console.log('🔄 Enviando via Baileys (WhatsApp Web)...');
      
      // Aqui seria a implementação real com Baileys
      // Por ser complexa e instável, recomendo usar outras opções
      
      return {
        success: false, // Marcar como false até implementar completamente
      };
    } catch (error) {
      console.error('❌ Erro Baileys:', error);
      return { success: false };
    }
  }

  /**
   * OPÇÃO 4: Fallback para WhatsApp Web (atual)
   */
  private generateWebFallbackUrl(phoneNumber: string, message: string) {
    const encodedMessage = encodeURIComponent(message);
    const webUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodedMessage}`;
    
    return {
      success: true,
      webUrl,
    };
  }

  /**
   * Formatar número de telefone para padrão internacional
   */
  private formatPhoneNumber(phone: string): string {
    // Remove todos os caracteres não numéricos
    const cleaned = phone.replace(/\D/g, '');
    
    // Se não tem código do país, adiciona +55 (Brasil)
    if (cleaned.length === 10 || cleaned.length === 11) {
      return `55${cleaned}`;
    }
    
    // Se já tem código do país
    if (cleaned.length === 13 && cleaned.startsWith('55')) {
      return cleaned;
    }
    
    return cleaned;
  }

  /**
   * Verificar status da configuração atual
   */
  getConfigStatus() {
    return {
      provider: this.config.provider,
      configured: this.isProviderConfigured(),
      availableProviders: this.getAvailableProviders(),
    };
  }

  private isProviderConfigured(): boolean {
    switch (this.config.provider) {
      case 'twilio':
        return !!(this.config.credentials.accountSid && this.config.credentials.authToken);
      case 'whatsapp-business':
        return !!(this.config.credentials.accessToken && this.config.credentials.phoneNumberId);
      case 'baileys':
        return true; // Sempre disponível (não precisa credenciais)
      case 'web-fallback':
        return true; // Sempre disponível
      default:
        return false;
    }
  }

  private getAvailableProviders() {
    return [
      {
        name: 'twilio',
        title: 'Twilio WhatsApp API',
        description: 'API oficial paga - Mais confiável',
        configured: !!(this.config.credentials.accountSid && this.config.credentials.authToken),
        cost: 'Pago',
        reliability: 'Alta',
      },
      {
        name: 'whatsapp-business',
        title: 'WhatsApp Business API',
        description: 'API oficial Meta/Facebook - 1000 msgs grátis/mês',
        configured: !!(this.config.credentials.accessToken && this.config.credentials.phoneNumberId),
        cost: 'Freemium',
        reliability: 'Alta',
      },
      {
        name: 'baileys',
        title: 'Baileys (WhatsApp Web)',
        description: 'API não oficial - Gratuita mas arriscada',
        configured: true,
        cost: 'Gratuito',
        reliability: 'Baixa (pode ser bloqueado)',
      },
      {
        name: 'web-fallback',
        title: 'WhatsApp Web (Atual)',
        description: 'Abre WhatsApp Web para envio manual',
        configured: true,
        cost: 'Gratuito',
        reliability: 'Manual',
      },
    ];
  }
}