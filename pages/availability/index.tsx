import { ClockIcon } from "@heroicons/react/outline";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { useToggleQuery } from "@lib/hooks/useToggleQuery";
import showToast from "@lib/notification";
import { trpc } from "@lib/trpc";

import { Dialog, DialogContent } from "@components/Dialog";
import Loader from "@components/Loader";
import Shell from "@components/Shell";
import { Alert } from "@components/ui/Alert";
import Button from "@components/ui/Button";

function convertMinsToHrsMins(mins: number) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  const hours = h < 10 ? "0" + h : h;
  const minutes = m < 10 ? "0" + m : m;
  return `${hours}:${minutes}`;
}
export default function Availability() {
  const queryMe = trpc.useQuery(["viewer.me"]);
  const formModal = useToggleQuery("edit");

  const formMethods = useForm<{
    startHours: string;
    startMins: string;
    endHours: string;
    endMins: string;
    bufferHours: string;
    bufferMins: string;
  }>({});
  const router = useRouter();

  useEffect(() => {
    /**
     * This hook populates the form with new values as soon as the user is loaded or changes
     */
    const user = queryMe.data;
    if (formMethods.formState.isDirty || !user) {
      return;
    }
    formMethods.reset({
      startHours: convertMinsToHrsMins(user.startTime).split(":")[0],
      startMins: convertMinsToHrsMins(user.startTime).split(":")[1],
      endHours: convertMinsToHrsMins(user.endTime).split(":")[0],
      endMins: convertMinsToHrsMins(user.endTime).split(":")[1],
      bufferHours: convertMinsToHrsMins(user.bufferTime).split(":")[0],
      bufferMins: convertMinsToHrsMins(user.bufferTime).split(":")[1],
    });
  }, [formMethods, queryMe.data]);

  if (queryMe.status === "loading") {
    return <Loader />;
  }
  if (queryMe.status !== "success") {
    return <Alert severity="error" title="Un problème est survenu" />;
  }
  const user = queryMe.data;

  return (
    <div>
      <Shell
        heading="Disponibilités"
        subtitle="Configurez les heures auxquelles vous êtes disponibles pour un rendez-vous.">
        <div className="flex">
          <div className="w-1/2 mr-2 bg-white border border-gray-200 rounded-sm">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Configurez les heures de départ et de fin de votre journée
              </h3>
              <div className="max-w-xl mt-2 text-sm text-gray-500">
                <p>
                  Actuellement, votre journée commence à {convertMinsToHrsMins(user.startTime)} et finit à{" "}
                  {convertMinsToHrsMins(user.endTime)}.
                </p>
              </div>
              <div className="mt-5">
                <Button href={formModal.hrefOn}>Modifier vos disponibilités</Button>
              </div>
            </div>
          </div>

          <div className="w-1/2 ml-2 border border-gray-200 rounded-sm">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Something doesn&apos;t look right?
              </h3>
              <div className="max-w-xl mt-2 text-sm text-gray-500">
                <p>Troubleshoot your availability to explore why your times are showing as they are.</p>
              </div>
              <div className="mt-5">
                <Link href="/availability/troubleshoot">
                  <a className="btn btn-white">Launch troubleshooter</a>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <Dialog
          open={formModal.isOn}
          onOpenChange={(isOpen) => {
            router.push(isOpen ? formModal.hrefOn : formModal.hrefOff);
          }}>
          <DialogContent>
            <div className="mb-4 sm:flex sm:items-start">
              <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 mx-auto rounded-full bg-neutral-100 sm:mx-0 sm:h-10 sm:w-10">
                <ClockIcon className="w-6 h-6 text-neutral-600" />
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-lg font-medium leading-6 text-gray-900" id="modal-title">
                  Modifier vos disponibilités
                </h3>
                <div>
                  <p className="text-sm text-gray-500">
                    Définissez le début et la fin de votre journée et l'intervalle minimum entre vos
                    rendez-vous.
                  </p>
                </div>
              </div>
            </div>
            <form
              onSubmit={formMethods.handleSubmit(async (values) => {
                const startMins = parseInt(values.startHours) * 60 + parseInt(values.startMins);
                const endMins = parseInt(values.endHours) * 60 + parseInt(values.endMins);
                const bufferMins = parseInt(values.bufferHours) * 60 + parseInt(values.bufferMins);

                // TODO: Add validation
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const response = await fetch("/api/availability/day", {
                  method: "PATCH",
                  body: JSON.stringify({ start: startMins, end: endMins, buffer: bufferMins }),
                  headers: {
                    "Content-Type": "application/json",
                  },
                });
                if (!response.ok) {
                  showToast("Something went wrong", "error");
                  return;
                }
                await queryMe.refetch();
                router.push(formModal.hrefOff);

                showToast("Le début et la fin de votre journée ont bien été enregistrés.", "success");
              })}>
              <div className="flex mb-4">
                <label className="block w-1/4 pt-2 text-sm font-medium text-gray-700">Début</label>
                <div>
                  <label htmlFor="startHours" className="sr-only">
                    Heures
                  </label>
                  <input
                    {...formMethods.register("startHours")}
                    id="startHours"
                    type="number"
                    className="block w-full border-gray-300 rounded-sm shadow-sm focus:ring-neutral-500 focus:border-neutral-500 sm:text-sm"
                    placeholder="9"
                    defaultValue={convertMinsToHrsMins(user.startTime).split(":")[0]}
                  />
                </div>
                <span className="pt-1 mx-2">:</span>
                <div>
                  <label htmlFor="startMins" className="sr-only">
                    Minutes
                  </label>
                  <input
                    {...formMethods.register("startMins")}
                    id="startMins"
                    type="number"
                    className="block w-full border-gray-300 rounded-sm shadow-sm focus:ring-neutral-500 focus:border-neutral-500 sm:text-sm"
                    placeholder="30"
                  />
                </div>
              </div>
              <div className="flex mb-4">
                <label className="block w-1/4 pt-2 text-sm font-medium text-gray-700">Fin</label>
                <div>
                  <label htmlFor="endHours" className="sr-only">
                    Heures
                  </label>
                  <input
                    {...formMethods.register("endHours")}
                    type="number"
                    id="endHours"
                    className="block w-full border-gray-300 rounded-sm shadow-sm focus:ring-neutral-500 focus:border-neutral-500 sm:text-sm"
                    placeholder="17"
                  />
                </div>
                <span className="pt-1 mx-2">:</span>
                <div>
                  <label htmlFor="endMins" className="sr-only">
                    Minutes
                  </label>
                  <input
                    {...formMethods.register("endMins")}
                    type="number"
                    id="endMins"
                    className="block w-full border-gray-300 rounded-sm shadow-sm focus:ring-neutral-500 focus:border-neutral-500 sm:text-sm"
                    placeholder="30"
                  />
                </div>
              </div>
              <div className="flex mb-4">
                <label className="block w-1/4 pt-2 text-sm font-medium text-gray-700">Intervalle</label>
                <div>
                  <label htmlFor="bufferHours" className="sr-only">
                    Heures
                  </label>
                  <input
                    {...formMethods.register("bufferHours")}
                    type="number"
                    id="bufferHours"
                    className="block w-full border-gray-300 rounded-sm shadow-sm focus:ring-neutral-500 focus:border-neutral-500 sm:text-sm"
                    placeholder="0"
                  />
                </div>
                <span className="pt-1 mx-2">:</span>
                <div>
                  <label htmlFor="bufferMins" className="sr-only">
                    Minutes
                  </label>
                  <input
                    {...formMethods.register("bufferMins")}
                    type="number"
                    id="bufferMins"
                    className="block w-full border-gray-300 rounded-sm shadow-sm focus:ring-neutral-500 focus:border-neutral-500 sm:text-sm"
                    placeholder="10"
                  />
                </div>
              </div>
              <div className="mt-5 space-x-2 sm:mt-4 sm:flex">
                <Button href={formModal.hrefOff} color="secondary" tabIndex={-1}>
                  Annuler
                </Button>
                <Button type="submit" loading={formMethods.formState.isSubmitting}>
                  Enregistrer
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </Shell>
    </div>
  );
}
