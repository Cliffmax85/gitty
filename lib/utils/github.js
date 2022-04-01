const fetch = require('cross-fetch');

const exchangeCodeForToken = async (code) => {
    const response = await fetch('/https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'content-type': 'application/json'
        },
        body: JSON.stringify({
            client_id: process.env.CLIENT_ID,
            client_secret:process.env.CLIENT_SECRET,
            code,
        })
    });

    const { tokenResp } = await response.json();

    return tokenResp;
}