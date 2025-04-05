import { BrowserRouter, Route, Routes as RouterRoutes } from 'react-router-dom';
import { Layout } from '@/components/CustomComponents/layout';
import { Landing } from '@/pages/landing';
import Dashboard from '@/pages/dashboard';
import Appointments from '@/pages/appointments';
import { Patients } from '@/pages/patients';
import { MedicalRecords } from '@/pages/medical-records';
import Invoices from '@/pages/invoices';
import { Login } from '@/pages/login';
import { SignUp } from '@/pages/signup';
import { Payment } from '@/pages/payment';
import { Pricing } from '@/pages/pricing';
import { ManageSubscription } from '@/pages/manage-subscription';
import AiAssistants from '@/pages/ai-assistants';

export function Routes() {
	return (
		<BrowserRouter>
			<RouterRoutes>
				<Route path="/" element={<Landing />} />
				<Route path="/login" element={<Login />} />
				<Route path="/signup" element={<SignUp />} />
				<Route path="/payment" element={<Payment />} />
				<Route path="/pricing" element={<Pricing />} />
				<Route path="/manage-subscription" element={<ManageSubscription />} />
				<Route element={<Layout />}>
					<Route path="/dashboard" element={<Dashboard />} />
					<Route path="/appointments" element={<Appointments />} />
					<Route path="/patients" element={<Patients />} />
					<Route path="/medical-records" element={<MedicalRecords />} />
					<Route path="/invoices" element={<Invoices />} />
					<Route path="/ai-assistants" element={<AiAssistants />} />
				</Route>
			</RouterRoutes>
		</BrowserRouter>
	);
}
