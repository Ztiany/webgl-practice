/**
 * Utility function to read a file from a given URL.
 * This function uses the Fetch API to retrieve the file content as text.
 * @param url {string} - The URL of the file to read.
 * @return {Promise<string>} - A promise that resolves to the file content as a string.
 */
async function readFile(url) {
    const response = await fetch(url);
    return await response.text();
}