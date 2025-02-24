import { useTranslation } from 'react-i18next';

export function Footer() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <div className="border-t p-4">
      <p className="text-xs text-center text-muted-foreground">
        &copy; {currentYear} {t('app.name')}
      </p>
    </div>
  );
}