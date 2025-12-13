import { useLanguage } from '@/contexts/languageContext';
import React from 'react';

interface Props {
  fullName?: string; // optional if you want to personalize the message
}

const WrongPasswordBanner: React.FC<Props> = ({ fullName }) => {

  const { activeLanguage } = useLanguage();

  return (
    <div
      className="flex flex-col justify-center items-center p-6 rounded-md"
      style={{ backgroundColor: '#ffe5e5' }} // light red background
    >
      <h2 className="text-red-700 text-lg font-semibold">
        Your password is wrong!
      </h2>
      {fullName && (
        <p className="text-red-600 mt-2">
          Hi {fullName}, please try again.
        </p>
      )}
    </div>
  );
};

export default WrongPasswordBanner;
