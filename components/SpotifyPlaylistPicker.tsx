import React, { useState, useEffect } from 'react';
import { X, Music, Search as SearchIcon, Loader } from 'lucide-react';
import { searchSpotifyPlaylists, formatPlaylistForDisplay, getSpotifyAuthUrl } from '../utils/spotifyClient';

interface SpotifyPlaylistPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (playlist: { id: string; name: string; url: string; image: string }) => void;
  spotifyToken: string | null;
  onLoginRequired: () => void;
}

const SpotifyPlaylistPicker: React.FC<SpotifyPlaylistPickerProps> = ({
  isOpen,
  onClose,
  onSelect,
  spotifyToken,
  onLoginRequired,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    setError(null);

    if (!query.trim()) {
      setPlaylists([]);
      return;
    }

    if (!spotifyToken) {
      onLoginRequired();
      return;
    }

    setIsLoading(true);
    try {
      const results = await searchSpotifyPlaylists(query, spotifyToken, 15);
      setPlaylists(results);
    } catch (err: any) {
      setError(err.message || 'Errore nella ricerca');
      if (err.message.includes('token expired')) {
        onLoginRequired();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectPlaylist = (playlist: any) => {
    const formatted = formatPlaylistForDisplay(playlist);
    onSelect(formatted);
    onClose();
    setSearchQuery('');
    setPlaylists([]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-[#1a1a1a] rounded-lg w-full max-w-2xl max-h-[80vh] flex flex-col border border-slate-700">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <div className="flex items-center gap-2">
            <Music className="w-5 h-5 text-green-500" />
            <h2 className="text-xl font-bold text-white">Seleziona Playlist Spotify</h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Search Input */}
        <div className="p-4 border-b border-slate-700">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
            <input
              type="text"
              placeholder="Cerca playlist..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              autoFocus
              className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {!spotifyToken ? (
            <div className="flex flex-col items-center justify-center py-12 gap-4">
              <Music className="w-12 h-12 text-slate-600" />
              <p className="text-slate-400 text-center">
                Devi connettere il tuo account Spotify per cercare playlist
              </p>
              <a
                href={getSpotifyAuthUrl()}
                className="px-6 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition-colors"
              >
                Connetti Spotify
              </a>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-12">
              <p className="text-red-500 text-center">{error}</p>
            </div>
          ) : isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader className="w-8 h-8 text-green-500 animate-spin" />
              <p className="text-slate-400 mt-2">Ricerca in corso...</p>
            </div>
          ) : searchQuery.trim() && playlists.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Music className="w-12 h-12 text-slate-600 mb-3" />
              <p className="text-slate-400">Nessuna playlist trovata</p>
            </div>
          ) : playlists.length > 0 ? (
            <div className="space-y-2">
              {playlists.map((playlist) => (
                <div
                  key={playlist.id}
                  onClick={() => handleSelectPlaylist(playlist)}
                  className="flex items-center gap-3 p-3 bg-slate-800/50 hover:bg-slate-800 rounded-lg cursor-pointer transition-colors border border-slate-700"
                >
                  {/* Playlist Image */}
                  {playlist.images[0] && (
                    <img
                      src={playlist.images[0].url}
                      alt={playlist.name}
                      className="w-12 h-12 rounded"
                    />
                  )}

                  {/* Playlist Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white truncate">{playlist.name}</h3>
                    <p className="text-xs text-slate-400 truncate">
                      di {playlist.owner.display_name}
                    </p>
                  </div>

                  {/* Play Icon */}
                  <Music className="w-5 h-5 text-green-500 flex-shrink-0" />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <Music className="w-12 h-12 text-slate-600 mb-3" />
              <p className="text-slate-400">Inizia a cercare una playlist</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-700">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-slate-800 text-white rounded-md hover:bg-slate-700 transition-colors"
          >
            Chiudi
          </button>
        </div>
      </div>
    </div>
  );
};

export default SpotifyPlaylistPicker;
