import { useState } from 'react';
import { Calendar, Clock, Scissors, User, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ServiceSelection from '@/components/ServiceSelection';
import TimeSlotPicker from '@/components/TimeSlotPicker';
import CustomerForm from '@/components/CustomerForm';
import PaymentSection from '@/components/PaymentSection';
import AdminPanel from '@/components/AdminPanel';
import AdminLogin from '@/components/AdminLogin';

export type Service = {
  id: string;
  name: string;
  price: number;
  duration: number;
  description: string;
  image: string;
};

export type TimeSlot = {
  time: string;
  available: boolean;
};

export type Booking = {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  service: Service;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'paid';
  createdAt: string;
};

const Index = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [customerData, setCustomerData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [showAdmin, setShowAdmin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  const resetBooking = () => {
    setCurrentStep(1);
    setSelectedService(null);
    setSelectedDate('');
    setSelectedTime('');
    setCustomerData({ name: '', email: '', phone: '' });
  };

  const handleAdminLogin = () => {
    setShowAdminLogin(true);
  };

  const handleAdminLoginSuccess = () => {
    setIsAdminAuthenticated(true);
    setShowAdminLogin(false);
    setShowAdmin(true);
  };

  const handleAdminBack = () => {
    setShowAdmin(false);
    setIsAdminAuthenticated(false);
  };

  if (showAdminLogin) {
    return (
      <AdminLogin
        onSuccess={handleAdminLoginSuccess}
        onBack={() => setShowAdminLogin(false)}
      />
    );
  }

  if (showAdmin && isAdminAuthenticated) {
    return <AdminPanel onBack={handleAdminBack} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Header */}
      <header className="bg-black/50 backdrop-blur-md border-b border-yellow-500/20">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 p-3 rounded-full">
                <Scissors className="h-6 w-6 text-black" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">BarberShop Elite</h1>
                <p className="text-yellow-400 text-sm">Reservas en línea</p>
              </div>
            </div>
            <Button
              onClick={handleAdminLogin}
              variant="outline"
              className="border-yellow-500 text-yellow-400 hover:bg-yellow-500 hover:text-black"
            >
              Panel Admin
            </Button>
          </div>
        </div>
      </header>

      {/* Progress Steps */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${
                    currentStep >= step
                      ? 'bg-yellow-500 text-black'
                      : 'bg-gray-700 text-gray-400'
                  }`}
                >
                  {step}
                </div>
                {step < 4 && (
                  <div
                    className={`w-16 h-1 mx-2 transition-all duration-300 ${
                      currentStep > step ? 'bg-yellow-500' : 'bg-gray-700'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Step Titles */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">
              {currentStep === 1 && 'Selecciona tu Servicio'}
              {currentStep === 2 && 'Elige Fecha y Hora'}
              {currentStep === 3 && 'Tus Datos'}
              {currentStep === 4 && 'Confirmar y Pagar'}
            </h2>
            <p className="text-gray-400">
              {currentStep === 1 && 'Elige el corte que más te guste'}
              {currentStep === 2 && 'Selecciona el día y horario que prefieras'}
              {currentStep === 3 && 'Completa tus datos de contacto'}
              {currentStep === 4 && 'Confirma tu reserva y realiza el pago'}
            </p>
          </div>

          {/* Step Content */}
          <div className="bg-gray-800/50 backdrop-blur-md rounded-2xl p-8 border border-gray-700/50">
            {currentStep === 1 && (
              <ServiceSelection
                selectedService={selectedService}
                onServiceSelect={setSelectedService}
                onNext={() => setCurrentStep(2)}
              />
            )}

            {currentStep === 2 && (
              <TimeSlotPicker
                selectedDate={selectedDate}
                selectedTime={selectedTime}
                onDateSelect={setSelectedDate}
                onTimeSelect={setSelectedTime}
                onNext={() => setCurrentStep(3)}
                onBack={() => setCurrentStep(1)}
              />
            )}

            {currentStep === 3 && (
              <CustomerForm
                customerData={customerData}
                onCustomerDataChange={setCustomerData}
                onNext={() => setCurrentStep(4)}
                onBack={() => setCurrentStep(2)}
              />
            )}

            {currentStep === 4 && (
              <PaymentSection
                service={selectedService!}
                date={selectedDate}
                time={selectedTime}
                customerData={customerData}
                onBack={() => setCurrentStep(3)}
                onSuccess={resetBooking}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
