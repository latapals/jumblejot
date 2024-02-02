{
  let fragment = location.hash ? new URLSearchParams(location.hash.slice(1)) : null
  let accessToken, tokenType
  try {
    [accessToken, tokenType] = JSON.parse(localStorage.getItem("DISCORDLOGGEDINTHING"))
  } catch (err) {
    try {
      [accessToken, tokenType] = [fragment.get('access_token'), fragment.get('token_type')]
    } catch (err) {}
  }
  
  let generateRandomString = () => {
    let randomString = ""
    let randomNumber = Math.floor(Math.random() * 10)
    for (let i = 0; i < 20 + randomNumber; i++) {
      randomString += String.fromCharCode(33 + Math.floor(Math.random() * 94))
    }
    return randomString
  }
  
  if (!accessToken) {
    document.body.style.display = "none"
    let randomString = generateRandomString()
    localStorage.setItem('oauth-state', randomString)
    location.href = `https://discord.com/oauth2/authorize?client_id=924829035308146810&redirect_uri=https://snowtrail.jumblejot.pages.dev/app/&response_type=token&scope=identify%20email%20guilds&state=${btoa(randomString)}`
  }

  console.log(tokenType, accessToken)
  
  fetch('https://discord.com/api/users/@me/guilds', {
    headers: {
      authorization: `${tokenType} ${accessToken}`,
    },
  })
  .then(result => result.json())
  .then(response => {
    let hasTheServer = false
    response.forEach(server => {
      if (server.id == 872995599979520022 || server.id == 961704885957578762) {
        localStorage.setItem("DISCORDLOGGEDINTHING", JSON.stringify([accessToken, tokenType]))
        document.body.style.display = null
        hasTheServer = true
        if (fragment) location.href = "/app"
      }
    })
    if (!hasTheServer) {
      alert("You need to join the Latapals server and then come back to this page.")
      location.href = "https://discord.gg/ZYwF9q8ChB"
    }
  })
  .catch(err => {
    if (localStorage.hasOwnProperty("DISCORDLOGGEDINTHING")) localStorage.removeItem("DISCORDLOGGEDINTHING")
  })
}