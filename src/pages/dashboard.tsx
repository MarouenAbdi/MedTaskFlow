import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Calendar,
  DollarSign,
  UserCheck,
  TrendingUp,
  FileText,
  CalendarClock,
  UserPlus,
  ClipboardList,
  Clock,
  AlertCircle,
  Plus,
  X,
  CheckCircle2,
  Edit2,
  Trash2,
} from 'lucide-react';
import { NewAppointmentDialog } from '@/components/modals/new-appointment-dialog';
import { NewPatientDialog } from '@/components/modals/new-patient-dialog';
import { NewMedicalRecordDialog } from '@/components/modals/new-medical-record-dialog';
import { NewInvoiceDialog } from '@/components/modals/new-invoice-dialog';
import { toast } from 'sonner';

const upcomingAppointments = [
  { patient: "Emma Thompson", time: "09:00", type: "Checkup" },
  { patient: "James Wilson", time: "10:30", type: "Follow-up" },
  { patient: "Sophia Chen", time: "11:45", type: "Consultation" },
];

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  isEditing?: boolean;
}

export function Dashboard() {
  const { t } = useTranslation();
  const [todos, setTodos] = useState<Todo[]>([
    { id: '1', text: 'Review patient files', completed: false },
    { id: '2', text: 'Order medical supplies', completed: false },
    { id: '3', text: 'Update vaccination records', completed: true },
  ]);
  const [newTodo, setNewTodo] = useState('');
  
  const [appointmentDialogOpen, setAppointmentDialogOpen] = useState(false);
  const [patientDialogOpen, setPatientDialogOpen] = useState(false);
  const [recordDialogOpen, setRecordDialogOpen] = useState(false);
  const [invoiceDialogOpen, setInvoiceDialogOpen] = useState(false);

  const addTodo = () => {
    if (newTodo.trim()) {
      setTodos([
        { id: Date.now().toString(), text: newTodo.trim(), completed: false },
        ...todos
      ]);
      setNewTodo('');
    }
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo => 
      todo.id === id 
        ? { ...todo, completed: !todo.completed }
        : todo
    ).sort((a, b) => {
      if (a.completed === b.completed) return 0;
      return a.completed ? 1 : -1;
    }));
  };

  const startEditing = (id: string) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, isEditing: true } : todo
    ));
  };

  const updateTodo = (id: string, newText: string) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, text: newText, isEditing: false } : todo
    ));
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const quickActions = [
    {
      icon: Calendar,
      title: "Schedule Appointment",
      description: "Book a new patient visit",
      color: "bg-blue-100 dark:bg-blue-900/20",
      iconColor: "text-blue-600 dark:text-blue-400",
      onClick: () => setAppointmentDialogOpen(true)
    },
    {
      icon: UserPlus,
      title: "Add Patient",
      description: "Register a new patient",
      color: "bg-green-100 dark:bg-green-900/20",
      iconColor: "text-green-600 dark:text-green-400",
      onClick: () => setPatientDialogOpen(true)
    },
    {
      icon: FileText,
      title: "Create Record",
      description: "Add medical record",
      color: "bg-purple-100 dark:bg-purple-900/20",
      iconColor: "text-purple-600 dark:text-purple-400",
      onClick: () => setRecordDialogOpen(true)
    },
    {
      icon: DollarSign,
      title: "Create Invoice",
      description: "Generate new invoice",
      color: "bg-amber-100 dark:bg-amber-900/20",
      iconColor: "text-amber-600 dark:text-amber-400",
      onClick: () => setInvoiceDialogOpen(true)
    }
  ];

  const handleNewAppointment = (data: any) => {
    toast.success("New appointment scheduled successfully");
  };

  const handleNewPatient = (data: any) => {
    toast.success("New patient registered successfully");
  };

  const handleNewRecord = (data: any) => {
    toast.success("New medical record created successfully");
  };

  const handleNewInvoice = (data: any) => {
    toast.success("New invoice created successfully");
  };

  return (
    <div className="space-y-8">
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('dashboard.totalAppointments')}
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <Clock className="mr-1 h-3 w-3" />
              Today's Schedule
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Patients
            </CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">345</div>
            <div className="flex items-center text-xs text-green-600 dark:text-green-400">
              <TrendingUp className="mr-1 h-3 w-3" />
              +5 this week
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Monthly Revenue
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$12,450</div>
            <div className="flex items-center text-xs text-green-600 dark:text-green-400">
              <TrendingUp className="mr-1 h-3 w-3" />
              +15% from last month
            </div>
          </CardContent>
        </Card>

        <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Records
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <div className="flex items-center text-xs text-amber-600 dark:text-amber-400">
              <Clock className="mr-1 h-3 w-3" />
              Require attention
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4">
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
          <Card className="h-[400px]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarClock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                Appointments Coming Up
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingAppointments.map((appointment, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-accent/50 transition-colors cursor-pointer">
                    <div>
                      <p className="font-medium">{appointment.patient}</p>
                      <p className="text-sm text-muted-foreground">{appointment.type}</p>
                    </div>
                    <div className="text-sm font-medium">{appointment.time}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="h-[400px]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {quickActions.map((action, index) => (
                  <div
                    key={index}
                    onClick={action.onClick}
                    className={`p-4 rounded-lg ${action.color} hover:opacity-90 transition-all cursor-pointer hover:scale-[1.02] hover:shadow-lg`}
                  >
                    <action.icon className={`h-6 w-6 mb-2 ${action.iconColor}`} />
                    <h3 className="font-medium">{action.title}</h3>
                    <p className="text-sm text-muted-foreground">{action.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
          <Card className="h-[400px]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardList className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                Todo List
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a new todo..."
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addTodo()}
                  />
                  <Button size="icon" onClick={addTodo}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-2 max-h-[280px] overflow-y-auto">
                  {todos.map((todo) => (
                    <div
                      key={todo.id}
                      className={`flex items-center gap-2 p-2 rounded-lg hover:bg-accent/50 group ${
                        todo.completed ? 'opacity-60' : ''
                      }`}
                    >
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                        onClick={() => toggleTodo(todo.id)}
                      >
                        <CheckCircle2 className={`h-4 w-4 ${
                          todo.completed ? 'text-green-500' : 'text-muted-foreground'
                        }`} />
                      </Button>
                      {todo.isEditing ? (
                        <Input
                          className="flex-1"
                          defaultValue={todo.text}
                          onBlur={(e) => updateTodo(todo.id, e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              updateTodo(todo.id, e.currentTarget.value);
                            } else if (e.key === 'Escape') {
                              updateTodo(todo.id, todo.text);
                            }
                          }}
                          autoFocus
                        />
                      ) : (
                        <span className={`flex-1 ${todo.completed ? 'line-through' : ''}`}>
                          {todo.text}
                        </span>
                      )}
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8"
                          onClick={() => startEditing(todo.id)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-destructive"
                          onClick={() => deleteTodo(todo.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="h-[400px]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardList className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-full">
                    <FileText className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="font-medium">Medical record updated</p>
                    <p className="text-sm text-muted-foreground">Dr. Smith updated Emma Thompson's records</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                    <UserPlus className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="font-medium">New patient registered</p>
                    <p className="text-sm text-muted-foreground">James Wilson completed registration</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-full">
                    <Calendar className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="font-medium">Appointment rescheduled</p>
                    <p className="text-sm text-muted-foreground">Sarah Johnson rescheduled to next week</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <NewAppointmentDialog
        open={appointmentDialogOpen}
        onOpenChange={setAppointmentDialogOpen}
        onSave={handleNewAppointment}
        withButton={false}
      />
      
      <NewPatientDialog
        open={patientDialogOpen}
        onOpenChange={setPatientDialogOpen}
        onSave={handleNewPatient}
        withButton={false}
      />
      
      <NewMedicalRecordDialog
        open={recordDialogOpen}
        onOpenChange={setRecordDialogOpen}
        onSave={handleNewRecord}
        withButton={false}
      />
      
      <NewInvoiceDialog
        open={invoiceDialogOpen}
        onOpenChange={setInvoiceDialogOpen}
        onSave={handleNewInvoice}
        withButton={false}
      />
    </div>
  );
}