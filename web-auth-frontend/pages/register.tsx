import "./globals.css";
import RegisterForm from "@/components/register-form";
import { client } from "@passwordless-id/webauthn";
import { useRouter } from "next/router";
import { useState } from "react";
import { GetChallengeFetch, GetExistingUserFetch } from "./_helpers";

function RegisterPage() {
  const router = useRouter();

  async function handleRegister(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.target as HTMLFormElement;
    const formData = new FormData(formElement);
    const formDataAsEntries = formData.entries();
    const formDataAsObject = Object.fromEntries(formDataAsEntries);
    const userEmail = formDataAsObject.email;
    const userName = formDataAsObject.name as string;
    const challenge = await GetChallengeFetch(
      `http://localhost:5001/api/auth/request-challenge/${userEmail}`
    );
    const registration = await client.register(userName, challenge, {
      authenticatorType: "auto",
      userVerification: "required",
      timeout: 60000,
      attestation: false,
      debug: false
    });

    const body = { email: userEmail, registration: registration };

    fetch("http://localhost:5001/api/auth/register", {
      method: "POST",
      mode: "cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    })
      .then((response) => response.json())
      .then((jsonResponse) => {
        console.log("Response from server", jsonResponse);
        localStorage.setItem("jwtTokenWebAuthn", jsonResponse.token);
        router.push("/about");
      })
      .catch((error) => console.log(error));
  }

  const [isEmailAlreadyRegistered, setIsEmailAlreadyRegistered] =
    useState<boolean>(false);

  async function handleOnChangeEmail(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const userEmail = event.target.value;
    const isExisting = await GetExistingUserFetch(
      `http://localhost:5001/api/auth/existing-user/${userEmail}`
    );

    setIsEmailAlreadyRegistered(isExisting);
  }

  return (
    <RegisterForm
      handleRegister={handleRegister}
      handleOnChangeEmail={handleOnChangeEmail}
      isEmailAlreadyRegistered={isEmailAlreadyRegistered}
    />
  );
}

export default RegisterPage;
