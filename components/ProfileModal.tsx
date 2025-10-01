import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { UserProfile } from '../types';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProfile: UserProfile | null;
  onProfileUpdate: (profile: UserProfile) => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, currentProfile, onProfileUpdate }) => {
  const { user } = useAuth();
  const [nickname, setNickname] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && currentProfile) {
      setNickname(currentProfile.nickname);
    } else if (isOpen && !currentProfile) {
      setNickname('');
    }
  }, [isOpen, currentProfile]);

  const handleSave = async () => {
    if (!user) return;
    if (!nickname.trim()) {
      setError('Il nickname non può essere vuoto');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (currentProfile) {
        // Update existing profile
        const { data, error: updateError } = await supabase
          .from('profiles')
          .update({ nickname: nickname.trim(), updated_at: new Date().toISOString() })
          .eq('id', user.id)
          .select()
          .single();

        if (updateError) throw updateError;
        if (data) onProfileUpdate(data);
      } else {
        // Insert new profile
        const { data, error: insertError } = await supabase
          .from('profiles')
          .insert({ id: user.id, nickname: nickname.trim() })
          .select()
          .single();

        if (insertError) throw insertError;
        if (data) onProfileUpdate(data);
      }

      onClose();
    } catch (err: any) {
      if (err.code === '23505') {
        setError('Questo nickname è già in uso');
      } else {
        setError('Errore nel salvare il profilo');
      }
      console.error('Error saving profile:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-lg p-6 max-w-md w-full">
        <h2 className="text-2xl font-bold text-white mb-4">
          {currentProfile ? 'Modifica Profilo' : 'Crea Profilo'}
        </h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Nickname
          </label>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="w-full px-3 py-2 bg-slate-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder="Inserisci il tuo nickname"
            maxLength={30}
          />
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-700 text-white rounded-md hover:bg-slate-600"
            disabled={loading}
          >
            Annulla
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-red-800 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? 'Salvataggio...' : 'Salva'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
