// Initialize button with user's preferred color
let changeColor = document.getElementById("changeColor");

chrome.storage.sync.get("color", ({ color }) => {
  changeColor.style.backgroundColor = color;
});

// When the button is clicked, inject setPageBackgroundColor into current page
changeColor.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: search,
    });
  });
  
  // The body of this function will be executed as a content script inside the
  // current page
  function search() {
    var input = document.createElement('input');
    input.type = 'file';
    input.accept = '.png, .jpg, .gif';

    function replace() {
        var imgs = document.getElementsByTagName("img");
        
        var source = chrome.storage.local.get("content", (data) => {
            for (var i = 0; i < imgs.length; i++) {
                imgs[i].src = data.content;
            }
        });
      }

    input.onchange = e => {
        var file = e.target.files[0];

        var reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = readerEvent => {
            var content = readerEvent.target.result;
            chrome.storage.local.set({ content });
            
            setInterval(replace, 1000);
        }
    }

    input.click();
  }