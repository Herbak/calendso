import { TrashIcon, PencilAltIcon } from "@heroicons/react/outline";

import showToast from "@lib/notification";
import { Webhook } from "@lib/webhook";

import { Dialog, DialogTrigger } from "@components/Dialog";
import { Tooltip } from "@components/Tooltip";
import ConfirmationDialogContent from "@components/dialog/ConfirmationDialogContent";
import Button from "@components/ui/Button";

export default function WebhookListItem(props: {
  onChange: () => void;
  key: number;
  webhook: Webhook;
  onEditWebhook: () => void;
}) {
  const handleErrors = async (resp: Response) => {
    if (!resp.ok) {
      const err = await resp.json();
      throw new Error(err.message);
    }
    return resp.json();
  };

  const deleteWebhook = (webhookId: string) => {
    fetch("/api/webhooks/" + webhookId, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(handleErrors)
      .then(() => {
        showToast("Webhook removed successfully!", "success");
        props.onChange();
      });
  };

  return (
    <li className="divide-y">
      <div className="flex justify-between my-4">
        <div className="flex pr-2 border-r border-gray-100">
          <span className="flex flex-col space-y-2 text-xs">
            {props.webhook.eventTriggers.map((eventTrigger, ind) => (
              <span key={ind} className="px-1 text-xs text-blue-700 rounded-md w-max bg-blue-50">
                {eventTrigger}
              </span>
            ))}
          </span>
        </div>
        <div className="flex w-full">
          <div className="self-center inline-block ml-3 space-y-1">
            <span className="flex text-sm text-neutral-700">{props.webhook.subscriberUrl}</span>
          </div>
        </div>
        <div className="flex">
          {!props.webhook.active && (
            <span className="self-center h-6 px-3 py-1 text-xs text-red-700 capitalize rounded-md bg-red-50">
              Inactif
            </span>
          )}
          {!!props.webhook.active && (
            <span className="self-center h-6 px-3 py-1 text-xs text-green-700 capitalize rounded-md bg-green-50">
              Actif
            </span>
          )}

          <Tooltip content="Éditer">
            <Button
              onClick={() => props.onEditWebhook()}
              color="minimal"
              size="icon"
              StartIcon={PencilAltIcon}
              className="self-center w-full p-2 ml-4"></Button>
          </Tooltip>
          <Dialog>
            <Tooltip content="Supprimer">
              <DialogTrigger asChild>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  color="minimal"
                  size="icon"
                  StartIcon={TrashIcon}
                  className="self-center w-full p-2 ml-2"></Button>
              </DialogTrigger>
            </Tooltip>
            <ConfirmationDialogContent
              variety="danger"
              title="Supprimer le Webhook"
              confirmBtnText="Oui, supprimer le webhook"
              cancelBtnText="Annuler"
              onConfirm={() => {
                deleteWebhook(props.webhook.id);
              }}>
              Êtes-vous certain de vouloir supprimer ce webhook ? Vous ne recevrez plus les informations
              d'Avocal à l'URL indiqué quand un rendez-vous sera créé, replanifié ou annulé.
            </ConfirmationDialogContent>
          </Dialog>
        </div>
      </div>
    </li>
  );
}
