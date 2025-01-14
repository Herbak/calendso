import { EventTypeCustomInput, EventTypeCustomInputType } from "@prisma/client";
import React, { FC } from "react";
import { Controller, SubmitHandler, useForm, useWatch } from "react-hook-form";
import Select, { OptionTypeBase } from "react-select";

const inputOptions: OptionTypeBase[] = [
  { value: EventTypeCustomInputType.TEXT, label: "Texte" },
  { value: EventTypeCustomInputType.TEXTLONG, label: "Texte Long" },
  { value: EventTypeCustomInputType.NUMBER, label: "Numéro" },
  { value: EventTypeCustomInputType.BOOL, label: "Case à cocher" },
];

interface Props {
  onSubmit: SubmitHandler<IFormInput>;
  onCancel: () => void;
  selectedCustomInput?: EventTypeCustomInput;
}

type IFormInput = EventTypeCustomInput;

const CustomInputTypeForm: FC<Props> = (props) => {
  const { selectedCustomInput } = props;
  const defaultValues = selectedCustomInput || { type: inputOptions[0].value };
  const { register, control, handleSubmit } = useForm<IFormInput>({
    defaultValues,
  });
  const selectedInputType = useWatch({ name: "type", control });
  const selectedInputOption = inputOptions.find((e) => selectedInputType === e.value)!;

  const onCancel = () => {
    props.onCancel();
  };

  return (
    <form onSubmit={handleSubmit(props.onSubmit)}>
      <div className="mb-2">
        <label htmlFor="type" className="block text-sm font-medium text-gray-700">
          Type de champ
        </label>
        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <Select
              id="type"
              defaultValue={selectedInputOption}
              options={inputOptions}
              isSearchable={false}
              className="flex-1 block w-full min-w-0 mt-1 mb-2 border-gray-300 rounded-none focus:ring-primary-500 focus:border-primary-500 rounded-r-md sm:text-sm"
              onChange={(option) => field.onChange(option.value)}
              value={selectedInputOption}
              onBlur={field.onBlur}
              name={field.name}
            />
          )}
        />
      </div>
      <div className="mb-2">
        <label htmlFor="label" className="block text-sm font-medium text-gray-700">
          Label
        </label>
        <div className="mt-1">
          <input
            type="text"
            id="label"
            required
            className="block w-full border-gray-300 rounded-sm shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            defaultValue={selectedCustomInput?.label}
            {...register("label", { required: true })}
          />
        </div>
      </div>
      {(selectedInputType === EventTypeCustomInputType.TEXT ||
        selectedInputType === EventTypeCustomInputType.TEXTLONG) && (
        <div className="mb-2">
          <label htmlFor="placeholder" className="block text-sm font-medium text-gray-700">
            Placeholder
          </label>
          <div className="mt-1">
            <input
              type="text"
              id="placeholder"
              className="block w-full border-gray-300 rounded-sm shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              defaultValue={selectedCustomInput?.placeholder}
              {...register("placeholder")}
            />
          </div>
        </div>
      )}
      <div className="flex items-center h-5">
        <input
          id="required"
          type="checkbox"
          className="w-4 h-4 mr-2 border-gray-300 rounded focus:ring-primary-500 text-primary-600"
          defaultChecked={selectedCustomInput?.required ?? true}
          {...register("required")}
        />
        <label htmlFor="required" className="block text-sm font-medium text-gray-700">
          Is required
        </label>
      </div>
      <input
        type="hidden"
        id="eventTypeId"
        value={selectedCustomInput?.eventTypeId || -1}
        {...register("eventTypeId", { valueAsNumber: true })}
      />
      <input
        type="hidden"
        id="id"
        value={selectedCustomInput?.id || -1}
        {...register("id", { valueAsNumber: true })}
      />
      <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
        <button type="submit" className="btn btn-primary">
          Save
        </button>
        <button onClick={onCancel} type="button" className="mr-2 btn btn-white">
          Cancel
        </button>
      </div>
    </form>
  );
};

export default CustomInputTypeForm;
