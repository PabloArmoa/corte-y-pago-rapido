
import { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, Clock, User, Phone, Mail, CreditCard, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Booking } from '@/pages/Index';

interface AdminPanelProps {
  onBack: () => void;
}

const AdminPanel = ({ onBack }: AdminPanelProps) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');

  useEffect(() => {
    // Cargar reservas desde localStorage
    const savedBookings = JSON.parse(localStorage.getItem('barber_bookings') || '[]');
    setBookings(savedBookings);
    setFilteredBookings(savedBookings);
  }, []);

  useEffect(() => {
    // Filtrar reservas
    let filtered = bookings;

    if (searchTerm) {
      filtered = filtered.filter(booking =>
        booking.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.service.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(booking => booking.status === statusFilter);
    }

    if (dateFilter !== 'all') {
      const today = new Date();
      const filterDate = new Date(today);
      
      if (dateFilter === 'today') {
        filterDate.setHours(0, 0, 0, 0);
        const tomorrow = new Date(filterDate);
        tomorrow.setDate(tomorrow.getDate() + 1);
        filtered = filtered.filter(booking => {
          const bookingDate = new Date(booking.date);
          return bookingDate >= filterDate && bookingDate < tomorrow;
        });
      } else if (dateFilter === 'week') {
        const weekFromNow = new Date(today);
        weekFromNow.setDate(weekFromNow.getDate() + 7);
        filtered = filtered.filter(booking => {
          const bookingDate = new Date(booking.date);
          return bookingDate >= today && bookingDate <= weekFromNow;
        });
      }
    }

    setFilteredBookings(filtered);
  }, [bookings, searchTerm, statusFilter, dateFilter]);

  const updateBookingStatus = (bookingId: string, newStatus: Booking['status']) => {
    const updatedBookings = bookings.map(booking =>
      booking.id === bookingId ? { ...booking, status: newStatus } : booking
    );
    setBookings(updatedBookings);
    localStorage.setItem('barber_bookings', JSON.stringify(updatedBookings));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'text-green-400 bg-green-400/20';
      case 'pending': return 'text-yellow-400 bg-yellow-400/20';
      case 'completed': return 'text-blue-400 bg-blue-400/20';
      case 'cancelled': return 'text-red-400 bg-red-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    return status === 'paid' 
      ? 'text-green-400 bg-green-400/20' 
      : 'text-orange-400 bg-orange-400/20';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-AR', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getTotalRevenue = () => {
    return filteredBookings
      .filter(booking => booking.paymentStatus === 'paid')
      .reduce((total, booking) => total + booking.service.price, 0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Header */}
      <header className="bg-black/50 backdrop-blur-md border-b border-yellow-500/20">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                onClick={onBack}
                variant="outline"
                size="sm"
                className="border-gray-600 text-gray-300"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-white">Panel de Administración</h1>
                <p className="text-yellow-400">Gestión de reservas</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700/50">
            <h3 className="text-gray-400 text-sm">Total Reservas</h3>
            <p className="text-2xl font-bold text-white">{filteredBookings.length}</p>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700/50">
            <h3 className="text-gray-400 text-sm">Reservas Hoy</h3>
            <p className="text-2xl font-bold text-white">
              {filteredBookings.filter(b => b.date === new Date().toISOString().split('T')[0]).length}
            </p>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700/50">
            <h3 className="text-gray-400 text-sm">Ingresos (Filtrados)</h3>
            <p className="text-2xl font-bold text-yellow-400">
              ${getTotalRevenue().toLocaleString()}
            </p>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700/50">
            <h3 className="text-gray-400 text-sm">Pagos Pendientes</h3>
            <p className="text-2xl font-bold text-orange-400">
              {filteredBookings.filter(b => b.paymentStatus === 'pending').length}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700/50 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar por nombre, email o servicio..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-700 border-gray-600 text-white"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48 bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600">
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="pending">Pendiente</SelectItem>
                <SelectItem value="confirmed">Confirmado</SelectItem>
                <SelectItem value="completed">Completado</SelectItem>
                <SelectItem value="cancelled">Cancelado</SelectItem>
              </SelectContent>
            </Select>
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-48 bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder="Fecha" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600">
                <SelectItem value="all">Todas las fechas</SelectItem>
                <SelectItem value="today">Hoy</SelectItem>
                <SelectItem value="week">Esta semana</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Bookings List */}
        <div className="space-y-4">
          {filteredBookings.length === 0 ? (
            <div className="bg-gray-800/50 rounded-lg p-8 text-center border border-gray-700/50">
              <p className="text-gray-400">No hay reservas que coincidan con los filtros.</p>
            </div>
          ) : (
            filteredBookings.map((booking) => (
              <div key={booking.id} className="bg-gray-800/50 rounded-lg p-6 border border-gray-700/50">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  {/* Customer Info */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-yellow-400" />
                      <span className="text-white font-semibold">{booking.customerName}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-400">
                      <Mail className="h-3 w-3" />
                      <span>{booking.customerEmail}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-400">
                      <Phone className="h-3 w-3" />
                      <span>{booking.customerPhone}</span>
                    </div>
                  </div>

                  {/* Service & DateTime */}
                  <div className="space-y-2">
                    <h4 className="text-white font-semibold">{booking.service.name}</h4>
                    <div className="flex items-center space-x-2 text-sm text-gray-400">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(booking.date)}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-400">
                      <Clock className="h-3 w-3" />
                      <span>{booking.time} hs ({booking.service.duration} min)</span>
                    </div>
                  </div>

                  {/* Status & Payment */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(booking.status)}`}>
                        {booking.status === 'confirmed' && 'Confirmado'}
                        {booking.status === 'pending' && 'Pendiente'}
                        {booking.status === 'completed' && 'Completado'}
                        {booking.status === 'cancelled' && 'Cancelado'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CreditCard className="h-3 w-3 text-gray-400" />
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getPaymentStatusColor(booking.paymentStatus)}`}>
                        {booking.paymentStatus === 'paid' ? 'Pagado' : 'Pendiente'}
                      </span>
                    </div>
                    <div className="text-yellow-400 font-bold">
                      ${booking.service.price.toLocaleString()}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col space-y-2">
                    <Select
                      value={booking.status}
                      onValueChange={(value) => updateBookingStatus(booking.id, value as Booking['status'])}
                    >
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-700 border-gray-600">
                        <SelectItem value="pending">Pendiente</SelectItem>
                        <SelectItem value="confirmed">Confirmado</SelectItem>
                        <SelectItem value="completed">Completado</SelectItem>
                        <SelectItem value="cancelled">Cancelado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
