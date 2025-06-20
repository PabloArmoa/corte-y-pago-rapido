
import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Service } from '@/pages/Index';

interface ServiceManagementProps {
  onServicesUpdate: (services: Service[]) => void;
}

const ServiceManagement = ({ onServicesUpdate }: ServiceManagementProps) => {
  const [services, setServices] = useState<Service[]>([]);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [newService, setNewService] = useState({
    name: '',
    price: 0,
    duration: 0,
    description: ''
  });
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    // Cargar servicios desde localStorage o usar valores por defecto
    const savedServices = localStorage.getItem('barber_services');
    if (savedServices) {
      setServices(JSON.parse(savedServices));
    } else {
      const defaultServices: Service[] = [
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
      setServices(defaultServices);
      localStorage.setItem('barber_services', JSON.stringify(defaultServices));
    }
  }, []);

  const saveServices = (updatedServices: Service[]) => {
    setServices(updatedServices);
    localStorage.setItem('barber_services', JSON.stringify(updatedServices));
    onServicesUpdate(updatedServices);
  };

  const handleEditService = (service: Service) => {
    setEditingService({ ...service });
  };

  const handleSaveEdit = () => {
    if (!editingService) return;
    
    const updatedServices = services.map(service =>
      service.id === editingService.id ? editingService : service
    );
    saveServices(updatedServices);
    setEditingService(null);
  };

  const handleDeleteService = (serviceId: string) => {
    const updatedServices = services.filter(service => service.id !== serviceId);
    saveServices(updatedServices);
  };

  const handleAddService = () => {
    if (!newService.name || !newService.price || !newService.duration) return;

    const service: Service = {
      id: Date.now().toString(),
      name: newService.name,
      price: newService.price,
      duration: newService.duration,
      description: newService.description,
      image: '/placeholder.svg'
    };

    const updatedServices = [...services, service];
    saveServices(updatedServices);
    setNewService({ name: '', price: 0, duration: 0, description: '' });
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-white">Gestión de Servicios</h3>
        <Button
          onClick={() => setShowAddForm(true)}
          className="bg-yellow-500 hover:bg-yellow-600 text-black"
        >
          <Plus className="h-4 w-4 mr-2" />
          Agregar Servicio
        </Button>
      </div>

      {/* Add Service Form */}
      {showAddForm && (
        <div className="bg-gray-700 rounded-lg p-6 space-y-4">
          <h4 className="text-lg font-semibold text-white">Nuevo Servicio</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-gray-300">Nombre</Label>
              <Input
                value={newService.name}
                onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                className="bg-gray-600 border-gray-500 text-white"
              />
            </div>
            <div>
              <Label className="text-gray-300">Precio ($)</Label>
              <Input
                type="number"
                value={newService.price}
                onChange={(e) => setNewService({ ...newService, price: Number(e.target.value) })}
                className="bg-gray-600 border-gray-500 text-white"
              />
            </div>
            <div>
              <Label className="text-gray-300">Duración (min)</Label>
              <Input
                type="number"
                value={newService.duration}
                onChange={(e) => setNewService({ ...newService, duration: Number(e.target.value) })}
                className="bg-gray-600 border-gray-500 text-white"
              />
            </div>
            <div>
              <Label className="text-gray-300">Descripción</Label>
              <Input
                value={newService.description}
                onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                className="bg-gray-600 border-gray-500 text-white"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleAddService} className="bg-green-500 hover:bg-green-600">
              <Save className="h-4 w-4 mr-2" />
              Guardar
            </Button>
            <Button onClick={() => setShowAddForm(false)} variant="outline">
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
          </div>
        </div>
      )}

      {/* Services List */}
      <div className="space-y-4">
        {services.map((service) => (
          <div key={service.id} className="bg-gray-700 rounded-lg p-4">
            {editingService?.id === service.id ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label className="text-gray-300">Nombre</Label>
                    <Input
                      value={editingService.name}
                      onChange={(e) => setEditingService({ ...editingService, name: e.target.value })}
                      className="bg-gray-600 border-gray-500 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">Precio ($)</Label>
                    <Input
                      type="number"
                      value={editingService.price}
                      onChange={(e) => setEditingService({ ...editingService, price: Number(e.target.value) })}
                      className="bg-gray-600 border-gray-500 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">Duración (min)</Label>
                    <Input
                      type="number"
                      value={editingService.duration}
                      onChange={(e) => setEditingService({ ...editingService, duration: Number(e.target.value) })}
                      className="bg-gray-600 border-gray-500 text-white"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-gray-300">Descripción</Label>
                  <Input
                    value={editingService.description}
                    onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                    className="bg-gray-600 border-gray-500 text-white"
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleSaveEdit} className="bg-green-500 hover:bg-green-600">
                    <Save className="h-4 w-4 mr-2" />
                    Guardar
                  </Button>
                  <Button onClick={() => setEditingService(null)} variant="outline">
                    <X className="h-4 w-4 mr-2" />
                    Cancelar
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-white font-semibold">{service.name}</h4>
                  <p className="text-gray-400 text-sm">{service.description}</p>
                  <div className="flex gap-4 mt-2">
                    <span className="text-yellow-400 font-bold">${service.price.toLocaleString()}</span>
                    <span className="text-gray-400">{service.duration} min</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleEditService(service)}
                    size="sm"
                    variant="outline"
                    className="border-gray-600"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={() => handleDeleteService(service.id)}
                    size="sm"
                    variant="outline"
                    className="border-red-600 text-red-400 hover:bg-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceManagement;
