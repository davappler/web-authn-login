/**
 * @param {string} url
 */
export async function GetChallengeFetch(url: string) {
  return await fetch(url)
    .then((response) => response.json())
    .then((response) => {
      const challenge = response.challenge;
      return challenge;
    })
    .catch((error) => console.log(error));
}
/**
 * @param {string} url
 */
export async function GetExistingUserFetch(url: string) {
  return await fetch(url)
    .then((response) => response.json())
    .then((response) => {
      return response.isExistingUser;
    })
    .catch((error) => console.log(error));
}
