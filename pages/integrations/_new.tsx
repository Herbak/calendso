import { Maybe } from "@trpc/server";
import Image from "next/image";
import { ReactNode, useEffect, useState } from "react";
import { useMutation } from "react-query";

import { QueryCell } from "@lib/QueryCell";
import classNames from "@lib/classNames";
import { AddAppleIntegrationModal } from "@lib/integrations/Apple/components/AddAppleIntegration";
import { AddCalDavIntegrationModal } from "@lib/integrations/CalDav/components/AddCalDavIntegration";
import showToast from "@lib/notification";
import { inferQueryOutput, trpc } from "@lib/trpc";

import { Dialog } from "@components/Dialog";
import { List, ListItem, ListItemText, ListItemTitle } from "@components/List";
import Shell, { ShellSubHeading } from "@components/Shell";
import ConfirmationDialogContent from "@components/dialog/ConfirmationDialogContent";
import Badge from "@components/ui/Badge";
import Button, { ButtonBaseProps } from "@components/ui/Button";
import Switch from "@components/ui/Switch";

function pluralize(opts: { num: number; plural: string; singular: string }) {
  if (opts.num === 0) {
    return opts.singular;
  }
  return opts.singular;
}

function SubHeadingTitleWithConnections(props: { title: ReactNode; numConnections?: number }) {
  const num = props.numConnections;
  return (
    <>
      <span>{props.title}</span>
      {num ? (
        <Badge variant="success">
          {num}{" "}
          {pluralize({
            num,
            singular: "connection",
            plural: "connections",
          })}
        </Badge>
      ) : null}
    </>
  );
}

function ConnectIntegration(props: {
  /**
   * @example apple_calendar
   */
  type: string;
  render: (renderProps: ButtonBaseProps) => JSX.Element;
}) {
  const { type } = props;
  const [isLoading, setIsLoading] = useState(false);
  const mutation = useMutation(async () => {
    const res = await fetch("/api/integrations/" + type.replace("_", "") + "/add");
    if (!res.ok) {
      throw new Error("Something went wrong");
    }
    const json = await res.json();
    window.location.href = json.url;
    setIsLoading(true);
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  // refetch intergrations when modal closes
  const utils = trpc.useContext();
  useEffect(() => {
    utils.invalidateQuery(["viewer.integrations"]);
  }, [isModalOpen, utils]);

  return (
    <>
      {props.render({
        onClick() {
          if (["caldav_calendar", "apple_calendar"].includes(type)) {
            // special handlers
            setIsModalOpen(true);
            return;
          }

          mutation.mutate();
        },
        loading: mutation.isLoading || isLoading,
        disabled: isModalOpen,
      })}
      {type === "caldav_calendar" && (
        <AddCalDavIntegrationModal open={isModalOpen} onOpenChange={setIsModalOpen} />
      )}

      {type === "apple_calendar" && (
        <AddAppleIntegrationModal open={isModalOpen} onOpenChange={setIsModalOpen} />
      )}
    </>
  );
}

function DisconnectIntegration(props: {
  /**
   * Integration credential id
   */
  id: number;
  render: (renderProps: ButtonBaseProps) => JSX.Element;
}) {
  const utils = trpc.useContext();
  const [modalOpen, setModalOpen] = useState(false);
  const mutation = useMutation(
    async () => {
      const res = await fetch("/api/integrations", {
        method: "DELETE",
        body: JSON.stringify({ id: props.id }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        throw new Error("Something went wrong");
      }
    },
    {
      async onSettled() {
        await utils.invalidateQuery(["viewer.integrations"]);
      },
      onSuccess() {
        setModalOpen(false);
      },
    }
  );
  return (
    <>
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <ConfirmationDialogContent
          variety="danger"
          title="Disconnect Integration"
          confirmBtnText="Yes, delete integration"
          cancelBtnText="Cancel"
          onConfirm={() => {
            mutation.mutate();
          }}>
          Are you sure you want to disconnect this integration?
        </ConfirmationDialogContent>
      </Dialog>
      {props.render({
        onClick() {
          setModalOpen(true);
        },
        disabled: modalOpen,
        loading: mutation.isLoading,
      })}
    </>
  );
}

function ConnectOrDisconnectIntegrationButton(props: {
  //
  credential: Maybe<{ id: number }>;
  type: string;
}) {
  if (props.credential) {
    <DisconnectIntegration
      id={props.credential.id}
      render={(btnProps) => <Button {...btnProps}>Connect</Button>}
    />;
  }
  return (
    <ConnectIntegration type={props.type} render={(btnProps) => <Button {...btnProps}>Connect</Button>} />
  );
}

function IntegrationListItem(props: {
  imageSrc: string;
  title: string;
  description: string;
  actions?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <ListItem expanded={!!props.children} className={classNames("flex-col")}>
      <div className={classNames("flex flex-1 space-x-2 w-full p-4")}>
        <div>
          <Image width={40} height={40} src={`/${props.imageSrc}`} alt={props.title} />
        </div>
        <div className="flex-grow">
          <ListItemTitle component="h3">{props.title}</ListItemTitle>
          <ListItemText component="p">{props.description}</ListItemText>
        </div>
        <div>{props.actions}</div>
      </div>
      {props.children && <div className="w-full border-t border-gray-200">{props.children}</div>}
    </ListItem>
  );
}

type TIntegrations = inferQueryOutput<"viewer.integrations">;
type TSelectable = NonNullable<TIntegrations["calendar"]["items"][number]["selectable"]>;
type TSelectableCalendar = TSelectable["items"][number];

export function CalendarSwitch(props: {
  //
  type: string;
  calendar: TSelectableCalendar;
}) {
  const utils = trpc.useContext();
  const mutation = useMutation<
    unknown,
    unknown,
    {
      isOn: boolean;
    }
  >(
    async ({ isOn }) => {
      const body = {
        integration: props.type,
        externalId: props.calendar.externalId,
      };
      if (isOn) {
        const res = await fetch("/api/availability/calendar", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });
        if (!res.ok) {
          throw new Error("Something went wrong");
        }
      } else {
        const res = await fetch("/api/availability/calendar", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });

        if (!res.ok) {
          throw new Error("Something went wrong");
        }
      }
    },
    {
      async onSettled() {
        await utils.invalidateQuery(["viewer.integrations"]);
      },
      onError() {
        showToast(`Something went wrong when toggling ${props.calendar.name}`, "error");
      },
    }
  );
  return (
    <Switch
      key={props.calendar.externalId}
      name="enabled"
      label={props.calendar.name}
      defaultChecked={false}
      onCheckedChange={(isOn: boolean) => {
        mutation.mutate({ isOn });
      }}
    />
  );
}

export default function IntegrationsPage() {
  const query = trpc.useQuery(["viewer.integrations"]);

  return (
    <Shell heading="Integrations" subtitle="Connect your favourite apps.">
      <QueryCell
        query={query}
        success={({ data }) => {
          return (
            <>
              <ShellSubHeading
                title={
                  <SubHeadingTitleWithConnections
                    title="Conferencing"
                    numConnections={data.conferencing.numActive}
                  />
                }
              />
              <List>
                {data.conferencing.items.map((item) => (
                  <IntegrationListItem
                    key={item.title}
                    {...item}
                    actions={<ConnectOrDisconnectIntegrationButton {...item} />}
                  />
                ))}
              </List>

              <ShellSubHeading
                className="mt-6"
                title={
                  <SubHeadingTitleWithConnections title="Payment" numConnections={data.payment.numActive} />
                }
              />
              <List>
                {data.payment.items.map((item) => (
                  <IntegrationListItem
                    key={item.title}
                    {...item}
                    actions={<ConnectOrDisconnectIntegrationButton {...item} />}
                  />
                ))}
              </List>

              <ShellSubHeading
                className="mt-6"
                title={
                  <SubHeadingTitleWithConnections
                    title="Calendars"
                    numConnections={data.calendar.numActive}
                  />
                }
                subtitle={
                  <>
                    Configure how your links integrate with your calendars.
                    <br />
                    You can override these settings on a per event basis.
                  </>
                }
              />

              {data.calendar.numActive > 0 && (
                <List>
                  {data.calendar.items
                    .flatMap((item) => (item.selectable ? [item] : []))
                    .map((item) => (
                      <IntegrationListItem
                        key={item.title}
                        {...item}
                        description={item.selectable.primary.externalId}
                        actions={<ConnectOrDisconnectIntegrationButton {...item} />}>
                        <ul className="space-y-2 p-4">
                          {item.selectable.items.map((cal) => (
                            <CalendarSwitch key={cal.externalId} calendar={cal} type={item.type} />
                          ))}
                        </ul>
                      </IntegrationListItem>
                    ))}
                </List>
              )}
              <List>
                {data.calendar.items.map((item) => (
                  <IntegrationListItem
                    key={item.title}
                    {...item}
                    actions={
                      <ConnectIntegration
                        type={item.type}
                        render={(btnProps) => (
                          <Button {...btnProps}>
                            {item.selectable?.items.length ? "Connect another" : "Connect"}
                          </Button>
                        )}
                      />
                    }
                  />
                ))}
              </List>
            </>
          );
        }}
      />
    </Shell>
  );
}