import React, { useState, useEffect } from 'react';
import { useWeb3 } from '../../contexts/DummyWalletContext';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';

export default function WalletRegistrationPrompt({ role }) {
  const { connectMetaMask, account, isConnected, registerUser, hasRole, isRegisteredOnChain } = useWeb3();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  // Role mapping for blockchain
  const roleMap = {
    manufacturer: 1,
    consumer: 2,
    recycler: 3,
    regulator: 4
  };

  // Check if user has the specific role for this page
  useEffect(() => {
    const checkRegistration = async () => {
      if (account) {
        try {
          // Check if user has THIS specific role
          const hasThisRole = await hasRole(account, roleMap[role]);

          if (hasThisRole) {
            setIsRegistered(true);
            setStep(3); // Skip to linking step - already has this role
          } else {
            // User may be registered with other roles, but not this one
            // Allow them to add this role
            setIsRegistered(false);
          }
        } catch (err) {
          console.error('Error checking registration:', err);
        }
      }
    };

    checkRegistration();
  }, [account, role, hasRole]);

  const handleConnectWallet = async () => {
    setLoading(true);
    setError('');

    try {
      const result = await connectMetaMask();
      if (result.success) {
        setStep(2);
      } else {
        setError(result.message || 'Failed to connect wallet');
      }
    } catch (err) {
      setError(err.message || 'Failed to connect wallet');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterOnBlockchain = async () => {
    setLoading(true);
    setError('');

    try {
      // Check if user is already registered (for better messaging)
      const isAlreadyRegistered = isRegisteredOnChain;

      console.log(isAlreadyRegistered ? `Adding ${role} role to existing wallet...` : `Registering wallet as ${role}...`);

      const result = await registerUser(role);
      console.log('Registration successful:', result);

      setIsRegistered(true);
      setStep(3);
      setError(''); // Clear any previous errors
    } catch (err) {
      if (err.code === 'ACTION_REJECTED') {
        setError('Transaction rejected by user');
      } else {
        setError(err.message || 'Failed to register on blockchain');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLinkToAccount = async () => {
    setLoading(true);
    setError('');

    try {
      await api.post('/auth/link-wallet', {
        walletAddress: account
      });
      setSuccess(true);

      // Reload page after 2 seconds to refresh with wallet linked
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to link wallet to account');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
        <div className="text-center">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-green-600 mb-2">Wallet Connected Successfully!</h2>
          <p className="text-gray-600">Your wallet has been linked to your account.</p>
          <p className="text-sm text-gray-500 mt-2">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
      <h2 className="text-2xl font-bold text-center mb-6">Connect Your Wallet</h2>

      <div className="mb-8">
        <div className="flex justify-between items-center">
          <StepIndicator number={1} label="Connect MetaMask" active={step === 1} completed={step > 1} />
          <div className="flex-1 h-1 mx-2 bg-gray-200">
            <div className={`h-full ${step > 1 ? 'bg-blue-500' : 'bg-gray-200'}`} />
          </div>
          <StepIndicator number={2} label="Register on Blockchain" active={step === 2} completed={step > 2} />
          <div className="flex-1 h-1 mx-2 bg-gray-200">
            <div className={`h-full ${step > 2 ? 'bg-blue-500' : 'bg-gray-200'}`} />
          </div>
          <StepIndicator number={3} label="Link to Account" active={step === 3} completed={success} />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {step === 1 && (
        <div className="text-center">
          <p className="text-gray-600 mb-6">
            Connect your MetaMask wallet to register as a {role}
          </p>
          <button
            onClick={handleConnectWallet}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Connecting...' : 'Connect MetaMask'}
          </button>
          <p className="text-sm text-gray-500 mt-4">
            Make sure you have MetaMask installed and are on the Ganache network
          </p>
        </div>
      )}

      {step === 2 && (
        <div className="text-center">
          <div className="mb-4">
            <span className="text-sm text-gray-500">Connected Address:</span>
            <p className="text-sm font-mono bg-gray-100 p-2 rounded mt-1">
              {account?.substring(0, 6)}...{account?.substring(38)}
            </p>
          </div>
          <p className="text-gray-600 mb-6">
            Register your wallet on the blockchain as a {role}
          </p>
          <button
            onClick={handleRegisterOnBlockchain}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Registering...' : 'Register on Blockchain'}
          </button>
          <p className="text-sm text-gray-500 mt-4">
            This will require a transaction approval in MetaMask
          </p>
        </div>
      )}

      {step === 3 && (
        <div className="text-center">
          <div className="mb-4">
            <span className="text-sm text-gray-500">Connected Address:</span>
            <p className="text-sm font-mono bg-gray-100 p-2 rounded mt-1">
              {account?.substring(0, 6)}...{account?.substring(38)}
            </p>
          </div>
          <p className="text-gray-600 mb-6">
            Link your wallet to your {user?.email} account
          </p>
          <button
            onClick={handleLinkToAccount}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Linking...' : 'Link Wallet to Account'}
          </button>
        </div>
      )}
    </div>
  );
}

function StepIndicator({ number, label, active, completed }) {
  return (
    <div className="flex flex-col items-center">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
        completed ? 'bg-green-500 text-white' :
        active ? 'bg-blue-500 text-white' :
        'bg-gray-200 text-gray-500'
      }`}>
        {completed ? '✓' : number}
      </div>
      <span className={`text-xs mt-2 ${active ? 'font-semibold' : ''}`}>{label}</span>
    </div>
  );
}
