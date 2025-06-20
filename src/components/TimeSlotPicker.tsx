
import { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TimeSlot } from '@/pages/Index';

interface TimeSlotPickerProps {
  selectedDate: string;
  selectedTime: string;
  onDateSelect: (date: string) => void;
  onTimeSelect: (time: string) => void;
  onNext: () => void;
  onBack: () => void;
}

const TimeSlotPicker = ({
  selectedDate,
  selectedTime,
  onDateSelect,
  onTimeSelect,
  onNext,
  onBack
}: TimeSlotPickerProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Generate available time slots
  const timeSlots: TimeSlot[] = [
    { time: '09:00', available: true },
    { time: '09:30', available: true },
    { time: '10:00', available: false },
    { time: '10:30', available: true },
    { time: '11:00', available: true },
    { time: '11:30', available: true },
    { time: '12:00', available: false },
    { time: '14:00', available: true },
    { time: '14:30', available: true },
    { time: '15:00', available: true },
    { time: '15:30', available: false },
    { time: '16:00', available: true },
    { time: '16:30', available: true },
    { time: '17:00', available: true },
    { time: '17:30', available: true },
    { time: '18:00', available: true }
  ];

  // Generate calendar days
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dayDate = new Date(year, month, day);
      const dateString = dayDate.toISOString().split('T')[0];
      const isToday = dayDate.toDateString() === new Date().toDateString();
      const isPast = dayDate < new Date(new Date().setHours(0, 0, 0, 0));
      
      days.push({
        day,
        date: dateString,
        isToday,
        isPast,
        isSelected: selectedDate === dateString
      });
    }
    
    return days;
  };

  const days = getDaysInMonth(currentDate);
  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  return (
    <div className="space-y-8">
      {/* Calendar */}
      <div className="bg-gray-700/30 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-yellow-400" />
            Selecciona la Fecha
          </h3>
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => navigateMonth('prev')}
              variant="outline"
              size="sm"
              className="border-gray-600 text-gray-300"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-white font-semibold min-w-[150px] text-center">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </span>
            <Button
              onClick={() => navigateMonth('next')}
              variant="outline"
              size="sm"
              className="border-gray-600 text-gray-300"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2 mb-4">
          {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
            <div key={day} className="text-center text-gray-400 font-semibold py-2">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {days.map((day, index) => (
            <div key={index} className="aspect-square">
              {day && (
                <button
                  onClick={() => !day.isPast && onDateSelect(day.date)}
                  disabled={day.isPast}
                  className={`w-full h-full rounded-lg transition-all duration-200 ${
                    day.isPast
                      ? 'text-gray-600 cursor-not-allowed'
                      : day.isSelected
                      ? 'bg-yellow-500 text-black font-bold'
                      : day.isToday
                      ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500'
                      : 'text-white hover:bg-gray-600'
                  }`}
                >
                  {day.day}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Time Slots */}
      {selectedDate && (
        <div className="bg-gray-700/30 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">Horarios Disponibles</h3>
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {timeSlots.map((slot) => (
              <button
                key={slot.time}
                onClick={() => slot.available && onTimeSelect(slot.time)}
                disabled={!slot.available}
                className={`py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
                  !slot.available
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : selectedTime === slot.time
                    ? 'bg-yellow-500 text-black'
                    : 'bg-gray-600 text-white hover:bg-yellow-400 hover:text-black'
                }`}
              >
                {slot.time}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-6">
        <Button
          onClick={onBack}
          variant="outline"
          className="border-gray-600 text-gray-300 hover:bg-gray-600"
        >
          Volver
        </Button>
        <Button
          onClick={onNext}
          disabled={!selectedDate || !selectedTime}
          className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continuar con Datos
        </Button>
      </div>
    </div>
  );
};

export default TimeSlotPicker;
