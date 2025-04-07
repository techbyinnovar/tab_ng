// Paystack integration utility

// Define the Paystack window interface
declare global {
  interface Window {
    PaystackPop: {
      setup: (config: PaystackConfig) => {
        openIframe: () => void;
      };
    };
  }
}

// Paystack configuration interface
export interface PaystackConfig {
  key: string;
  email: string;
  amount: number; // in kobo (multiply Naira by 100)
  ref?: string;
  currency?: string;
  channels?: string[];
  metadata?: {
    custom_fields: Array<{
      display_name: string;
      variable_name: string;
      value: string;
    }>;
  };
  label?: string;
  onClose?: () => void;
  onSuccess?: (transaction: PaystackTransaction) => void;
}

// Paystack transaction response interface
export interface PaystackTransaction {
  reference: string;
  status: string;
  trans: string;
  transaction: string;
  message: string;
  trxref: string;
}

// Load Paystack script
export const loadPaystackScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Check if script is already loaded
    if (document.getElementById('paystack-script')) {
      console.log('Paystack script already loaded');
      resolve();
      return;
    }

    console.log('Loading Paystack script...');
    const script = document.createElement('script');
    script.id = 'paystack-script';
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    
    script.onload = () => {
      console.log('Paystack script loaded successfully');
      resolve();
    };
    script.onerror = () => {
      console.error('Failed to load Paystack script');
      reject(new Error('Failed to load Paystack script'));
    };
    
    document.head.appendChild(script);
  });
};

// Initialize Paystack payment
export const initializePaystack = async (config: PaystackConfig): Promise<void> => {
  try {
    console.log('Initializing Paystack with config:', { 
      email: config.email, 
      amount: config.amount, 
      ref: config.ref,
      currency: config.currency
    });
    
    await loadPaystackScript();
    
    if (window.PaystackPop) {
      console.log('Opening Paystack payment modal');
      const handler = window.PaystackPop.setup(config);
      handler.openIframe();
    } else {
      console.error('Paystack script loaded but PaystackPop not available');
      throw new Error('Paystack script loaded but PaystackPop not available');
    }
  } catch (error) {
    console.error('Paystack initialization error:', error);
    throw error;
  }
};

// Generate a unique reference for the transaction
export const generatePaystackReference = (): string => {
  const timestamp = new Date().getTime().toString();
  const randomString = Math.random().toString(36).substring(2, 10);
  return `TAB-${timestamp}-${randomString}`;
};

// Convert Naira to kobo (Paystack requires amount in kobo)
export const convertToKobo = (amount: number): number => {
  return Math.round(amount * 100);
};
