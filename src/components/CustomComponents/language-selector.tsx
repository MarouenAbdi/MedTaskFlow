import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Languages } from 'lucide-react';

const languages = [
  { code: 'en', flag: '🇬🇧', name: 'English' },
  { code: 'fr', flag: '🇫🇷', name: 'Français' },
  { code: 'es', flag: '🇪🇸', name: 'Español' },
  { code: 'pt', flag: '🇵🇹', name: 'Português' },
  { code: 'de', flag: '🇩🇪', name: 'Deutsch' },
];

export function LanguageSelector({ inSidebar = false }) {
  const { t, i18n } = useTranslation();
  
  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  return (
    <div className="flex justify-center w-full">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          {inSidebar ? (
            <Button variant="ghost" className="w-full justify-start gap-2">
              <Languages className="h-4 w-4" />
              {t(`languages.${currentLanguage.code}`)}
            </Button>
          ) : (
            <Button variant="ghost" className="gap-2">
              <span className="text-lg">{currentLanguage.flag}</span>
              <span className="hidden md:inline">{currentLanguage.name}</span>
            </Button>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center" className="w-[180px]">
          {languages.map((lang) => (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => i18n.changeLanguage(lang.code)}
              className="gap-2"
            >
              <span className="text-lg">{lang.flag}</span>
              <span>{t(`languages.${lang.code}`)}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}