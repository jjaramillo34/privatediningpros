'use client';

import { CheckCircle } from 'lucide-react';

interface AutoPopulatedIndicatorProps {
  isAutoPopulated: boolean;
}

export default function AutoPopulatedIndicator({ isAutoPopulated }: AutoPopulatedIndicatorProps) {
  if (!isAutoPopulated) return null;

  return (
    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
      <div className="flex items-center">
        <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
        <div>
          <h3 className="text-sm font-medium text-green-800">Restaurant Data Auto-Populated</h3>
          <p className="text-xs text-green-600 mt-1">
            Form has been filled with verified data from Outscraper API. You can edit any fields as needed.
          </p>
        </div>
      </div>
    </div>
  );
}

