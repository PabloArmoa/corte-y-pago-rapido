
import { useState } from 'react';
import { CreditCard, Check, Calendar, Clock, User, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Service } from '@/pages/Index';

interface CustomerData {
  name: string;
  email: string;
  phone: string;
}

interface PaymentSectionProps {
  service: Service;
  date: string;
  time: string;
  customerData: CustomerData;
  onBack: () => void;
  onSuccess: () => void;
}

const PaymentSection = ({ service, date, time, customerData, onBack, onSuccess }: PaymentSectionProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'mercadopago' | 'cash'>('mercadopago');

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-AR', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const handleMercadoPagoPayment = async () => {
    setIsProcessing(true);
    
    try {
      // Simular llamada a MercadoPago
      // En una implementación real, aquí harías la llamada a la API de MercadoPago
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Simular respuesta exitosa
      console.log('Pago procesado exitosamente');
      
      // Guardar la reserva
      const booking = {
        id: Date.now().toString(),
        customerName: customerData.name,
        customerEmail: customerData.email,
        customerPhone: customerData.phone,
        service,
        date,
        time,
        status: 'confirmed' as const,
        paymentStatus: 'paid' as const,
        createdAt: new Date().toISOString()
      };

      // Guardar en localStorage (en una app real usarías una base de datos)
      const existingBookings = JSON.parse(localStorage.getItem('barber_bookings') || '[]');
      existingBookings.push(booking);
      localStorage.setItem('barber_bookings', JSON.stringify(existingBookings));

      onSuccess();
    } catch (error) {
      console.error('Error processing payment:', error);
      alert('Error procesando el pago. Por favor intenta de nuevo.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCashPayment = () => {
    const booking = {
      id: Date.now().toString(),
      customerName: customerData.name,
      customerEmail: customerData.email,
      customerPhone: customerData.phone,
      service,
      date,
      time,
      status: 'confirmed' as const,
      paymentStatus: 'pending' as const,
      createdAt: new Date().toISOString()
    };

    // Guardar en localStorage
    const existingBookings = JSON.parse(localStorage.getItem('barber_bookings') || '[]');
    existingBookings.push(booking);
    localStorage.setItem('barber_bookings', JSON.stringify(existingBookings));

    onSuccess();
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Resumen de la Reserva */}
      <div className="bg-gray-700/30 rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center">
          <Check className="h-5 w-5 mr-2 text-yellow-400" />
          Resumen de tu Reserva
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="bg-yellow-500/20 p-2 rounded-lg">
                <User className="h-4 w-4 text-yellow-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Cliente</p>
                <p className="text-white font-semibold">{customerData.name}</p>
                <p className="text-gray-400 text-sm">{customerData.email}</p>
                <p className="text-gray-400 text-sm">{customerData.phone}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="bg-yellow-500/20 p-2 rounded-lg">
                <Calendar className="h-4 w-4 text-yellow-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Fecha y Hora</p>
                <p className="text-white font-semibold">{formatDate(date)}</p>
                <p className="text-yellow-400 font-semibold">{time} hs</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
              <h4 className="text-white font-semibold mb-2">{service.name}</h4>
              <p className="text-gray-400 text-sm mb-3">{service.description}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1 text-gray-400">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">{service.duration} min</span>
                </div>
                <div className="text-yellow-400 font-bold text-lg">
                  ${service.price.toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Método de Pago */}
      <div className="bg-gray-700/30 rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center">
          <CreditCard className="h-5 w-5 mr-2 text-yellow-400" />
          Método de Pago
        </h3>

        <div className="space-y-4">
          <div
            onClick={() => setPaymentMethod('mercadopago')}
            className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 ${
              paymentMethod === 'mercadopago'
                ? 'border-yellow-500 bg-yellow-500/10'
                : 'border-gray-600 hover:border-gray-500'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className={`w-4 h-4 rounded-full border-2 ${
                paymentMethod === 'mercadopago' ? 'border-yellow-500 bg-yellow-500' : 'border-gray-400'
              }`}>
                {paymentMethod === 'mercadopago' && (
                  <div className="w-full h-full rounded-full bg-yellow-500"></div>
                )}
              </div>
              <div className="flex-1">
                <h4 className="text-white font-semibold">Pagar con MercadoPago</h4>
                <p className="text-gray-400 text-sm">Tarjeta de crédito, débito o transferencia</p>
              </div>
              <div className="text-2xl">💳</div>
            </div>
          </div>

          <div
            onClick={() => setPaymentMethod('cash')}
            className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 ${
              paymentMethod === 'cash'
                ? 'border-yellow-500 bg-yellow-500/10'
                : 'border-gray-600 hover:border-gray-500'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className={`w-4 h-4 rounded-full border-2 ${
                paymentMethod === 'cash' ? 'border-yellow-500 bg-yellow-500' : 'border-gray-400'
              }`}>
                {paymentMethod === 'cash' && (
                  <div className="w-full h-full rounded-full bg-yellow-500"></div>
                )}
              </div>
              <div className="flex-1">
                <h4 className="text-white font-semibold">Pagar en el Local</h4>
                <p className="text-gray-400 text-sm">Efectivo al momento del servicio</p>
              </div>
              <div className="text-2xl">💵</div>
            </div>
          </div>
        </div>
      </div>

      {/* Total y Botones */}
      <div className="bg-gray-700/30 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <span className="text-xl font-bold text-white">Total a Pagar:</span>
          <span className="text-2xl font-bold text-yellow-400">
            ${service.price.toLocaleString()}
          </span>
        </div>

        <div className="flex justify-between space-x-4">
          <Button
            onClick={onBack}
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-600"
          >
            Volver
          </Button>

          {paymentMethod === 'mercadopago' ? (
            <Button
              onClick={handleMercadoPagoPayment}
              disabled={isProcessing}
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold flex-1"
            >
              {isProcessing ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-black border-t-transparent"></div>
                  <span>Procesando...</span>
                </div>
              ) : (
                'Pagar con MercadoPago'
              )}
            </Button>
          ) : (
            <Button
              onClick={handleCashPayment}
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold flex-1"
            >
              Confirmar Reserva
            </Button>
          )}
        </div>

        {paymentMethod === 'cash' && (
          <div className="mt-4 bg-blue-500/20 border border-blue-500/30 rounded-lg p-4">
            <p className="text-blue-200 text-sm">
              <strong>ℹ️ Recordatorio:</strong> El pago se realizará en efectivo al momento del servicio. 
              Tu reserva estará confirmada.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentSection;
