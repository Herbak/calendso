import { Dialog, Transition } from "@headlessui/react";
import { CheckIcon, InformationCircleIcon } from "@heroicons/react/outline";
import { Fragment, ReactNode } from "react";

import classNames from "@lib/classNames";

/**
 * @deprecated please refactor to use <Dialog> only
 */
export default function Modal(props: {
  heading: ReactNode;
  description: ReactNode;
  handleClose: () => void;
  open: boolean;
  variant?: "success" | "warning";
}) {
  const { variant = "success" } = props;
  return (
    <Transition.Root show={props.open} as={Fragment}>
      <Dialog
        as="div"
        static
        className="fixed inset-0 z-50 overflow-y-auto"
        open={props.open}
        onClose={props.handleClose}>
        <div className="flex items-end justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0">
            <Dialog.Overlay className="fixed inset-0 z-0 transition-opacity bg-gray-500 bg-opacity-75" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
            <div className="inline-block px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6">
              <div>
                <div
                  className={classNames(
                    "mx-auto flex items-center justify-center h-12 w-12 rounded-full",
                    variant === "success" && "bg-green-100",
                    variant === "warning" && "bg-yellow-100"
                  )}>
                  {variant === "success" && (
                    <CheckIcon className="w-6 h-6 text-green-600" aria-hidden="true" />
                  )}
                  {variant === "warning" && (
                    <InformationCircleIcon className={"h-6 w-6 text-yellow-400"} aria-hidden="true" />
                  )}
                </div>
                <div className="mt-3 text-center sm:mt-5">
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900 font-cal">
                    {props.heading}
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">{props.description}</p>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-6">
                <button type="button" className="btn-wide btn-primary" onClick={() => props.handleClose()}>
                  Compris
                </button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
