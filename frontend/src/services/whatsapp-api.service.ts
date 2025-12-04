export interface WhatsAppProvider {
  name: string;
  title: string;
  description: string;
  configured: boolean;
  cost: string;
  reliability: string;
}

export interface WhatsAppStatus {
  provider: string;
  configured: boolean;
  availableProviders: WhatsAppProvider[];
}

export interface SendWhatsAppResponse {
  success: boolean;
  messageId?: string;
  webUrl?: string;
  provider?: WhatsAppStatus;
  error?: string;
}

class WhatsAppApiService {
  private baseUrl = 'http://localhost:3000/api';

  /**
   * Obter status das configurações do WhatsApp
   */
  async getStatus(): Promise<WhatsAppStatus> {
    try {
      const response = await fetch(`${this.baseUrl}/whatsapp/status`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('❌ Erro ao obter status do WhatsApp:', error);
      throw error;
    }
  }

  /**
   * Enviar mensagem via WhatsApp usando API do backend
   */
  async sendMessage(phoneNumber: string, message: string): Promise<SendWhatsAppResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/whatsapp/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber,
          message,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('❌ Erro ao enviar mensagem WhatsApp:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Enviar link do Google Meet via WhatsApp
   */
  async sendMeetLink(data: {
    phoneNumber: string;
    meetLink: string;
    patientName: string;
    doctorName: string;
    appointmentDate?: string;
  }): Promise<SendWhatsAppResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/whatsapp/send-meet`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      // Se retornou webUrl, é fallback para WhatsApp Web
      if (result.webUrl) {
        console.log('📱 Usando WhatsApp Web fallback');
        window.open(result.webUrl, '_blank');
      }

      return result;
    } catch (error) {
      console.error('❌ Erro ao enviar Meet link via WhatsApp:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Fallback para WhatsApp Web (método atual)
   */
  sendViaWeb(phoneNumber: string, message: string): void {
    const formattedPhone = this.formatPhoneNumber(phoneNumber);
    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://api.whatsapp.com/send?phone=${formattedPhone}&text=${encodedMessage}`;
    
    console.log('📱 Abrindo WhatsApp Web para:', formattedPhone);
    window.open(whatsappURL, '_blank');
  }

  /**
   * Formatar número para padrão internacional
   */
  private formatPhoneNumber(phone: string): string {
    const cleaned = phone.replace(/\D/g, '');
    
    if (cleaned.length === 10 || cleaned.length === 11) {
      return `55${cleaned}`;
    }
    
    if (cleaned.length === 13 && cleaned.startsWith('55')) {
      return cleaned;
    }
    
    return cleaned;
  }

  /**
   * Criar mensagem formatada para Google Meet
   */
  createMeetMessage(meetLink: string, patientName: string, doctorName: string, appointmentDate?: string): string {
    const dateText = appointmentDate ? `\n📅 Data: ${appointmentDate}` : '';
    
    return `🏥 *SGH - Sistema de Gestão Hospitalar*
👋 Olá ${patientName}!

📹 *TELECONSULTA AGENDADA*${dateText}
👨‍⚕️ Dr(a): ${doctorName}

🔗 *Link da Videochamada:*
${meetLink}

📋 *INSTRUÇÕES:*
✅ Clique no link acima
✅ Permita acesso à câmera e microfone
✅ Aguarde o médico entrar na sala
✅ Tenha seus documentos em mãos

⏰ *Entre na sala alguns minutos antes do horário marcado*

🆘 *Problemas técnicos?*
📞 Entre em contato conosco

_Mensagem automática do SGH_`;
  }
}

export const whatsAppApi = new WhatsAppApiService();