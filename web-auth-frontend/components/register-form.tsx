// import { useRouter } from "next/router";

interface RegisterFormProps {
  handleRegister: (event: React.FormEvent<HTMLFormElement>) => Promise<void>;
  handleOnChangeEmail: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isEmailAlreadyRegistered: boolean;
}

/**
 * @return {JSX.Element} The JSX element
 * @param {object} handleRegister The response object
 */
const RegisterForm: React.FC<RegisterFormProps> = ({
  handleRegister,
  handleOnChangeEmail,
  isEmailAlreadyRegistered
}) => {
  return (
    <section className="bg-gray-50 ">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="flex items-center mb-6 text-2xl font-semibold text-gray-900 ">
          Web-Authn
        </div>
        <div className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
              Register this Device
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={handleRegister}>
              <div>
                <label
                  htmlFor="name"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Your name
                </label>
                <input
                  type="name"
                  name="name"
                  id="name"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
                  placeholder="David"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Your email
                </label>
                <input
                  onChange={(e) => handleOnChangeEmail(e)}
                  type="email"
                  name="email"
                  id="email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
                  placeholder="name@company.com"
                  required
                />
                {isEmailAlreadyRegistered && (
                  <p className="text-sm text-red-500">
                    Email already registered! Please Login.
                  </p>
                )}
              </div>
              <button
                disabled={isEmailAlreadyRegistered}
                type="submit"
                className="w-full text-white bg-green-700 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              >
                Register This Device
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RegisterForm;
