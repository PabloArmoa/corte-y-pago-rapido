
import { useState } from 'react';
import { Check, Clock, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Service } from '@/pages/Index';

const services: Service[] = [
  {
    id: '1',
    name: 'Corte Clásico',
    price: 15000,
    duration: 30,
    description: 'Corte tradicional con tijeras y máquina',
    image: '/placeholder.svg'
  },
  {
    id: '2',
    name: 'Fade Moderno',
    price: 20000,
    duration: 45,
    description: 'Degradado moderno con terminaciones perfectas',
    image: '/placeholder.svg'
  },
  {
    id: '3',
    name: 'Corte + Barba',
    price: 25000,
    duration: 60,
    description: 'Servicio completo de corte y arreglo de barba',
    image: '/placeholder.svg'
  },
  {
    id: '4',
    name: 'Degradado Premium',
    price: 22000,
    duration: 50,
    description: 'Degradado de alta precisión con detalles',
    image: '/placeholder.svg'
  },
  {
    id: '5',
    name: 'Corte Niños',
    price: 12000,
    duration: 25,
    description: 'Corte especial para los más pequeños',
    image: '/placeholder.svg'
  },
  {
    id: '6',
    name: 'Arreglo de Cejas',
    price: 8000,
    duration: 15,
    description: 'Perfilado y arreglo profesional de cejas',
    image: '/placeholder.svg'
  }
];

interface ServiceSelectionProps {
  selectedService: Service | null;
  onServiceSelect: (service: Service) => void;
  onNext: () => void;
}

const ServiceSelection = ({ selectedService, onServiceSelect, onNext }: ServiceSelectionProps) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <div
            key={service.id}
            onClick={() => onServiceSelect(service)}
            className={`relative bg-gray-700/50 rounded-xl p-6 cursor-pointer transition-all duration-300 hover:scale-105 border-2 ${
              selectedService?.id === service.id
                ? 'border-yellow-500 bg-yellow-500/10'
                : 'border-gray-600 hover:border-yellow-400'
            }`}
          >
            {selectedService?.id === service.id && (
              <div className="absolute top-4 right-4 bg-yellow-500 text-black rounded-full p-1">
                <Check className="h-4 w-4" />
              </div>
            )}
            
            <div className="mb-4">
              <img
                src={service.image}
                alt={service.name}
                className="w-full h-32 object-cover rounded-lg bg-gray-600"
              />
            </div>

            <h3 className="text-xl font-bold text-white mb-2">{service.name}</h3>
            <p className="text-gray-400 text-sm mb-4">{service.description}</p>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-yellow-400">
                <DollarSign className="h-4 w-4" />
                <span className="font-bold">${service.price.toLocaleString()}</span>
              </div>
              <div className="flex items-center space-x-1 text-gray-400">
                <Clock className="h-4 w-4" />
                <span className="text-sm">{service.duration} min</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center pt-6">
        <Button
          onClick={onNext}
          disabled={!selectedService}
          className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-8 py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continuar con la Fecha
        </Button>
      </div>
    </div>
  );
};

export default ServiceSelection;
