const { axios } = window

// goHome button clicked to go to the index.html (home page)
document.getElementById('goHome').addEventListener('click', () => {
  window.location = '/index.html'
})

// goDashboard button is clicked to go to the users dashboard (profile)
document.getElementById('goDashboard').addEventListener('click', () => {
  window.location = '/dashboard.html'
})

// logOut button is clicked remove the token from local storage and change window location (render) log in page
document.getElementById('logOut').addEventListener('click', () => {
  localStorage.removeItem('token')
  window.location = '/login.html'
})

// global event listener if the target has class contains deletePost to delete the post
document.addEventListener('click', event => {
  if (event.target.classList.contains('deletePost')) {
    // delete the post using the event target data id (post id) and pass auth
    axios.delete(`/api/posts/${event.target.dataset.id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      // then remove the target parentNode (post card)
      .then(() => {
        event.target.parentNode.remove()
        location.reload()
      })
      // catch error
      .catch(err => console.error(err))
  }
})

// function to refresh window
function reloadWindow() {
  location.reload()
}

// function to format dates from SQL database
function formatDate(postDate) {
  let dateObj = new Date(postDate)
  let month = dateObj.getUTCMonth() + 1
  let day = dateObj.getUTCDate()
  let year = dateObj.getUTCFullYear()
  formattedDate = month + "/" + day + "/" + year
  return formattedDate
}

// get users post and pass through authorization
axios.get('/api/users/posts', {
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`
  }
})
  // then for the data retrieved
  .then(({ data: { username, posts } }) => {
    document.getElementById('showUser').innerHTML = username
    // for each post data
    posts.forEach(({ id, title, body, date, createdAt, updatedAt }) => {
      console.log(username);
      // format date by calling function
      let formattedCreateDate = formatDate(createdAt)
      let formattedUpdateDate = formatDate(updatedAt)
      // create a post element (list item) and add the class name and inner html to show the post data (and mark post ids)
      const postElem = document.createElement('li')
      postElem.className = 'd-flex justify-content-between align-items-start mb-2 rounded postListItem'
      postElem.innerHTML = 
      `
        <div class="col-12 postDivision">

          <div class="postHeader text-white d-flex justify-content-between fw-bold rounded">
            ${title}
            <span class=" float-right badge fw-bold rounded-pill infoPill">Posted by ${username} on ${formattedCreateDate}</span>
          </div>

          <div class="postBodyArea rounded">
            ${body}
          </div>

          <div class="postFooter text-center rounded">
            <button type="button" class="btn btn-primary deletePost" data-id="${id}">Delete Post</button>
            <button class="btn btn-primary viewToggle" data-id="${id}">View Post</button>
            <button class="btn btn-primary editToggle" data-id="${id}">Edit Post</button>
            <br>
            <span class="float-right badge fw-bold rounded-pill infoPill">Last Update:${formattedUpdateDate}</span>
          </div>

        </div>
      `
      // prepend the post to the posts section in html to render posts
      document.getElementById('posts').prepend(postElem)
    })
  })
  // catch error
  .catch(err => console.error(err))

// get element createPost and when clicked
document.getElementById('createPost').addEventListener('click', event => {
  event.preventDefault()

  // post (create) the new user post (using the inputs from user) with auth
  axios.post('/api/posts', {
    title: document.getElementById('title').value,
    body: document.getElementById('body').value
  }, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  })
    // then for post data create a list element for the post and prepend with the data to the posts section
    .then(({ data: { id, title, body, date, createdAt, updatedAt, u: { username } } }) => {
      // format dates
      let formattedCreateDateNew = formatDate(createdAt)
      let formattedUpdateDateNew = formatDate(updatedAt)
      // create a post list element and add the classname and inner html (not nec required as reloading page so get request will grab all but aligning)
      const postElem = document.createElement('li')
      postElem.className = 'd-flex p-0 justify-content-between border border-3 border-dark mb-2 listItem'
      postElem.innerHTML = 
        `
        <div class="col-12 postDivision">

          <div class="postHeader text-white d-flex justify-content-between fw-bold">
            ${title}
            <span class=" float-right badge fw-bold rounded-pill infoPill">Posted by ${username} on ${formattedCreateDateNew}</span>
          </div>

          <div class="postBodyArea">
            ${body}
          </div>

          <div class="postFooter text-center">
            <button type="button" class="btn btn-dark deletePost" data-id="${id}">Delete Post</button>
            <button type="button" class="dialogPost btn btn-dark" data-id="${id}" onclick="showPost()">View Post</button>
            <button class="btn btn-dark editToggle" data-id="${id}">Edit Post</button>
            <br>
            <span class="float-right badge fw-bold rounded-pill infoPill">Last Update:${formattedUpdateDateNew}</span>
          </div>

        </div>
      `
      // prepend the new post element to the posts section and set the input values to blank
      document.getElementById('posts').prepend(postElem)
      document.getElementById('title').value = ''
      document.getElementById('body').value = ''
      // alert user post was added
      alert('post added!')
      // reload window to refresh the page
      reloadWindow()
    })
    // catch error
    .catch(err => console.error(err))
})

// button to open modal
let btn = document.querySelectorAll("button.modal-button");
// get all modals
let modals = document.querySelectorAll('.modal');
// span element closes the modal (x)
let spans = document.getElementsByClassName("close");

// When the user clicks the button, open the modal
for (let i = 0; i < btn.length; i++) {
  btn[i].onclick = function (event) {
    event.preventDefault();
    modal = document.querySelector(event.target.getAttribute("href"));
    modal.style.display = "block";
  }
}

// When the user clicks on (x), close the modal
for (let i = 0; i < spans.length; i++) {
  spans[i].onclick = function () {
    for (let index in modals) {
      if (typeof modals[index].style !== 'undefined') modals[index].style.display = "none";
    }
  }
}

// any clicks anywhere outside of the modal to close it
window.onclick = function (event) {
  // if the event target class list contains modal
  if (event.target.classList.contains('modal')) {
    for (let index in modals) {
      if (typeof modals[index].style !== 'undefined') modals[index].style.display = "none";
    }
  }
}

// function to toggle the elements to hide/unhide for edit and view section
function toggle(elements, specifiedDisplay) {
  let element, index;

  // check elements length
  elements = elements.length ? elements : [elements];
  for (index = 0; index < elements.length; index++) {
    element = elements[index];

    // if the element is hidden
    if (isElementHidden(element)) {
      element.style.display = '';

      // If the element is still hidden after removing the inline display
      if (isElementHidden(element)) {
        element.style.display = specifiedDisplay || 'block';
      }
    } else {
      element.style.display = 'none';
    }
  }
  function isElementHidden(element) {
    return window.getComputedStyle(element, null).getPropertyValue('display') === 'none';
  }
}

// global event listener for edit post button
document.addEventListener('click', event => {
  // if the event target class contains editToggle
  if (event.target.classList.contains('viewToggle')) {
    // toggle to show the edit post section
    toggle(document.querySelectorAll('.viewEditPost'))
    // get the post data by post id with auth
    axios.get(`/api/post/${event.target.dataset.id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      // then set the post data to the edit fields for user to edit
      .then(({ data: post }) => {

        console.log(post);

        // set the data to the html body so user can view the post details
        document.getElementById('viewEditTitle').value = post.title
        document.getElementById('viewEditBody').value = post.body
        document.getElementById('postViewEditFormId').value = post.id

        // set readonly to true so fields can not be edited
        document.getElementById("viewEditTitle").readOnly = true;
        document.getElementById("viewEditBody").readOnly = true;

        // hide the update and cancel button (only for edit posts)
        document.getElementById('updateBtn').style.display = 'none'
        // document.getElementById('cancelBtn').style.display = 'none'

        // set the header inner thml to view post
        document.getElementById('viewEditHeader').innerHTML = 'View Post'
      })
      // catch error
      .catch(err => console.log(err))
  }
})

// global event listener for edit post button
document.addEventListener('click', event => {
  // if the event target class contains editToggle
  if (event.target.classList.contains('editToggle')) {
    // toggle to show the edit post section
    toggle(document.querySelectorAll('.viewEditPost'))
    // get the post data by post id with auth
    axios.get(`/api/post/${event.target.dataset.id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      // then set the post data to the edit fields for user to edit
      .then(({ data: post }) => {

        // set the data to the html body so user can edit the post details
        document.getElementById('viewEditTitle').value = post.title
        document.getElementById('viewEditBody').value = post.body
        document.getElementById('postViewEditFormId').value = post.id

        // set readonly to false so fields can be edited
        document.getElementById("viewEditTitle").readOnly = false;
        document.getElementById("viewEditBody").readOnly = false;

        // show the update button and change the text to show Edit Post
        document.getElementById('updateBtn').style.display = 'in-line'
        document.getElementById('viewEditHeader').innerHTML = 'Edit Post'
      })
      // catch error
      .catch(err => console.log(err))
  }
})

// global event listener when clicked
document.addEventListener('click', event => {
  // if the target class contains updatePostBtn
  if (event.target.classList.contains('updatePostBtn')) {
    // console.log('update btn clicked');
    // set id to the post id
    id = document.getElementById('postViewEditFormId').value
    // put (edit) the post based on post id with values user updates in fields with auth
    axios.put(`/api/posts/${id}`,
      {
        title: document.getElementById('viewEditTitle').value,
        body: document.getElementById('viewEditBody').value
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      // then refresh the page
      .then(() => {
        alert('post updated')
        location.reload()
      })
      // catch error
      .catch(err => console.log(err))
  }
})

// event listener when cancel button is clicked to refresh page with no other action
document.getElementById('cancelBtn').addEventListener('click', event => {
  reloadWindow()
})

// function to set/reset the activity time based on user activity in window
let inactiveTime = function () {

  // create time variable and reset the timer when user moves mouse, keys or clicks
  let time
  window.onload = resetTimer
  document.onmousemove = resetTimer
  document.onkeydown = resetTimer
  document.onclick = resetTimer

  // function to log out and return to the login page
  function logout() {
    alert("User is logged out.")
    localStorage.removeItem('token')
    window.location = '/login.html'
  }

  // function to reset the timer (will log out after 20 min of no activity) 1000ms = 1s
  function resetTimer() {
    clearTimeout(time);
    time = setTimeout(logout, 1200000)
    // console.log(time)
  }
};

// on window load call function of inactivity
window.onload = function () {
  inactiveTime();
}

// remove token after 30 min and go to log in page
setTimeout(() => {
  localStorage.removeItem('token')
  window.location = '/login.html'
}, 1800000);