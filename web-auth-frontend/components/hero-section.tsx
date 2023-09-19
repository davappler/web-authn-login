/**
 * @return {JSX.Element} The JSX element
 */
function HeroSection() {
  return (
    <>
      <section className="h-screen text-center pt-20">
        <h1 className="text-4xl text-cyan-800 pb-10">
          Welcome You are authenticated!
        </h1>
        <p className="">
          How does web-authn works? Lets break it down into steps.
        </p>
        <ul className="pt-4">
          <li>- The browser requests a challenge from the server</li>
          <li>
            - The browser triggers client.register(...) and sends the result to
            the server
          </li>
          <li>- The server parses and verifies the registration payload</li>
          <li>
            - The server stores the credential key of this device for the user
            account
          </li>
        </ul>
      </section>
    </>
  );
}

export default HeroSection;
