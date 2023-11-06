"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

async function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();

  await getAndShowStoriesOnStart();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

// show submit new post form when submit is clicked
function navSubmitClick(evt) {
  console.debug("navSubmitClick", evt);
  hidePageComponents();
  $newPostForm.show();
}
$navSubmit.on("click", navSubmitClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserLinks.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}

//show user submitted stories

async function myPosts() {
  currentUser = await User.loginViaStoredCredentials(
    localStorage.token,
    localStorage.username
  );
  storyList.stories = currentUser.ownStories;
  putStoriesOnPage();
  $allStoriesList.prepend(
    '<button id="delete-button">Delete Story</button><button id="cancel-button" class="hidden">Cancel</button>'
  );
}

$navUserLinks.on("click", "#user-stories", myPosts);

//show user favorited stories
async function myFaves() {
  currentUser = await User.loginViaStoredCredentials(
    localStorage.token,
    localStorage.username
  );
  storyList.stories = currentUser.favorites;
  putStoriesOnPage();
}

$navUserLinks.on("click", "#favorite-stories", myFaves);
