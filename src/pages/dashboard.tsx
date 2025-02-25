import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Calendar,
  DollarSign,
  UserCheck,
  AlertCircle,
  HeartPulse,
  TrendingUp,
  FileText,
  CalendarClock,
  UserPlus,
  ClipboardList,
  BellRing,
  Clock,
} from 'lucide-react';

const upcomingAppointments = [
  { patient: "Emma Thompson", time: "09:00", type: "Checkup" },
  { patient: "James Wilson", time: "10:30", type: "Follow-up" },
  { patient: "Sophia Chen", time: "11:45", type: "Consultation" },
  { patient: "Lucas Garcia", time: "14:15", type: "Emergency" },
];

const recentAlerts = [
  { message: "Low inventory for medical supplies", priority: "high" },
  { message: "Patient records need updating", priority: "medium" },
  { message: "Insurance verification pending", priority: "medium" },
  { message: "Equipment maintenance due", priority: "low" },
];

export function Dashboard() {
  const { t } = useTranslation();

  return (
    <div className="space-y-8">
      {/* Quick Stats */}
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
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
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
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
              +15% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Patient Satisfaction
            </CardTitle>
            <HeartPulse className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98%</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
              +2.1% from last month
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        {/* Today's Schedule */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarClock className="h-5 w-5" />
              Today's Schedule
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingAppointments.map((appointment, index) => (
                <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
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

        {/* System Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              System Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentAlerts.map((alert, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-2 p-2 rounded-lg ${
                    alert.priority === 'high'
                      ? 'bg-red-50 dark:bg-red-900/20'
                      : alert.priority === 'medium'
                      ? 'bg-yellow-50 dark:bg-yellow-900/20'
                      : 'bg-blue-50 dark:bg-blue-900/20'
                  }`}
                >
                  <BellRing className={`h-4 w-4 mt-0.5 ${
                    alert.priority === 'high'
                      ? 'text-red-500'
                      : alert.priority === 'medium'
                      ? 'text-yellow-500'
                      : 'text-blue-500'
                  }`} />
                  <p className="text-sm">{alert.message}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5" />
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

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors cursor-pointer">
                <Calendar className="h-6 w-6 mb-2 text-primary" />
                <h3 className="font-medium">Schedule Appointment</h3>
                <p className="text-sm text-muted-foreground">Book a new patient visit</p>
              </div>
              <div className="p-4 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors cursor-pointer">
                <UserPlus className="h-6 w-6 mb-2 text-primary" />
                <h3 className="font-medium">Add Patient</h3>
                <p className="text-sm text-muted-foreground">Register a new patient</p>
              </div>
              <div className="p-4 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors cursor-pointer">
                <FileText className="h-6 w-6 mb-2 text-primary" />
                <h3 className="font-medium">Create Record</h3>
                <p className="text-sm text-muted-foreground">Add medical record</p>
              </div>
              <div className="p-4 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors cursor-pointer">
                <DollarSign className="h-6 w-6 mb-2 text-primary" />
                <h3 className="font-medium">Create Invoice</h3>
                <p className="text-sm text-muted-foreground">Generate new invoice</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}