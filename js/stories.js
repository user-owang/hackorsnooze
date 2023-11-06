"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  if (!currentUser) {
    return $(`
      <li id="${story.storyId}">
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
  }
  if (
    currentUser.favorites
      .map((favorite) => favorite.storyId)
      .includes(story.storyId)
  ) {
    return $(`
      <li id="${story.storyId}">
        <span class="unfavorite">&starf;</span><a href="${story.url}" target="a_blank" class="story-link">${story.title}</a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
  }
  return $(`
      <li id="${story.storyId}">
      <span class="favorite">&star;</span><a href="${story.url}" target="a_blank" class="story-link">${story.title}</a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

// creates new story object when new post form is submitted

async function submitNew(evt) {
  console.debug("new post form submitted", evt);
  evt.preventDefault();
  //capturing form data
  const title = $("#post-title").val();
  const url = $("#post-url").val();
  const author = $("#post-author").val();

  const newStory = new Story({ title, author, url });

  await storyList.addStory(currentUser, newStory);
  hidePageComponents();
  getAndShowStoriesOnStart();
}

$("#submit-form").on("submit", submitNew);

// delete story button prepends remove buttons per story
function addRemoveBtn() {
  $("li").append('<span class="remove-story">X</span>');
  $("#delete-button").hide();
  $("#cancel-button").show();
}
$allStoriesList.on("click", "#delete-button", addRemoveBtn);

// Cancel button cancels delete story button actions
function cancelBtn() {
  $(".remove-story").remove();
  $("#delete-button").show();
  $("#cancel-button").hide();
}
$allStoriesList.on("click", "#cancel-button", cancelBtn);

//remove story click handlerfunctionality
async function deleteHandler(evt) {
  await storyList.deleteStory(evt.target.parentElement.id);
  evt.target.parentElement.remove();
}
$allStoriesList.on("click", ".remove-story", deleteHandler);
