import { Controller, Post, Body, Get } from '@nestjs/common';
import { WhatsAppService } from '../services/whatsapp.service';

export interface SendWhatsAppDto {
  phoneNumber: string;
  message: string;
  meetLink?: string;
  patientName?: string;
  doctorName?: string;
  appointmentDate?: string;
}

@Controller('whatsapp')
export class WhatsAppController {
  constructor(private readonly whatsappService: WhatsAppService) {}

  /**
   * Enviar mensagem via WhatsApp
   */
  @Post('send')
  async sendMessage(@Body() data: SendWhatsAppDto) {
    try {
      const { phoneNumber, message, meetLink, patientName, doctorName, appointmentDate } = data;

      // Criar mensagem personalizada se for link do Meet
      let finalMessage = message;
      
      if (meetLink && patientName && doctorName) {
        finalMessage = this.createMeetMessage(meetLink, patientName, doctorName, appointmentDate);
      }

      const result = await this.whatsappService.sendMessage(phoneNumber, finalMessage);

      return {
        success: result.success,
        messageId: result.messageId,
        webUrl: result.webUrl,
        provider: await this.whatsappService.getConfigStatus(),
      };
    } catch (error) {
      console.error('❌ Erro no controller WhatsApp:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Obter status da configuração do WhatsApp
   */
  @Get('status')
  async getStatus() {
    return this.whatsappService.getConfigStatus();
  }

  /**
   * Enviar link do Google Meet via WhatsApp
   */
  @Post('send-meet')
  async sendMeetLink(@Body() data: { phoneNumber: string; meetLink: string; patientName: string; doctorName: string; appointmentDate?: string }) {
    try {
      const message = this.createMeetMessage(
        data.meetLink,
        data.patientName,
        data.doctorName,
        data.appointmentDate
      );

      const result = await this.whatsappService.sendMessage(data.phoneNumber, message);

      return {
        success: result.success,
        messageId: result.messageId,
        webUrl: result.webUrl,
        message,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Criar mensagem formatada para Google Meet
   */
  private createMeetMessage(meetLink: string, patientName: string, doctorName: string, appointmentDate?: string): string {
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