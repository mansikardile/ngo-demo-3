import React, { useState } from 'react';
import { X, QrCode, Building, Calendar, MapPin, Check, AlertTriangle, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MOCK_EVENTS } from '../../data/mockData';

export const EventSelectorModal: React.FC = () => {
  const { 
    isEventModalOpen, 
    setIsEventModalOpen, 
    currentEvent, 
    selectEventById,
    navigateTo 
  } = useApp();

  const [customEventCode, setCustomEventCode] = useState('');

  if (!isEventModalOpen) return null;

  const handleSelect = (eventId: string) => {
    selectEventById(eventId);
    setIsEventModalOpen(false);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEventCode.trim()) return;
    selectEventById(customEventCode.trim());
    setIsEventModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-rose-100 flex items-center justify-center text-rose-800">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Simulate Campus Outreach Event QR</h3>
              <p className="text-xs text-slate-500">Test different college drives and error handling states</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsEventModalOpen(false)}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          
          {/* Custom QR URL Input */}
          <form onSubmit={handleCustomSubmit} className="space-y-2">
            <label className="text-xs font-semibold text-slate-700">Enter custom Event ID / QR Code:</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={customEventCode}
                onChange={e => setCustomEventCode(e.target.value)}
                placeholder="e.g. EVT-MIT-2026-001 or EVT-INVALID-123"
                className="flex-1 px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:border-rose-700 focus:ring-2 focus:ring-rose-100 outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold text-white bg-rose-800 hover:bg-rose-900 rounded-lg transition"
              >
                Load Event
              </button>
            </div>
          </form>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink mx-3 text-xs font-medium text-slate-400 uppercase tracking-wider">
              Or pick a preset college drive
            </span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          {/* Event Cards List */}
          <div className="grid gap-3">
            {MOCK_EVENTS.map(event => {
              const isSelected = currentEvent?.id === event.id;
              const isActive = event.status === 'active';

              return (
                <div
                  key={event.id}
                  onClick={() => handleSelect(event.id)}
                  className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                    isSelected
                      ? 'border-rose-700 bg-rose-50/50 ring-2 ring-rose-600/20'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 text-[11px] font-mono font-bold bg-slate-100 text-slate-700 rounded border border-slate-200">
                          {event.code}
                        </span>
                        {isActive ? (
                          <span className="px-2 py-0.5 text-[11px] font-semibold bg-emerald-100 text-emerald-800 rounded-full">
                            Active Drive
                          </span>
                        ) : event.status === 'expired' ? (
                          <span className="px-2 py-0.5 text-[11px] font-semibold bg-amber-100 text-amber-800 rounded-full flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" /> Expired Event
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 text-[11px] font-semibold bg-slate-100 text-slate-600 rounded-full">
                            Inactive / Draft
                          </span>
                        )}
                      </div>

                      <h4 className="text-sm font-bold text-slate-900">{event.collegeName}</h4>
                      <p className="text-xs text-slate-600 font-medium">{event.title}</p>
                      
                      <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          {event.date} ({event.time})
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          {event.city}, {event.state}
                        </span>
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center pt-1">
                      {isSelected ? (
                        <div className="w-6 h-6 rounded-full bg-rose-800 text-white flex items-center justify-center">
                          <Check className="w-4 h-4" />
                        </div>
                      ) : (
                        <ArrowRight className="w-5 h-5 text-slate-400" />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            type="button"
            onClick={() => setIsEventModalOpen(false)}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
