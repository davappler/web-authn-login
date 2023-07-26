import "./globals.css";
import RegisterForm from "@/components/register-form";
import { client } from "@passwordless-id/webauthn";


/**
 * @return {JSX.Element} The JSX element
 */
function RegisterPage() {
  return <RegisterForm handleRegister={handleRegister} />;
}


/**
 * @param {string} url
 */
async function GetFetch(url:string) {
  return await fetch(url)
  .then((response) => response.json())
  .then((response)=> {
     const challenge = response.challenge;
     return challenge;
    })
  .catch((error)=>console.log(error));
}


/**
 * Handles the register request.
 * @param {object} event
 */
async function handleRegister(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.target as HTMLFormElement;
    const formData = new FormData(formElement);
    const formDataAsEntries = formData.entries();
    const formDataAsObject = Object.fromEntries(formDataAsEntries);
    const userEmail = formDataAsObject.email;
    const challenge = await GetFetch(`http://localhost:5001/api/auth/request-challenge/${userEmail}`);


    console.log("This is the challenge from server", challenge);
    const registration = await client.register("David", challenge, {
      authenticatorType: "auto",
      userVerification: "required",
      timeout: 60000,
      attestation: false,
      debug: false
    });

    console.log("This is the registration object", registration);
    const body = { email: formDataAsObject.email, registration: registration };

    fetch("http://localhost:5001/api/auth/register", {
      method: "POST",
      mode: "cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    })
      .then((response) => response.json())
      .then((jsonResponse) => {
        console.log("Response from server", jsonResponse);
        // router.push("/about");
      })
      .catch((error) => console.log(error));
  }

export default RegisterPage;
