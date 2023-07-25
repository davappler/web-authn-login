import "./globals.css";
import RegisterForm from "@/components/register-form";
import { client } from "@passwordless-id/webauthn";

/**
 * @return {JSX.Element} The JSX element
 */
function RegisterPage() {
  async function handleRegister(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    console.log("haha I was clickedd");

    const formElement = event.target as HTMLFormElement;
    const formData = new FormData(formElement);
    const formDataAsEntries = formData.entries();
    const formDataAsObject = Object.fromEntries(formDataAsEntries);

    const challenge = "a7c61ef9-dc23-4806-b486-2428938a547e";
    const registration = await client.register("David", challenge, {
      authenticatorType: "auto",
      userVerification: "required",
      timeout: 60000,
      attestation: false,
      debug: false
    });

    console.log("I am reg", registration);

    const body = { email: formDataAsObject.email, registration: registration };

    console.log("ahhaha body ", body);

    fetch("http://localhost:5001/api/auth/register", {
      method: "POST",
      mode: "cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    })
      .then((response) => response.json())
      .then((jsonResponse) => {
        console.log(jsonResponse);
        // router.push("/about");
      })
      .catch((error) => console.log(error));
  }

  return <RegisterForm handleRegister={handleRegister} />;
}

export default RegisterPage;
