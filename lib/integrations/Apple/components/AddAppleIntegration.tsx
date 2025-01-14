import React from "react";

type Props = {
  onSubmit: () => void;
};

export const ADD_APPLE_INTEGRATION_FORM_TITLE = "addAppleIntegration";

const AddAppleIntegration = React.forwardRef<HTMLFormElement, Props>((props, ref) => {
  const onSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();

    props.onSubmit();
  };

  return (
    <form id={ADD_APPLE_INTEGRATION_FORM_TITLE} ref={ref} onSubmit={onSubmit}>
      <div className="mb-2">
        <label htmlFor="username" className="block text-sm font-medium text-gray-700">
          Nom d'utilisateur
        </label>
        <input
          required
          type="text"
          name="username"
          id="username"
          placeholder="email@icloud.com"
          className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-sm shadow-sm focus:outline-none focus:ring-neutral-500 focus:border-neutral-500 sm:text-sm"
        />
      </div>
      <div className="mb-2">
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Mot de passe
        </label>
        <input
          required
          type="password"
          name="password"
          id="password"
          placeholder="•••••••••••••"
          className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-sm shadow-sm focus:outline-none focus:ring-neutral-500 focus:border-neutral-500 sm:text-sm"
        />
      </div>
    </form>
  );
});

AddAppleIntegration.displayName = "AddAppleIntegrationForm";
export default AddAppleIntegration;
