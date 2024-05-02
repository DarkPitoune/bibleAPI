const axios = require("axios");
const url = "https://www.aelf.org";

// Function to fetch HTML content from URL
async function fetchHTML(path = "/") {
  try {
    const response = await axios.get(url + path);
    return response.data;
  } catch (error) {
    console.error("Error fetching HTML:", url + path);
    return null;
  }
}

module.exports = fetchHTML;
