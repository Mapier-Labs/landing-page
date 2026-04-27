'use client';

import { useCallback, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import type { Character } from '@/lib/characters';
import CharacterReveal from './CharacterReveal';
import PhoneEntry from './PhoneEntry';
import OtpVerify from './OtpVerify';
import ClaimSuccess from './ClaimSuccess';

type Step = 'reveal' | 'phone' | 'otp' | 'success';

interface ClaimFlowProps {
  character: Character;
  posterId?: string;
}

// Dev-only step override: in development, ?step=phone|otp|success jumps the flow forward
// for visual QA. Production users always start at 'reveal'.
function useInitialStep(): Step {
  const params = useSearchParams();
  if (process.env.NODE_ENV !== 'development') return 'reveal';
  const requested = params.get('step');
  if (requested === 'phone' || requested === 'otp' || requested === 'success') {
    return requested;
  }
  return 'reveal';
}

export default function ClaimFlow({ character, posterId }: ClaimFlowProps) {
  const initial = useInitialStep();
  const [step, setStep] = useState<Step>(initial);
  // Phone is held in module state across steps so OTP verify can re-use it.
  // We keep tokens in component state only — never localStorage — per spec.
  const [phone, setPhone] = useState('');
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const goToPhone = useCallback(() => setStep('phone'), []);
  const goToOtp = useCallback((submittedPhone: string) => {
    setPhone(submittedPhone);
    setStep('otp');
  }, []);
  const goToSuccess = useCallback((token: string) => {
    setAccessToken(token);
    setStep('success');
  }, []);
  const goBackToPhone = useCallback(() => setStep('phone'), []);

  if (step === 'reveal') {
    return <CharacterReveal character={character} onContinue={goToPhone} />;
  }
  if (step === 'phone') {
    return (
      <PhoneEntry
        character={character}
        initialPhone={phone}
        onSubmitted={goToOtp}
      />
    );
  }
  if (step === 'otp') {
    return (
      <OtpVerify
        character={character}
        phone={phone}
        posterId={posterId}
        onClaimed={goToSuccess}
        onChangePhone={goBackToPhone}
      />
    );
  }
  return <ClaimSuccess character={character} accessToken={accessToken} />;
}
