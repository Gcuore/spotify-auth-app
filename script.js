const clientId = '65cdc10a96b14d8383f2f947b12948d1';
const redirectUri = 'https://gcuore.github.io/spotify-auth-app/callback.html'; // your GitHub Pages URL
const scopes = [
  'user-read-private',
  'user-read-email'
];

function loginWithSpotify() {
  const authUrl = `https://accounts.spotify.com/authorize` +
    `?client_id=${clientId}` +
    `&response_type=token` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&scope=${encodeURIComponent(scopes.join(' '))}`;
  window.location.href = authUrl;
}

// After redirect back
window.addEventListener('load', () => {
  const token = localStorage.getItem('spotify_access_token');
  if (token) {
    fetch('https://api.spotify.com/v1/me', {
      headers: {
        Authorization: 'Bearer ' + token
      }
    })
      .then(res => res.json())
      .then(profile => {
        document.getElementById('profile').innerHTML = `
          <p><strong>Logged in as:</strong> ${profile.display_name}</p>
          <p><strong>Email:</strong> ${profile.email}</p>
          <img src="${profile.images[0]?.url || ''}" width="100" />
        `;
      })
      .catch(err => console.error(err));
  }
});
