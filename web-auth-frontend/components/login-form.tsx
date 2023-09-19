import { client } from "@passwordless-id/webauthn";
import { useRouter } from "next/router";
import { useState } from "react";
import Link from "next/link";

/**
 * @param {string} url
 */
async function GetFetch(url: string) {
  return await fetch(url)
    .then((response) => response.json())
    .then((response) => response)
    .catch((error) => console.log(error));
}

/**
 * @return {JSX.Element} The JSX element
 */
function LoginForm() {
  const router = useRouter();
  const [isError, setIsError] = useState(false);
  // eslint-disable-next-line require-jsdoc
  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.target as HTMLFormElement;
    const formData = new FormData(formElement);
    const formDataAsEntries = formData.entries();
    const formDataAsObject = Object.fromEntries(formDataAsEntries);
    const userEmail = formDataAsObject.email;
    const response = await GetFetch(
      `http://localhost:5001/api/auth/request-challenge-login/${userEmail}`
    );

    if (response.error) {
      setIsError(true);
    } else {
      const credentialID = response.authData.credentialID;
      const challenge = response.authData.challenge;
      const authentication = await client.authenticate(
        [credentialID],
        challenge,
        {
          authenticatorType: "auto",
          userVerification: "required",
          timeout: 60000
        }
      );
      const body = {
        email: formDataAsObject.email,
        authentication: authentication
      };
      fetch("http://localhost:5001/api/auth/login", {
        method: "POST",
        mode: "cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      })
        .then((response) => response.json())
        .then((jsonResponse) => {
          if (!jsonResponse.error) {
            localStorage.setItem("jwtTokenWebAuthn", jsonResponse.token);
            router.push("/about");
          } else {
            setIsError(true);
          }
        })
        .catch((error) => console.log(error));
    }
  }

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
          Web-Authn
        </div>
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Sign in to your account
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={handleLogin}>
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Your email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="name@company.com"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full text-white bg-green-700 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              >
                Sign in
              </button>
              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                Don’t have an account yet?
                <Link href="/register">
                  <span className="font-medium text-primary-600 hover:underline dark:text-primary-500">
                    Register here
                  </span>
                </Link>
              </p>
              {isError ? (
                <div
                  className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
                  role="alert"
                >
                  <span className="font-medium">Not authenticated!</span> Please
                  register first
                </div>
              ) : null}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default LoginForm;
