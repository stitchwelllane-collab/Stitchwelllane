import React, { useState } from 'react';
import { ShieldCheck, CreditCard, Smartphone, Building2, Wallet, CheckCircle, AlertCircle, X, Lock } from 'lucide-react';

interface RazorpayModalProps {
  orderAmount: number; // in INR
  razorpayOrderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  onPaymentSuccess: (paymentId: string, orderId: string, signature: string) => void;
  onPaymentDismiss: () => void;
}

export const RazorpayModal: React.FC<RazorpayModalProps> = ({
  orderAmount,
  razorpayOrderId,
  customerName,
  customerEmail,
  customerPhone,
  onPaymentSuccess,
  onPaymentDismiss,
}) => {
  const [activeTab, setActiveTab] = useState<'upi' | 'card' | 'netbanking' | 'wallet'>('upi');
  const [upiId, setUpiId] = useState('customer@okhdfcbank');
  const [cardNumber, setCardNumber] = useState('4111 2222 3333 4444');
  const [cardExpiry, setCardExpiry] = useState('11/28');
  const [cardCvv, setCardCvv] = useState('842');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const banks = [
    'HDFC Bank',
    'State Bank of India',
    'ICICI Bank',
    'Axis Bank',
    'Kotak Mahindra Bank',
    'Punjab National Bank',
  ];

  const handleSimulatePayment = () => {
    setIsProcessing(true);
    setErrorMsg('');

    setTimeout(async () => {
      try {
        const paymentId = `pay_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;
        const signature = `sig_${Date.now()}`;

        // Verify with server backend
        const res = await fetch('/api/razorpay/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            razorpay_order_id: razorpayOrderId,
            razorpay_payment_id: paymentId,
            razorpay_signature: signature,
          }),
        });

        const data = await res.json();
        if (res.ok && data.verified) {
          onPaymentSuccess(paymentId, razorpayOrderId, signature);
        } else {
          setErrorMsg(data.error || 'Payment verification failed');
          setIsProcessing(false);
        }
      } catch {
        setErrorMsg('Network error while processing payment. Please retry.');
        setIsProcessing(false);
      }
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden border border-[#D5CBB9] relative flex flex-col">
        {/* Header with Razorpay & StitchwellLane Branding */}
        <div className="bg-[#0C2340] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
              <Lock className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-editorial text-lg font-bold">StitchwellLane</span>
                <span className="text-[10px] bg-blue-500/30 text-blue-200 px-1.5 py-0.5 rounded font-mono">
                  Razorpay Verified
                </span>
              </div>
              <p className="text-[11px] text-blue-200/80">
                Order #{razorpayOrderId.slice(-8).toUpperCase()} · Secure 256-bit SSL
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs text-blue-200 block">Amount to Pay</span>
            <span className="text-xl font-bold font-mono text-white tabular-nums">
              ₹{orderAmount.toLocaleString('en-IN')}
            </span>
          </div>

          <button
            onClick={onPaymentDismiss}
            disabled={isProcessing}
            className="absolute top-2.5 right-2.5 text-white/70 hover:text-white p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Payment Methods Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs">
          <button
            onClick={() => setActiveTab('upi')}
            className={`flex-1 py-3 px-2 flex flex-col items-center gap-1 border-b-2 font-medium transition-colors ${
              activeTab === 'upi'
                ? 'border-[#0C2340] text-[#0C2340] bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>UPI Apps</span>
          </button>

          <button
            onClick={() => setActiveTab('card')}
            className={`flex-1 py-3 px-2 flex flex-col items-center gap-1 border-b-2 font-medium transition-colors ${
              activeTab === 'card'
                ? 'border-[#0C2340] text-[#0C2340] bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Cards</span>
          </button>

          <button
            onClick={() => setActiveTab('netbanking')}
            className={`flex-1 py-3 px-2 flex flex-col items-center gap-1 border-b-2 font-medium transition-colors ${
              activeTab === 'netbanking'
                ? 'border-[#0C2340] text-[#0C2340] bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Net Banking</span>
          </button>

          <button
            onClick={() => setActiveTab('wallet')}
            className={`flex-1 py-3 px-2 flex flex-col items-center gap-1 border-b-2 font-medium transition-colors ${
              activeTab === 'wallet'
                ? 'border-[#0C2340] text-[#0C2340] bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Wallet className="w-4 h-4" />
            <span>Wallets</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {activeTab === 'upi' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-800">
                  Instant UPI Transfer (0% Surcharge)
                </span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-medium">
                  Fastest
                </span>
              </div>

              {/* UPI Quick Handles */}
              <div className="grid grid-cols-4 gap-2">
                {[
                  { name: 'Google Pay', handle: '@okhdfcbank' },
                  { name: 'PhonePe', handle: '@ybl' },
                  { name: 'Paytm UPI', handle: '@paytm' },
                  { name: 'BHIM UPI', handle: '@upi' },
                ].map((app) => (
                  <button
                    key={app.name}
                    type="button"
                    onClick={() => setUpiId(`${customerEmail.split('@')[0]}${app.handle}`)}
                    className="p-2 border border-slate-200 rounded text-center hover:border-slate-800 hover:bg-slate-50 transition-colors"
                  >
                    <span className="text-[11px] font-medium text-slate-700 block">
                      {app.name}
                    </span>
                  </button>
                ))}
              </div>

              <div>
                <label className="text-xs text-slate-600 block mb-1">Enter your UPI VPA / ID</label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="e.g. mobile@upi"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded font-mono focus:outline-none focus:border-[#0C2340]"
                />
              </div>
            </div>
          )}

          {activeTab === 'card' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-800">
                  Credit / Debit Card (Domestic & International)
                </span>
                <div className="flex gap-1.5 text-[10px] font-mono font-medium text-slate-600">
                  <span>RuPay</span>
                  <span>·</span>
                  <span>Visa</span>
                  <span>·</span>
                  <span>Mastercard</span>
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-600 block mb-1">Card Number</label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  placeholder="4111 2222 3333 4444"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded font-mono focus:outline-none focus:border-[#0C2340]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-600 block mb-1">Expiry (MM/YY)</label>
                  <input
                    type="text"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    placeholder="12/28"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded font-mono focus:outline-none focus:border-[#0C2340]"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-600 block mb-1">CVV</label>
                  <input
                    type="password"
                    maxLength={4}
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value)}
                    placeholder="123"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded font-mono focus:outline-none focus:border-[#0C2340]"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'netbanking' && (
            <div className="space-y-3">
              <span className="text-xs font-semibold text-slate-800 block">
                Select Your Indian Banking Institution
              </span>
              <div className="grid grid-cols-2 gap-2">
                {banks.map((bank) => (
                  <button
                    key={bank}
                    type="button"
                    onClick={() => setSelectedBank(bank)}
                    className={`p-2.5 text-left border rounded text-xs transition-colors ${
                      selectedBank === bank
                        ? 'border-[#0C2340] bg-blue-50/50 font-semibold text-[#0C2340]'
                        : 'border-slate-200 text-slate-600 hover:border-slate-400'
                    }`}
                  >
                    {bank}
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'wallet' && (
            <div className="space-y-3 text-xs">
              <span className="font-semibold text-slate-800 block">
                Supported Digital Wallets
              </span>
              <div className="space-y-2">
                {['Paytm Wallet', 'PhonePe Wallet', 'Amazon Pay', 'Mobikwik'].map((w) => (
                  <label
                    key={w}
                    className="flex items-center gap-2 p-2 border border-slate-200 rounded cursor-pointer hover:bg-slate-50"
                  >
                    <input type="radio" name="wallet" defaultChecked={w === 'Paytm Wallet'} />
                    <span>{w}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Customer Context Confirmation */}
          <div className="p-3 bg-slate-50 rounded text-[11px] text-slate-500 flex justify-between items-center">
            <span>Customer: {customerName}</span>
            <span>{customerPhone}</span>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSimulatePayment}
            disabled={isProcessing}
            className="w-full py-3.5 bg-[#0C2340] hover:bg-[#143257] text-white text-xs font-bold tracking-wider uppercase rounded shadow-md transition-all flex items-center justify-center gap-2 disabled:bg-slate-400 cursor-pointer"
          >
            {isProcessing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Authorizing ₹{orderAmount.toLocaleString('en-IN')} with Bank...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Pay ₹{orderAmount.toLocaleString('en-IN')} via Razorpay</span>
              </>
            )}
          </button>
        </div>

        {/* Security Footer */}
        <div className="bg-slate-100 p-3 text-[10px] text-slate-500 text-center border-t border-slate-200 flex items-center justify-center gap-3">
          <span>PCI-DSS Level 1 Compliant</span>
          <span>·</span>
          <span>RBI Regulated Payment Aggregator</span>
        </div>
      </div>
    </div>
  );
};
