import { ThemeProvider } from '@/components/CustomComponents/theme-provider';
import { LanguageProvider } from '@/lib/contexts/language-context';
import { Routes } from '@/routes';
import { Toaster } from '@/components/ui/sonner';

function App() {
	return (
		<LanguageProvider>
			<ThemeProvider defaultTheme="light" storageKey="webpilot-theme">
				<Routes />
				<Toaster />
			</ThemeProvider>
		</LanguageProvider>
	);
}

export default App;
