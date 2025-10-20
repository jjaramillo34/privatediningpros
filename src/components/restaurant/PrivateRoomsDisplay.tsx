'use client';

import { Users, DoorOpen, Sparkles } from 'lucide-react';

interface PrivateRoom {
  name: string;
  capacity: number;
  setup?: string;
  description: string;
}

interface PrivateRoomsDisplayProps {
  rooms: PrivateRoom[];
  restaurantName: string;
}

export default function PrivateRoomsDisplay({ rooms, restaurantName }: PrivateRoomsDisplayProps) {
  if (!rooms || rooms.length === 0) return null;

  const totalCapacity = rooms.reduce((sum, room) => sum + room.capacity, 0);

  return (
    <div>
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border-2 border-blue-200">
          <DoorOpen className="h-10 w-10 text-blue-600 mx-auto mb-3" />
          <p className="text-sm text-gray-600 font-medium mb-1">Total Rooms</p>
          <p className="text-4xl font-bold text-blue-600">{rooms.length}</p>
        </div>
        <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border-2 border-purple-200">
          <Users className="h-10 w-10 text-purple-600 mx-auto mb-3" />
          <p className="text-sm text-gray-600 font-medium mb-1">Combined Capacity</p>
          <p className="text-4xl font-bold text-purple-600">{totalCapacity}</p>
        </div>
        <div className="text-center p-6 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border-2 border-emerald-200">
          <Sparkles className="h-10 w-10 text-emerald-600 mx-auto mb-3" />
          <p className="text-sm text-gray-600 font-medium mb-1">Largest Room</p>
          <p className="text-4xl font-bold text-emerald-600">{Math.max(...rooms.map(r => r.capacity))}</p>
        </div>
      </div>

      {/* Room Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {rooms.map((room, index) => (
          <div 
            key={index} 
            className="group bg-white border-2 border-gray-200 rounded-2xl overflow-hidden hover:border-blue-300 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            {/* Room Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-5">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-white flex-1 pr-4">{room.name}</h3>
                <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 flex items-center">
                  <Users className="h-4 w-4 text-white mr-2" />
                  <span className="text-white font-bold">{room.capacity}</span>
                </div>
              </div>
            </div>

            {/* Room Content */}
            <div className="p-6 space-y-4">
              {/* Setup/Event Types */}
              {room.setup && (
                <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                  <p className="text-xs font-bold text-purple-900 mb-2 uppercase tracking-wide">Event Types</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{room.setup}</p>
                </div>
              )}

              {/* Features/Description */}
              {room.description && (
                <div>
                  <p className="text-xs font-bold text-gray-900 mb-2 uppercase tracking-wide">Features</p>
                  <div className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                    {room.description}
                  </div>
                </div>
              )}
            </div>

            {/* Room Footer */}
            <div className="px-6 pb-6">
              <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg p-3 text-center">
                <p className="text-xs text-gray-600">
                  Perfect for groups of <span className="font-bold text-blue-600">{room.capacity}</span> guests
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

