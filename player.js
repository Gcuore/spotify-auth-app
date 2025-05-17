const clientId = '65cdc10a96b14d8383f2f947b12948d1';
const redirectUri = 'https://gcuore.github.io/spotify-auth-app/callback.html';
const scopes = ['streaming', 'user-read-email', 'user-read-private'];

function loginWithSpotify() {
  const authUrl = `https://accounts.spotify.com/authorize` +
    `?client_id=${clientId}` +
    `&response_type=token` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&scope=${encodeURIComponent(scopes.join(' '))}`;
  window.location.href = authUrl;
}

window.onSpotifyWebPlaybackSDKReady = () => {
  const token = localStorage.getItem('spotify_access_token');
  if (!token) return;

  const player = new Spotify.Player({
    name: 'Gcuore Web Player',
    getOAuthToken: cb => { cb(token); },
    volume: 0.5
  });

  // Ready
  player.addListener('ready', ({ device_id }) => {
    document.getElementById('player-status').innerText = 'Player is ready! Device ID: ' + device_id;
    window.spotifyDeviceId = device_id;
  });

  player.addListener('not_ready', ({ device_id }) => {
    document.getElementById('player-status').innerText = 'Device ID has gone offline ' + device_id;
  });

  player.addListener('initialization_error', ({ message }) => {
    console.error(message);
  });

  player.addListener('authentication_error', ({ message }) => {
    console.error(message);
  });

  player.connect();

  // Fetch profile
  fetch('https://api.spotify.com/v1/me', {
    headers: { Authorization: 'Bearer ' + token }
  })
    .then(res => res.json())
    .then(profile => {
      document.getElementById('profile').innerHTML = \`
        <p><strong>Logged in as:</strong> \${profile.display_name}</p>
        <p><strong>Email:</strong> \${profile.email}</p>
      \`;
    });
};

function play() {
  const token = localStorage.getItem('spotify_access_token');
  const device_id = window.spotifyDeviceId;
  if (!token || !device_id) {
    alert('Player not ready or token missing!');
    return;
  }

  fetch('https://api.spotify.com/v1/me/player/play?device_id=' + device_id, {
    method: 'PUT',
    body: JSON.stringify({ uris: ['spotify:track:7GhIk7Il098yCjg4BQjzvb'] }), // Example: Rick Astley - Never Gonna Give You Up
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    },
  });
}
