
import { useState } from 'react';
import { User, Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface CustomerData {
  name: string;
  email: string;
  phone: string;
}

interface CustomerFormProps {
  customerData: CustomerData;
  onCustomerDataChange: (data: CustomerData) => void;
  onNext: () => void;
  onBack: () => void;
}

const CustomerForm = ({ customerData, onCustomerDataChange, onNext, onBack }: CustomerFormProps) => {
  const [errors, setErrors] = useState<Partial<CustomerData>>({});

  const validateForm = () => {
    const newErrors: Partial<CustomerData> = {};

    if (!customerData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }

    if (!customerData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(customerData.email)) {
      newErrors.email = 'Email no válido';
    }

    if (!customerData.phone.trim()) {
      newErrors.phone = 'El teléfono es requerido';
    } else if (!/^\d{10,}$/.test(customerData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Teléfono debe tener al menos 10 dígitos';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof CustomerData, value: string) => {
    onCustomerDataChange({ ...customerData, [field]: value });
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: undefined });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onNext();
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="text-center mb-8">
          <div className="bg-yellow-500/20 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <User className="h-8 w-8 text-yellow-400" />
          </div>
          <p className="text-gray-400">
            Completa tus datos para confirmar la reserva
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="name" className="text-white flex items-center mb-2">
              <User className="h-4 w-4 mr-2 text-yellow-400" />
              Nombre Completo
            </Label>
            <Input
              id="name"
              type="text"
              value={customerData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Tu nombre completo"
              className={`bg-gray-700 border-gray-600 text-white placeholder-gray-400 ${
                errors.name ? 'border-red-500' : 'focus:border-yellow-500'
              }`}
            />
            {errors.name && (
              <p className="text-red-400 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <Label htmlFor="email" className="text-white flex items-center mb-2">
              <Mail className="h-4 w-4 mr-2 text-yellow-400" />
              Correo Electrónico
            </Label>
            <Input
              id="email"
              type="email"
              value={customerData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="tu@email.com"
              className={`bg-gray-700 border-gray-600 text-white placeholder-gray-400 ${
                errors.email ? 'border-red-500' : 'focus:border-yellow-500'
              }`}
            />
            {errors.email && (
              <p className="text-red-400 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <Label htmlFor="phone" className="text-white flex items-center mb-2">
              <Phone className="h-4 w-4 mr-2 text-yellow-400" />
              Teléfono
            </Label>
            <Input
              id="phone"
              type="tel"
              value={customerData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="+54 9 11 1234-5678"
              className={`bg-gray-700 border-gray-600 text-white placeholder-gray-400 ${
                errors.phone ? 'border-red-500' : 'focus:border-yellow-500'
              }`}
            />
            {errors.phone && (
              <p className="text-red-400 text-sm mt-1">{errors.phone}</p>
            )}
          </div>
        </div>

        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
          <p className="text-yellow-200 text-sm">
            <strong>📧 Importante:</strong> Te enviaremos la confirmación de tu reserva por email. 
            Asegúrate de que tu correo sea correcto.
          </p>
        </div>

        <div className="flex justify-between pt-6">
          <Button
            type="button"
            onClick={onBack}
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-600"
          >
            Volver
          </Button>
          <Button
            type="submit"
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold"
          >
            Continuar al Pago
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CustomerForm;
