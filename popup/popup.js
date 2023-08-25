document.addEventListener("DOMContentLoaded", function () {
  const bookmarkButton = document.getElementById("bookmarkButton");
  const viewBookmarkButton = document.getElementById("viewBookmarkButton");

  bookmarkButton.addEventListener("click", function () {
    // Get the current active tab
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const currentTab = tabs[0];

      // Get tags input value and split into an array
      const tagsInput = document.getElementById("tagsInput").value;
      const tags = tagsInput.split(",").map((tag) => tag.trim());

      // Save the bookmarked page
      saveBookmark(currentTab.title, currentTab.url, tags);
    });
  });
});

// Function to save a bookmark
function saveBookmark(title, url, tags) {
  // Retrieve existing bookmarks from storage
  chrome.storage.local.get({ bookmarks: [] }, function (result) {
    const bookmarks = result.bookmarks;

    //create a unique ID for the bookmark
    const bookmarkID = "bookmark-" + Date.now();

    // Create a new bookmark object
    const newBookmark = {
      title: title,
      url: url,
      tags: tags,
    };

    // Add the new bookmark to the array
    bookmarks.push(newBookmark);

    // Save updated bookmarks back to storage
    chrome.storage.local.set({ bookmarks }, function () {
      alert("Bookmark saved!");
    });
  });
}
viewBookmarksButton.addEventListener("click", function () {
  // Open the bookmark page in a new tab
  chrome.tabs.create({ url: "bookmark-page/bookmark-page.html" });
});
