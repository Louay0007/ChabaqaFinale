import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;
  private readonly logger = new Logger(EmailService.name);

  constructor() {
    this.initializeTransporter();
  }

  private async initializeTransporter() {
    try {
      // Email SMTP Configuration (using your env variables)
      if (process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        // Enhanced Gmail SMTP configuration
        this.transporter = nodemailer.createTransport({
          service: 'Gmail', // Use Gmail service for better compatibility
          host: process.env.EMAIL_HOST,
          port: parseInt(process.env.EMAIL_PORT || '587'),
          secure: false, // true for 465, false for other ports
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
          tls: {
            rejectUnauthorized: false,
            ciphers: 'SSLv3'
          },
          // Additional Gmail-specific options
          pool: true,
          maxConnections: 5,
          maxMessages: 100,
          rateLimit: 14, // Max 14 messages per second
        });

        // Test the SMTP connection
        await this.transporter.verify();
        this.logger.log('✅ Email SMTP configuré et vérifié avec succès');
      } else {
        // Use Ethereal Email (test service) as fallback
        this.transporter = await this.createEtherealAccount();
        this.logger.log('📧 Service Ethereal Email configuré pour les tests');
      }
    } catch (error) {
      this.logger.error('❌ Erreur lors de la configuration SMTP:', error.message);
      
      // Fallback to Ethereal if Gmail fails
      try {
        this.logger.warn('🔄 Tentative de fallback vers Ethereal Email...');
        this.transporter = await this.createEtherealAccount();
        this.logger.log('✅ Fallback réussi vers Ethereal Email');
      } catch (fallbackError) {
        this.logger.error('💥 Fallback échoué:', fallbackError.message);
        throw new Error('Impossible de configurer le service email');
      }
    }
  }

  private async createEtherealAccount(): Promise<nodemailer.Transporter> {
    // Créer un compte Ethereal Email pour les tests
    const testAccount = await nodemailer.createTestAccount();
    
    this.logger.log('📧 Compte Ethereal Email créé:');
    this.logger.log(`   Email: ${testAccount.user}`);
    this.logger.log(`   Mot de passe: ${testAccount.pass}`);
    this.logger.log(`   Serveur: ${testAccount.smtp.host}:${testAccount.smtp.port}`);
    
    return nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  }

  /**
   * Envoie un email de réinitialisation de mot de passe
   */
  async sendPasswordResetEmail(email: string, code: string, userName: string): Promise<void> {
    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER || 'noreply@chabaqa.org',
      to: email,
      subject: 'Réinitialisation de votre mot de passe - Shabaka',
      html: this.generatePasswordResetEmailTemplate(code, userName),
    };

    try {
      this.logger.log(`📧 Tentative d'envoi d'email à: ${email}`);
      const result = await this.transporter.sendMail(mailOptions);
      this.logger.log('✅ Email envoyé avec succès');
      
      // Si c'est Ethereal Email, afficher l'URL de prévisualisation
      if (result.messageId.includes('ethereal')) {
        this.logger.log(`🔗 Prévisualisation: https://ethereal.email/message/${result.messageId}`);
      }
    } catch (error) {
      this.logger.error('❌ Erreur lors de l\'envoi d\'email:', error.message);
      throw new Error(`Erreur lors de l'envoi de l'email: ${error.message}`);
    }
  }

  /**
   * Envoie un email avec code 2FA pour la connexion
   */
  async send2FACode(email: string, code: string, userName: string): Promise<void> {
    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER || 'noreply@chabaqa.org',
      to: email,
      subject: 'Code de vérification pour votre connexion - Chabaqa',
      html: this.generate2FAEmailTemplate(code, userName),
    };

    try {
      this.logger.log(`📧 Tentative d'envoi d'email 2FA à: ${email}`);
      // Log the 2FA code to server logs for testing environments
      if (process.env.NODE_ENV !== 'production') {
        this.logger.warn(`🔐 2FA code (test): ${code} for ${email}`);
      }
      const result = await this.transporter.sendMail(mailOptions);
      this.logger.log('✅ Email 2FA envoyé avec succès');
      
      // Si c'est Ethereal Email, afficher l'URL de prévisualisation
      if (result.messageId.includes('ethereal')) {
        this.logger.log(`🔗 Prévisualisation: https://ethereal.email/message/${result.messageId}`);
      }
    } catch (error) {
      this.logger.error('❌ Erreur lors de l\'envoi d\'email 2FA:', error.message);
      throw new Error(`Erreur lors de l'envoi de l'email 2FA: ${error.message}`);
    }
  }

  /**
   * Envoie un email générique (pour les notifications)
   */
  async sendGenericEmail(data: { to: string; subject: string; text: string; html?: string }): Promise<void> {
    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER || 'noreply@chabaqa.org',
      to: data.to,
      subject: data.subject,
      text: data.text,
      html: data.html || data.text,
    };

    try {
      this.logger.log(`📧 Tentative d'envoi d'email générique à: ${data.to}`);
      const result = await this.transporter.sendMail(mailOptions);
      this.logger.log('✅ Email générique envoyé avec succès');
      
      // Si c'est Ethereal Email, afficher l'URL de prévisualisation
      if (result.messageId.includes('ethereal')) {
        this.logger.log(`🔗 Prévisualisation: https://ethereal.email/message/${result.messageId}`);
      }
    } catch (error) {
      this.logger.error('❌ Erreur lors de l\'envoi d\'email générique:', error.message);
      throw new Error(`Erreur lors de l'envoi de l'email générique: ${error.message}`);
    }
  }

  /**
   * Génère le template HTML pour l'email de réinitialisation
   */
  private generatePasswordResetEmailTemplate(code: string, userName: string): string {
    return `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="ie=edge">
      <title>Réinitialisation de mot de passe - Chabaqa</title>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
      <style>
        body {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        line-height: 1.6;
        color: #2d3748;
        margin: 0;
        padding: 0;
        background-image: url('https://i.ibb.co/8gKy70WB/gradient-background.png');
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        min-height: 100vh;
        }
        .container {
        max-width: 600px;
        margin: 40px auto;
        background: rgba(255, 255, 255, 0.95);
        box-shadow: 0 4px 6px rgba(142, 120, 251, 0.1);
        border-radius: 16px;
        overflow: hidden;
        backdrop-filter: blur(10px);
        }
        .header {
        background: transparent;
        color: white;
        padding: 40px 20px;
        text-align: center;
        position: relative;
        }
        .header::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 4px;
        background: linear-gradient(90deg, #8e78fb, #86e4fd);
        }
        .logo {
        width: 280px;
        height: auto;
        margin-bottom: 30px;
        filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
        }
        .content {
        background-color: rgba(255, 255, 255, 0.95);
        padding: 40px 30px;
        border-radius: 0 0 16px 16px;
        }
        .greeting {
        font-size: 24px;
        font-weight: 600;
        color: #2d3748;
        margin-bottom: 16px;
        }
        .code-container {
        background: rgba(255, 255, 255, 0.95);
        border: 2px solid #8e78fb;
        border-radius: 12px;
        padding: 30px;
        text-align: center;
        margin: 30px 0;
        box-shadow: 0 2px 4px rgba(142, 120, 251, 0.1);
        }
        .code {
        font-family: 'Courier New', monospace;
        font-size: 36px;
        font-weight: bold;
        color: #8e78fb;
        letter-spacing: 8px;
        margin: 0;
        text-shadow: 1px 1px 1px rgba(142, 120, 251, 0.2);
        }
        .warning {
        background: rgba(255, 249, 230, 0.95);
        border: 1px solid #ffeaa7;
        border-radius: 12px;
        padding: 20px;
        margin: 30px 0;
        }
        .warning-title {
        display: flex;
        align-items: center;
        font-weight: 600;
        color: #b7791f;
        margin-bottom: 10px;
        }
        .warning-icon {
        font-size: 20px;
        margin-right: 8px;
        }
        .warning ul {
        margin: 0;
        padding-left: 20px;
        color: #744210;
        }
        .warning li {
        margin: 8px 0;
        }
        .footer {
        text-align: center;
        margin-top: 30px;
        color: #718096;
        font-size: 14px;
        background: rgba(255, 255, 255, 0.95);
        padding: 20px;
        border-radius: 0 0 16px 16px;
        }
      </style>
      </head>
      <body>
      <div class="container">
        <div class="header">
          <img src="https://i.ibb.co/bjbBK9yS/logo-chabaqa.png" alt="Chabaqa Logo" class="logo">
          <h1 style="color:#8e78fb; font-size:32px; font-weight:800; margin-bottom:0;">Réinitialisation de mot de passe</h1>
        </div>
        <div class="content">
          <div class="greeting" style="color:#8e78fb; font-size:28px; font-weight:700;">Bonjour ${userName},</div>
          <p style="color:#2d3748; font-size:18px;">Vous avez demandé la réinitialisation de votre mot de passe pour votre compte <span style="color:#8e78fb; font-weight:600;">Chabaqa</span>.</p>
          <p style="color:#2d3748; font-size:18px; font-weight:500;">Voici votre code de vérification :</p>
          <div class="code-container">
            <div class="code" style="color:#8e78fb; font-size:40px; font-weight:900; background:rgba(255,255,255,0.98); border:2px solid #8e78fb; border-radius:12px; padding:32px;">${code}</div>
          </div>
          <div class="warning" style="background:rgba(255,249,230,0.98); border:1px solid #ffeaa7; border-radius:12px; padding:24px; margin:32px 0;">
            <div class="warning-title" style="color:#b7791f; font-size:20px; font-weight:700; margin-bottom:12px;">
              <span class="warning-icon" style="font-size:22px; margin-right:10px;">⚠️</span>
              Important
            </div>
            <ul style="color:#744210; font-size:16px;">
              <li>Ce code <span style="color:#8e78fb; font-weight:600;">expire dans 10 minutes</span></li>
              <li>Ne partagez <span style="color:#e53e3e; font-weight:600;">jamais</span> ce code avec qui que ce soit</li>
              <li>Si vous n'avez pas demandé cette réinitialisation, ignorez cet email</li>
            </ul>
          </div>
          <p style="color:#2d3748; font-size:16px;">Utilisez ce code pour réinitialiser votre mot de passe dans l'application.</p>
          <p style="color:#8e78fb; font-size:18px; font-weight:600;">Cordialement,<br>L'équipe Chabaqa</p>
        </div>
        <div class="footer" style="background:rgba(255,255,255,0.98); color:#8e78fb; font-size:15px; padding:22px; border-radius:0 0 16px 16px;">
          <p style="margin-bottom:8px;">Cet email a été envoyé automatiquement, merci de ne pas y répondre.</p>
          <p style="font-size:14px; color:#2d3748;">© ${new Date().getFullYear()} <span style="color:#8e78fb; font-weight:600;">Chabaqa</span>. Tous droits réservés.</p>
      </div>
    </div>
  </body>
</html>
    `;
  }

  /**
   * Génère le template HTML pour l'email 2FA
   */
  private generate2FAEmailTemplate(code: string, userName: string): string {

    return `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="ie=edge">
      <title>Vérification de connexion - Chabaqa</title>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
      <style>
        body {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        line-height: 1.6;
        color: #2d3748;
        margin: 0;
        padding: 0;
        background-image: url('https://i.ibb.co/8gKy70WB/gradient-background.png');
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        min-height: 100vh;
        }
        .container {
        max-width: 600px;
        margin: 40px auto;
        background: rgba(255, 255, 255, 0.95);
        box-shadow: 0 4px 6px rgba(142, 120, 251, 0.1);
        border-radius: 16px;
        overflow: hidden;
        backdrop-filter: blur(10px);
        }
        .header {
        background: transparent;
        color: white;
        padding: 40px 20px;
        text-align: center;
        position: relative;
        }
        .header::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 4px;
        background: linear-gradient(90deg, #8e78fb, #86e4fd);
        }
        .logo {
        width: 280px;
        height: auto;
        margin-bottom: 30px;
        filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
        }
        .content {
        background-color: rgba(255, 255, 255, 0.95);
        padding: 40px 30px;
        border-radius: 0 0 16px 16px;
        }
        .greeting {
        font-size: 24px;
        font-weight: 600;
        color: #2d3748;
        margin-bottom: 16px;
        }
        .code-container {
        background: rgba(255, 255, 255, 0.95);
        border: 2px solid #8e78fb;
        border-radius: 12px;
        padding: 30px;
        text-align: center;
        margin: 30px 0;
        box-shadow: 0 2px 4px rgba(142, 120, 251, 0.1);
        }
        .code {
        font-family: 'Courier New', monospace;
        font-size: 36px;
        font-weight: bold;
        color: #8e78fb;
        letter-spacing: 8px;
        margin: 0;
        text-shadow: 1px 1px 1px rgba(142, 120, 251, 0.2);
        }
        .warning {
        background: rgba(255, 249, 230, 0.95);
        border: 1px solid #ffeaa7;
        border-radius: 12px;
        padding: 20px;
        margin: 30px 0;
        }
        .warning-title {
        display: flex;
        align-items: center;
        font-weight: 600;
        color: #b7791f;
        margin-bottom: 10px;
        }
        .warning-icon {
        font-size: 20px;
        margin-right: 8px;
        }
        .warning ul {
        margin: 0;
        padding-left: 20px;
        color: #744210;
        }
        .warning li {
        margin: 8px 0;
        }
        .footer {
        text-align: center;
        margin-top: 30px;
        color: #718096;
        font-size: 14px;
        background: rgba(255, 255, 255, 0.95);
        padding: 20px;
        border-radius: 0 0 16px 16px;
        }
      </style>
      </head>
      <body>
      <div class="container">
        <div class="header">
          <img src="https://i.ibb.co/bjbBK9yS/logo-chabaqa.png" alt="Chabaqa Logo" class="logo">
          <h1 style="color:#8e78fb; font-size:32px; font-weight:800; margin-bottom:0;">Vérification de Connexion</h1>
        </div>
        <div class="content">
          <div class="greeting" style="color:#8e78fb; font-size:28px; font-weight:700;">Bonjour ${userName},</div>
          <p style="color:#2d3748; font-size:18px;">Une nouvelle tentative de connexion a été détectée pour votre compte <span style="color:#8e78fb; font-weight:600;">Chabaqa</span>. Pour assurer la sécurité de votre compte, nous avons besoin de vérifier votre identité.</p>
          <p style="color:#2d3748; font-size:18px; font-weight:500;">Voici votre code de vérification :</p>
          <div class="code-container">
            <div class="code" style="color:#8e78fb; font-size:40px; font-weight:900; background:rgba(255,255,255,0.98); border:2px solid #8e78fb; border-radius:12px; padding:32px;">${code}</div>
          </div>
          <div class="warning" style="background:rgba(255,249,230,0.98); border:1px solid #ffeaa7; border-radius:12px; padding:24px; margin:32px 0;">
            <div class="warning-title" style="color:#b7791f; font-size:20px; font-weight:700; margin-bottom:12px;">
              <span class="warning-icon" style="font-size:22px; margin-right:10px;">⚠️</span>
              Important
            </div>
            <ul style="color:#744210; font-size:16px;">
              <li>Ce code <span style="color:#8e78fb; font-weight:600;">expire dans 10 minutes</span></li>
              <li>Ne partagez <span style="color:#e53e3e; font-weight:600;">jamais</span> ce code avec qui que ce soit</li>
              <li>Si vous n'avez pas tenté de vous connecter, ignorez cet email</li>
            </ul>
          </div>
          <p style="color:#2d3748; font-size:16px;">Si vous avez des questions ou besoin d'aide, n'hésitez pas à contacter notre support.</p>
          <p style="color:#8e78fb; font-size:18px; font-weight:600;">Cordialement,<br>L'équipe Chabaqa</p>
        </div>
        <div class="footer" style="background:rgba(255,255,255,0.98); color:#8e78fb; font-size:15px; padding:22px; border-radius:0 0 16px 16px;">
          <p style="margin-bottom:8px;">Cet email a été envoyé automatiquement, merci de ne pas y répondre.</p>
          <p style="font-size:14px; color:#2d3748;">© ${new Date().getFullYear()} <span style="color:#8e78fb; font-weight:600;">Chabaqa</span>. Tous droits réservés.</p>
      </div>
    </div>
  </body>
</html>
    `;
  }
}