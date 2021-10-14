import React from "react";

type Props = {
  onSubmit: () => void;
};

export const ADD_CALDAV_INTEGRATION_FORM_TITLE = "addCalDav";
export type AddCalDavIntegrationRequest = {
  url: string;
  username: string;
  password: string;
};

const AddCalDavIntegration = React.forwardRef<HTMLFormElement, Props>((props, ref) => {
  const onSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();

    props.onSubmit();
  };

  return (
    <form id={ADD_CALDAV_INTEGRATION_FORM_TITLE} ref={ref} onSubmit={onSubmit}>
      <div className="mb-2">
        <label htmlFor="url" className="block text-sm font-medium text-gray-700">
          URL du calendrier
        </label>
        <div className="flex mt-1 rounded-md shadow-sm">
          <input
            required
            type="text"
            name="url"
            id="url"
            placeholder="https://example.com/calendar"
            className="flex-grow block w-full min-w-0 lowercase border-gray-300 rounded-none rounded-r-sm focus:ring-black focus:border-black sm:text-sm"
          />
        </div>
      </div>
      <div className="mb-2">
        <label htmlFor="username" className="block text-sm font-medium text-gray-700">
          Nom d'utilisateur
        </label>
        <input
          required
          type="text"
          name="username"
          id="username"
          placeholder="nom"
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

AddCalDavIntegration.displayName = "AddCalDavIntegrationForm";
export default AddCalDavIntegration;
