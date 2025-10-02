import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from './ui/button';
import { Globe } from 'lucide-react';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'de' ? 'en' : 'de';
    i18n.changeLanguage(newLang);
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleLanguage}
      className="flex items-center gap-2 font-medium"
      title={i18n.language === 'de' ? 'Switch to English' : 'Zu Deutsch wechseln'}
    >
      <Globe className="h-4 w-4" />
      <span className="font-semibold">
        {i18n.language === 'de' ? 'DE' : 'EN'}
      </span>
    </Button>
  );
};

export default LanguageSwitcher;
