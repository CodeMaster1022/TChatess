// Test script for SMS OTP functionality
// Run with: node test-sms.js

async function testSMSService() {
  console.log('🚀 Starting SMS OTP Test...\n');
  
  // SMS configuration matching the service
  const config = {
    clientId: 'Rumbaoa1c7oj80fy3rfrxg7x',
    clientPassword: 'l5bjrc4r802i6p4jwf47dqgeo5kqcx0w',
    baseUrl: 'https://meapi.goinfinito.me/unified/v2',
    defaultFrom: 'Timexpress'
  };
  
  // Generate test OTP
  const testOTP = Math.floor(100000 + Math.random() * 900000).toString();
  const testPhone = '0525918584';
  const messageId = Date.now().toString();
  
  console.log('📱 Test Phone Number:', testPhone);
  console.log('🔢 Generated OTP:', testOTP);
  console.log('🆔 Message ID:', messageId);
  console.log('-----------------------------------\n');
  
  // Prepare SMS request
  const smsRequest = {
    apiver: "1.0",
    sms: {
      ver: "2.0",
      dlr: {
        url: ""
      },
      messages: [
        {
          text: `Your ChatESS verification code is: ${testOTP}. This code expires in 5 minutes. Do not share this code with anyone.`,
          property: 0,
          id: messageId,
          addresses: [
            {
              from: config.defaultFrom,
              to: testPhone,
              seq: "1",
              tag: "OTP"
            }
          ]
        }
      ]
    }
  };
  
  console.log('📤 Sending SMS request...');
  console.log('Request payload:', JSON.stringify(smsRequest, null, 2));
  console.log('-----------------------------------\n');
  
  try {
    const response = await fetch(`${config.baseUrl}/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-client-id': config.clientId,
        'x-client-password': config.clientPassword,
      },
      body: JSON.stringify(smsRequest),
    });
    
    const responseText = await response.text();
    
    console.log('📥 SMS API Response:');
    console.log('Status:', response.status, response.statusText);
    console.log('Response:', responseText);
    console.log('-----------------------------------\n');
    
    if (response.ok) {
      console.log('✅ SMS SENT SUCCESSFULLY!');
      console.log('📱 Please check your phone (0525918584) for the OTP message');
      console.log('🔢 Expected OTP:', testOTP);
    } else {
      console.log('❌ SMS FAILED TO SEND');
      console.log('Error details:', responseText);
    }
    
  } catch (error) {
    console.error('🚨 Network/Request Error:', error.message);
  }
}

// Run the test
testSMSService().catch(console.error); 