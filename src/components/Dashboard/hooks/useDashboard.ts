import { useState, useEffect } from 'react';
import { Todo, DialogStates } from '../types';
import { aiAssistants } from '../utils';
import { toast } from 'sonner';

export function useDashboard() {
	const [todos, setTodos] = useState<Todo[]>([
		{ id: '1', text: 'Review patient records', completed: false },
		{ id: '2', text: 'Update medical history', completed: true },
		{ id: '3', text: 'Schedule follow-up appointments', completed: false },
	]);
	const [newTodo, setNewTodo] = useState('');
	const [currentAssistant, setCurrentAssistant] = useState<number>(0);
	const [rotationProgress, setRotationProgress] = useState<number>(0);
	const [dialogStates, setDialogStates] = useState<DialogStates>({
		newAppointment: false,
		newPatient: false,
		newRecord: false,
		newInvoice: false,
	});

	useEffect(() => {
		const interval = setInterval(() => {
			setRotationProgress((prev) => {
				if (prev >= 100) {
					setCurrentAssistant((current) =>
						current === aiAssistants.length - 1 ? 0 : current + 1
					);
					return 0;
				}
				return prev + 1;
			});
		}, 50);

		return () => clearInterval(interval);
	}, []);

	const addTodo = () => {
		if (!newTodo.trim()) return;
		setTodos((prev) => [
			...prev,
			{ id: Date.now().toString(), text: newTodo, completed: false },
		]);
		setNewTodo('');
	};

	const toggleTodo = (id: string) => {
		setTodos((prev) =>
			prev.map((todo) =>
				todo.id === id ? { ...todo, completed: !todo.completed } : todo
			)
		);
	};

	const startEditing = (id: string) => {
		setTodos((prev) =>
			prev.map((todo) => (todo.id === id ? { ...todo, isEditing: true } : todo))
		);
	};

	const updateTodo = (id: string, newText: string) => {
		setTodos((prev) =>
			prev.map((todo) =>
				todo.id === id ? { ...todo, text: newText, isEditing: false } : todo
			)
		);
	};

	const deleteTodo = (id: string) => {
		setTodos((prev) => prev.filter((todo) => todo.id !== id));
	};

	const handleNewAppointment = () => {
		setDialogStates((prev) => ({ ...prev, newAppointment: false }));
		toast.success('New appointment scheduled successfully');
	};

	const handleNewPatient = () => {
		setDialogStates((prev) => ({ ...prev, newPatient: false }));
		toast.success('New patient added successfully');
	};

	const handleNewRecord = () => {
		setDialogStates((prev) => ({ ...prev, newRecord: false }));
		toast.success('Medical record created successfully');
	};

	const handleNewInvoice = () => {
		setDialogStates((prev) => ({ ...prev, newInvoice: false }));
		toast.success('Invoice generated successfully');
	};

	return {
		todos,
		newTodo,
		setNewTodo,
		addTodo,
		toggleTodo,
		startEditing,
		updateTodo,
		deleteTodo,
		currentAssistant,
		rotationProgress,
		dialogStates,
		setDialogStates,
		handleNewAppointment,
		handleNewPatient,
		handleNewRecord,
		handleNewInvoice,
	};
}
