// src/features/auth/components/RegistrationStepper.tsx
import React from 'react';
import { motion } from 'framer-motion';

interface StepperProps {
  currentStep: number;
  totalSteps: number;
}

export const RegistrationStepper = ({ currentStep, totalSteps }: StepperProps) => {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
      <motion.div
        className="h-full bg-blue-500"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.5 }}
      />
    </div>
  );
};