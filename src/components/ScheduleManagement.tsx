
import { useState, useEffect } from 'react';
import { Plus, Trash2, Save, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface TimeSlot {
  time: string;
  available: boolean;
}

interface WorkingHours {
  start: string;
  end: string;
  breakStart?: string;
  breakEnd?: string;
}

const ScheduleManagement = () => {
  const [workingHours, setWorkingHours] = useState<WorkingHours>({
    start: '09:00',
    end: '18:00',
    breakStart: '13:00',
    breakEnd: '14:00'
  });
  const [slotDuration, setSlotDuration] = useState(30);
  const [customSlots, setCustomSlots] = useState<string[]>([]);
  const [newSlot, setNewSlot] = useState('');

  useEffect(() => {
    // Cargar configuración desde localStorage
    const savedConfig = localStorage.getItem('barber_schedule_config');
    if (savedConfig) {
      const config = JSON.parse(savedConfig);
      setWorkingHours(config.workingHours || workingHours);
      setSlotDuration(config.slotDuration || 30);
      setCustomSlots(config.customSlots || []);
    }
  }, []);

  const saveConfiguration = () => {
    const config = {
      workingHours,
      slotDuration,
      customSlots
    };
    localStorage.setItem('barber_schedule_config', JSON.stringify(config));
    
    // Generar y guardar los slots de tiempo
    const generatedSlots = generateTimeSlots();
    localStorage.setItem('barber_time_slots', JSON.stringify(generatedSlots));
    
    alert('Configuración guardada exitosamente');
  };

  const generateTimeSlots = (): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    const startTime = new Date(`2024-01-01 ${workingHours.start}`);
    const endTime = new Date(`2024-01-01 ${workingHours.end}`);
    const breakStart = workingHours.breakStart ? new Date(`2024-01-01 ${workingHours.breakStart}`) : null;
    const breakEnd = workingHours.breakEnd ? new Date(`2024-01-01 ${workingHours.breakEnd}`) : null;

    let currentTime = new Date(startTime);
    
    while (currentTime < endTime) {
      const timeString = currentTime.toTimeString().slice(0, 5);
      
      // Verificar si está en horario de descanso
      const isBreakTime = breakStart && breakEnd && 
        currentTime >= breakStart && currentTime < breakEnd;
      
      if (!isBreakTime) {
        slots.push({
          time: timeString,
          available: true
        });
      }
      
      currentTime.setMinutes(currentTime.getMinutes() + slotDuration);
    }

    // Agregar slots personalizados
    customSlots.forEach(slot => {
      if (!slots.find(s => s.time === slot)) {
        slots.push({
          time: slot,
          available: true
        });
      }
    });

    return slots.sort((a, b) => a.time.localeCompare(b.time));
  };

  const addCustomSlot = () => {
    if (newSlot && !customSlots.includes(newSlot)) {
      setCustomSlots([...customSlots, newSlot]);
      setNewSlot('');
    }
  };

  const removeCustomSlot = (slot: string) => {
    setCustomSlots(customSlots.filter(s => s !== slot));
  };

  const previewSlots = generateTimeSlots();

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-white">Gestión de Horarios</h3>

      {/* Working Hours Configuration */}
      <div className="bg-gray-700 rounded-lg p-6 space-y-4">
        <h4 className="text-lg font-semibold text-white">Horarios de Trabajo</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-gray-300">Hora de Inicio</Label>
            <Input
              type="time"
              value={workingHours.start}
              onChange={(e) => setWorkingHours({ ...workingHours, start: e.target.value })}
              className="bg-gray-600 border-gray-500 text-white"
            />
          </div>
          <div>
            <Label className="text-gray-300">Hora de Fin</Label>
            <Input
              type="time"
              value={workingHours.end}
              onChange={(e) => setWorkingHours({ ...workingHours, end: e.target.value })}
              className="bg-gray-600 border-gray-500 text-white"
            />
          </div>
          <div>
            <Label className="text-gray-300">Inicio de Descanso (Opcional)</Label>
            <Input
              type="time"
              value={workingHours.breakStart || ''}
              onChange={(e) => setWorkingHours({ ...workingHours, breakStart: e.target.value })}
              className="bg-gray-600 border-gray-500 text-white"
            />
          </div>
          <div>
            <Label className="text-gray-300">Fin de Descanso (Opcional)</Label>
            <Input
              type="time"
              value={workingHours.breakEnd || ''}
              onChange={(e) => setWorkingHours({ ...workingHours, breakEnd: e.target.value })}
              className="bg-gray-600 border-gray-500 text-white"
            />
          </div>
        </div>
      </div>

      {/* Slot Duration */}
      <div className="bg-gray-700 rounded-lg p-6 space-y-4">
        <h4 className="text-lg font-semibold text-white">Duración de Turnos</h4>
        <div className="w-full md:w-1/3">
          <Label className="text-gray-300">Minutos por turno</Label>
          <Input
            type="number"
            value={slotDuration}
            onChange={(e) => setSlotDuration(Number(e.target.value))}
            className="bg-gray-600 border-gray-500 text-white"
            min="15"
            max="120"
            step="15"
          />
        </div>
      </div>

      {/* Custom Slots */}
      <div className="bg-gray-700 rounded-lg p-6 space-y-4">
        <h4 className="text-lg font-semibold text-white">Horarios Personalizados</h4>
        <div className="flex gap-2">
          <Input
            type="time"
            value={newSlot}
            onChange={(e) => setNewSlot(e.target.value)}
            placeholder="Agregar horario específico"
            className="bg-gray-600 border-gray-500 text-white"
          />
          <Button onClick={addCustomSlot} className="bg-yellow-500 hover:bg-yellow-600 text-black">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        {customSlots.length > 0 && (
          <div className="space-y-2">
            <p className="text-gray-300 text-sm">Horarios personalizados:</p>
            <div className="flex flex-wrap gap-2">
              {customSlots.map((slot) => (
                <div key={slot} className="flex items-center bg-gray-600 rounded px-3 py-1">
                  <Clock className="h-3 w-3 text-yellow-400 mr-2" />
                  <span className="text-white text-sm">{slot}</span>
                  <Button
                    onClick={() => removeCustomSlot(slot)}
                    size="sm"
                    variant="ghost"
                    className="ml-2 h-4 w-4 p-0 text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Preview */}
      <div className="bg-gray-700 rounded-lg p-6 space-y-4">
        <h4 className="text-lg font-semibold text-white">Vista Previa de Horarios</h4>
        <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
          {previewSlots.map((slot) => (
            <div key={slot.time} className="bg-gray-600 rounded px-2 py-1 text-center">
              <span className="text-white text-xs">{slot.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={saveConfiguration} className="bg-green-500 hover:bg-green-600">
          <Save className="h-4 w-4 mr-2" />
          Guardar Configuración
        </Button>
      </div>
    </div>
  );
};

export default ScheduleManagement;
