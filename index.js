document.addEventListener("DOMContentLoaded", function () {
  const urlInput = document.getElementById("urlInput");
  const noteInput = document.getElementById("noteInput");
  const saveButton = document.getElementById("saveButton");
  const linksList = document.getElementById("linksList");

  // Add an event listener to the button
  saveButton.addEventListener("click", saveLink);

  // Function to save the link
  function saveLink() {
    const url = urlInput.value;
    const note = noteInput.value;

    if (!note || !url) {
      // Fixed the condition here
      alert("Uh-oh!!! 😬 Please fill all fields before saving the link!");
      return;
    }

    const linkItem = document.createElement("li");
    linkItem.innerHTML = `<a href="${url}" target="_blank">${url}</a> (${note}) `;
    linksList.appendChild(linkItem);

    // Save the link to Chrome storage
    chrome.storage.sync.get(["links"], function (result) {
      const savedLinks = result.links || [];
      savedLinks.push({ url, note });
      chrome.storage.sync.set({ links: savedLinks });
    });

    // Clear input fields after saving
    urlInput.value = "";
    noteInput.value = "";
  }

  // Load saved links from Chrome storage when the popup opens
  chrome.storage.sync.get(["links"], function (result) {
    const savedLinks = result.links || [];
    for (const link of savedLinks) {
      const linkItem = document.createElement("li");
      linkItem.innerHTML = `<a href="${link.url}" target="_blank">${link.url}</a> (${link.note})`;
      linksList.appendChild(linkItem);
    }
  });
});





