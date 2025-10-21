/**
 * Spotify Web API Client
 * Handles searching and fetching Spotify playlists
 */

const SPOTIFY_API_BASE = 'https://api.spotify.com/v1';
const SPOTIFY_AUTH_URL = 'https://accounts.spotify.com/authorize';

interface SpotifyPlaylist {
  id: string;
  name: string;
  external_urls: {
    spotify: string;
  };
  images: Array<{
    url: string;
    height?: number;
    width?: number;
  }>;
  uri: string;
  owner: {
    display_name: string;
  };
}

interface SpotifySearchResponse {
  playlists: {
    items: SpotifyPlaylist[];
  };
}

/**
 * Get access token from localStorage
 */
export const getSpotifyToken = (): string | null => {
  return localStorage.getItem('spotify_access_token');
};

/**
 * Save access token to localStorage
 */
export const setSpotifyToken = (token: string, expiresIn: number) => {
  localStorage.setItem('spotify_access_token', token);
  // Store expiration time (now + expiresIn seconds)
  const expirationTime = new Date().getTime() + expiresIn * 1000;
  localStorage.setItem('spotify_token_expiration', expirationTime.toString());
};

/**
 * Check if token is expired
 */
export const isSpotifyTokenExpired = (): boolean => {
  const expirationTime = localStorage.getItem('spotify_token_expiration');
  if (!expirationTime) return true;
  return new Date().getTime() > parseInt(expirationTime);
};

/**
 * Clear stored token
 */
export const clearSpotifyToken = () => {
  localStorage.removeItem('spotify_access_token');
  localStorage.removeItem('spotify_token_expiration');
};

/**
 * Get Spotify authorization URL for login
 */
export const getSpotifyAuthUrl = (): string => {
  const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
  const redirectUri = import.meta.env.VITE_SPOTIFY_REDIRECT_URI;

  const scopes = [
    'user-read-private',
    'user-read-email',
    'playlist-read-public',
    'playlist-read-private',
  ];

  const params = new URLSearchParams({
    client_id: clientId,
    response_type: 'code',
    redirect_uri: redirectUri,
    scope: scopes.join(' '),
  });

  return `${SPOTIFY_AUTH_URL}?${params.toString()}`;
};

/**
 * Search for Spotify playlists
 */
export const searchSpotifyPlaylists = async (
  query: string,
  token: string,
  limit: number = 10
): Promise<SpotifyPlaylist[]> => {
  if (!query.trim()) return [];

  try {
    const params = new URLSearchParams({
      q: query,
      type: 'playlist',
      limit: limit.toString(),
    });

    const response = await fetch(`${SPOTIFY_API_BASE}/search?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Token expired
        clearSpotifyToken();
        throw new Error('Spotify token expired. Please login again.');
      }
      throw new Error(`Spotify API error: ${response.status}`);
    }

    const data: SpotifySearchResponse = await response.json();
    return data.playlists.items;
  } catch (error) {
    console.error('Error searching Spotify playlists:', error);
    throw error;
  }
};

/**
 * Get playlist details from ID
 */
export const getSpotifyPlaylistDetails = async (
  playlistId: string,
  token: string
): Promise<SpotifyPlaylist> => {
  try {
    const response = await fetch(`${SPOTIFY_API_BASE}/playlists/${playlistId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Spotify API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching playlist details:', error);
    throw error;
  }
};

/**
 * Format playlist for display
 */
export const formatPlaylistForDisplay = (playlist: SpotifyPlaylist) => {
  return {
    id: playlist.id,
    name: playlist.name,
    url: playlist.external_urls.spotify,
    uri: playlist.uri,
    image: playlist.images[0]?.url || '',
    owner: playlist.owner.display_name,
  };
};
