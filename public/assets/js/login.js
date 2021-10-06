const { bootstrap } = window

// event listener when goHome button is pressed go to index/home
document.getElementById('goHome').addEventListener('click', () => {
  window.location = '/index.html'
})

// event listener when log in button is clicked
document.getElementById('loginBtn').addEventListener('click', event => {
 event.preventDefault()

 // assign variables (and send the username input to lower case to help prevent duplicates)
 let errorMessage = document.getElementById('errorMsg')
 let usernameInput = document.getElementById('lUsername').value.toLowerCase()
 let passwordInput = document.getElementById('lPassword').value

 // if the username input and/or the password input are blank/empty provide error message on html
 if (usernameInput === '' || passwordInput === '') {
  errorMessage.textContent = '⚠️ Please enter a username and password'
  errorMessage.style.color = 'red'
 }
 //  else axios post the user login
 else {
  axios.post('/api/users/login', {
   username: usernameInput,
   password: passwordInput
  })
   .then(({ data: token }) => {
    // set the token in local storage and go to the index.html (main page) if token
    if (token) {
     localStorage.setItem('token', token)
     window.location = '/index.html'
    }
    // else the password/username is invalid 
    else {
     errorMessage.textContent = '⚠️ Invalid username or password'
     errorMessage.style.color = 'red'
    }
   })
   .catch(err => console.error(err))
 }
})