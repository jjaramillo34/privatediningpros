'use client';

import { CheckCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface SuccessMessageProps {
  countdown: number;
}

export default function SuccessMessage({ countdown }: SuccessMessageProps) {
  return (
    <div className="text-center">
      <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Thank you!</h2>
      <p className="text-gray-600 mb-6">Your suggestion has been submitted for review.</p>
      <p className="text-sm text-gray-500 mb-4">Page will refresh in {countdown} second{countdown !== 1 ? 's' : ''}...</p>
      <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
        <p className="text-sm text-blue-800">
          Restaurant data includes coordinates and location information from verified sources.
        </p>
      </div>
      <Link href="/" className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mt-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Home
      </Link>
    </div>
  );
}

