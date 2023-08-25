// Function to load and display bookmarks
function loadBookmarks(searchQuery = "") {
  const bookmarkList = document.getElementById("bookmarkList");

  // Retrieve saved bookmarks from storage
  chrome.storage.local.get("bookmarks", function (result) {
    const bookmarks = result.bookmarks || [];

    // Clear previous contents
    bookmarkList.innerHTML = "";

    // Filter bookmarks based on search query
    const filteredBookmarks = bookmarks.filter((bookmark) => {
      const titleMatches = bookmark.title.toLowerCase().includes(searchQuery);
      const tagMatches = bookmark.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery)
      );
      return titleMatches || tagMatches;
    });

    // Generate HTML elements for filtered bookmarks
    filteredBookmarks.forEach(function (bookmark) {
      const bookmarkItem = document.createElement("li");
      bookmarkItem.id = `bookmark-${bookmark.id}`; // Assign a unique ID

      const bookmarkContainer = document.createElement("div"); // Create a new container element

      // Display tags as hashtags
      const tagsSpan = document.createElement("span");
      tagsSpan.classList.add("tags");
      tagsSpan.textContent =
        "Tags: " + bookmark.tags.map((tag) => `#${tag}`).join(" ");

      const bookmarkLink = document.createElement("a");
      bookmarkLink.textContent = bookmark.title;
      bookmarkLink.href = bookmark.url;
      bookmarkLink.target = "_blank";

      const deleteButton = document.createElement("button");
      deleteButton.classList.add("delete-button");
      deleteButton.textContent = "Delete";
      deleteButton.addEventListener("click", function () {
        console.log("delete button clicked");
        deleteBookmark(bookmark.id); // Pass the bookmark ID to the delete function
      });

      // Function to clear search and reload all bookmarks
      function clearSearch() {
        const searchInput = document.getElementById("searchInput");
        searchInput.value = ""; // Clear the search input
        loadBookmarks(); // Reload all bookmarks
      }

      // Add event listener to the "Clear Search" button
      const clearSearchButton = document.getElementById("clearSearchButton");
      clearSearchButton.addEventListener("click", clearSearch);

      // Call the function to load bookmarks when the page loads
      document.addEventListener("DOMContentLoaded", function () {
        // ... (other event listeners and functions)

        // Add event listener to the "Clear Search" button
        const clearSearchButton = document.getElementById("clearSearchButton");
        clearSearchButton.addEventListener("click", clearSearch);
      });

      // Function to delete a bookmark
      function deleteBookmark(bookmarkId) {
        // Retrieve existing bookmarks from storage
        chrome.storage.local.get({ bookmarks: [] }, function (result) {
          const bookmarks = result.bookmarks;

          // Find the index of the bookmark with the specified ID
          const bookmarkIndex = bookmarks.findIndex(
            (bookmark) => bookmark.id === bookmarkId
          );

          if (bookmarkIndex !== -1) {
            // Remove the bookmark from the array
            bookmarks.splice(bookmarkIndex, 1);

            // Save the updated bookmarks back to storage
            chrome.storage.local.set({ bookmarks }, function () {
              // Immediately update the UI by removing the deleted bookmark from display
              const deletedBookmarkItem = document.getElementById(
                `bookmark-${bookmarkId}`
              );
              if (deletedBookmarkItem) {
                deletedBookmarkItem.remove();
              }
            });
          }
        });
      }

      // Append elements to the bookmark item
      bookmarkItem.appendChild(bookmarkLink);
      bookmarkItem.appendChild(tagsSpan);
      bookmarkItem.appendChild(deleteButton);
      bookmarkItem.appendChild(bookmarkContainer);
      bookmarkList.appendChild(bookmarkItem);
    });
  });

  // Update search query display
  const searchQueryDisplay = document.getElementById("searchQueryDisplay");
  searchQueryDisplay.textContent = searchQuery
    ? `Search Results for: "${searchQuery}"`
    : "";
}

// Call the function to load bookmarks when the page loads
document.addEventListener("DOMContentLoaded", function () {
  // Add event listener to the search button
  const searchButton = document.getElementById("searchButton");
  searchButton.addEventListener("click", function () {
    const searchInput = document
      .getElementById("searchInput")
      .value.toLowerCase();
    loadBookmarks(searchInput);
  });

  loadBookmarks(); // Load bookmarks on page load
});
