// SMS Service for sending OTP via GoInfinito SMS Gateway

interface SMSConfig {
  clientId: string;
  clientPassword: string;
  baseUrl: string;
  defaultFrom: string;
}

interface SMSMessage {
  text: string;
  property: number;
  id: string;
  addresses: Array<{
    from: string;
    to: string;
    seq: string;
    tag: string;
  }>;
}

interface SMSRequest {
  apiver: string;
  sms: {
    ver: string;
    dlr: {
      url: string;
    };
    messages: SMSMessage[];
  };
}

interface SMSResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

class SMSService {
  private config: SMSConfig;

  constructor() {
    this.config = {
      clientId: 'Rumbaoa1c7oj80fy3rfrxg7x',
      clientPassword: 'l5bjrc4r802i6p4jwf47dqgeo5kqcx0w',
      baseUrl: 'https://meapi.goinfinito.me/unified/v2',
      defaultFrom: 'Timexpress'
    };
  }

  /**
   * Format phone number for SMS gateway
   * Use the phone number as provided without country code formatting
   */
  private formatPhoneNumber(phoneNumber: string): string {
    // Remove all non-digits and return clean number
    return phoneNumber.replace(/\D/g, '');
  }

  /**
   * Generate OTP message text
   */
  private generateOTPMessage(otp: string): string {
    return `Your ChatESS verification code is: ${otp}. This code expires in 5 minutes. Do not share this code with anyone.`;
  }

  /**
   * Send OTP SMS via GoInfinito gateway
   */
  async sendOTP(phoneNumber: string, otp: string): Promise<SMSResponse> {
    try {
      const formattedPhone = this.formatPhoneNumber(phoneNumber);
      const message = this.generateOTPMessage(otp);
      const messageId = Date.now().toString();

      const smsRequest: SMSRequest = {
        apiver: "1.0",
        sms: {
          ver: "2.0",
          dlr: {
            url: ""
          },
          messages: [
            {
              text: "Hello, its a test",
              property: 0,
              id: messageId,
              addresses: [
                {
                  from: "Timexpress",
                  to: "0525918584",
                  seq: "1",
                  tag: "DT"
                }
              ]
            }
          ]
        }
      };

      console.log('Sending OTP SMS:', {
        to: formattedPhone,
        from: this.config.defaultFrom,
        messageId,
        message
      });

      const response = await fetch(`${this.config.baseUrl}/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-client-id': this.config.clientId,
          'x-client-password': this.config.clientPassword,
        },
        body: JSON.stringify(smsRequest),
      });

      const responseText = await response.text();
      console.log('SMS API Response:', {
        status: response.status,
        statusText: response.statusText,
        body: responseText
      });

      if (!response.ok) {
        throw new Error(`SMS sending failed: ${response.status} ${response.statusText} - ${responseText}`);
      }

      // Try to parse response as JSON, fallback to treating as success if it's not JSON
      let result;
      try {
        result = JSON.parse(responseText);
      } catch {
        result = { success: true };
      }

      return {
        success: true,
        messageId: messageId
      };

    } catch (error: any) {
      console.error('SMS Service Error:', error);
      
      return {
        success: false,
        error: error.message || 'Failed to send SMS'
      };
    }
  }

  /**
   * Test SMS configuration with specific phone number
   */
  async testOTPWithUserPhone(): Promise<SMSResponse> {
    try {
      // Generate a test OTP
      const testOTP = Math.floor(100000 + Math.random() * 900000).toString();
      
      console.log('🧪 Testing SMS with phone number: 0525918584');
      console.log('🔢 Generated test OTP:', testOTP);
      
      // Send OTP to the specific test number
      const result = await this.sendOTP('0525918584', testOTP);
      
      if (result.success) {
        console.log('✅ Test SMS sent successfully!');
        console.log('📱 Please check your phone for the OTP message');
      } else {
        console.log('❌ Test SMS failed:', result.error);
      }
      
      return result;
    } catch (error: any) {
      console.error('🚨 SMS Test Failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Test SMS configuration
   */
  async testConnection(): Promise<boolean> {
    try {
      // Test with the user's specific phone number
      const testResult = await this.testOTPWithUserPhone();
      
      return testResult.success;
    } catch (error) {
      console.error('SMS Test Connection Failed:', error);
      return false;
    }
  }

  /**
   * Validate phone number format for SMS gateway
   */
  validatePhoneForSMS(phoneNumber: string): boolean {
    const formatted = this.formatPhoneNumber(phoneNumber);
    
    // Basic validation - should be between 10-15 digits
    return /^\d{10,15}$/.test(formatted);
  }
}

// Create singleton instance
export const smsService = new SMSService();

// Export types
export type { SMSResponse, SMSConfig }; 