import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { UserAuthForm } from "@/components/user-auth-form";
import { LanguageSelector } from "@/components/language-selector";
import { Logo } from "@/components/logo";
import { WhiteLogo } from "@/components/white-logo";
import { Separator } from "@/components/ui/separator";

export function Login() {
  const { t } = useTranslation();

  return (
    <div className="container relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-zinc-900" />
        <div className="relative z-20 flex flex-1 flex-col items-center justify-center text-center">
          <div className="flex items-center gap-1">
            <WhiteLogo className="h-16 w-16" />
            <span className="text-5xl font-bold">{t('app.name')}</span>
          </div>
          <blockquote className="mt-6 max-w-lg">
            <p className="text-xl font-light">
              &ldquo;Success is not final, failure is not fatal: it is the courage to continue that counts.&rdquo;
            </p>
            <footer className="mt-2 text-base">Winston Churchill</footer>
          </blockquote>
        </div>
      </div>
      <div className="relative h-full flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-[400px] space-y-6">
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1">
              <Logo className="h-12 w-12" />
              <span className="text-4xl font-bold">{t('app.name')}</span>
            </div>
            <div className="w-full">
              <Separator className="my-4" />
              <div className="space-y-2 text-center">
                <h2 className="text-3xl font-semibold tracking-tight">
                  {t('auth.welcome')}
                </h2>
                <p className="text-lg text-muted-foreground">
                  {t('auth.emailPrompt')}
                </p>
              </div>
            </div>
          </div>
          <UserAuthForm />
          <div className="space-y-4">
            <p className="text-center text-base text-muted-foreground">
              {t('auth.dontHaveAccount')}{" "}
              <Link
                to="/signup"
                className="underline underline-offset-4 hover:text-primary"
              >
                {t('auth.signUp')}
              </Link>
            </p>
            <p className="text-center text-sm text-muted-foreground">
              {t('auth.terms')}{" "}
              <Link
                to="/terms"
                className="underline underline-offset-4 hover:text-primary"
              >
                {t('auth.termsLink')}
              </Link>{" "}
              {t('auth.and')}{" "}
              <Link
                to="/privacy"
                className="underline underline-offset-4 hover:text-primary"
              >
                {t('auth.privacyLink')}
              </Link>
              .
            </p>
          </div>
        </div>
        <div className="absolute bottom-8">
          <LanguageSelector />
        </div>
      </div>
    </div>
  );
}