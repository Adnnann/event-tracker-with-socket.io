import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import {
  clearRegistrationNotificationStatus,
  clearRegistrationResponseStatus,
  fetchEvents,
  fetchUserEvents,
  getEvents,
  getFilter,
  getLoggedUserData,
  getRegistrationNotification,
  getRegistrationNotificationStatus,
  getRegistrationResponseStatus,
  getUserEvents,
  registerForEvent,
  sendRegistrationResponse,
} from "../../features/eventsSlice";
import { Grid } from "@mui/material";
import Event from "./Event";
import Notifications from "./Notifications";
import _ from "lodash";

const Events = ({ socket }) => {
  const events = useSelector(getEvents);
  const userEvents = useSelector(getUserEvents);
  const registrationNotificationStatus = useSelector(
    getRegistrationNotificationStatus
  );
  const registrationResponseStatus = useSelector(getRegistrationResponseStatus);
  const [registrationNotification, setRegistrationNotification] = useState([]);
  const [registrationResponse, setRegistrationResponse] = useState([]);

  const filter = useSelector(getFilter);
  const dispatch = useDispatch();

  useEffect(() => {
    socket?.on("getRegistrationNotification", (data) => {
      dispatch(fetchUserEvents(loggedUser.user._id));
      setRegistrationNotification([...registrationNotification, data]);
    });

    socket?.on("getRegistrationResponse", (data) => {
      dispatch(fetchEvents());
      dispatch(fetchUserEvents(loggedUser.user._id));
      setRegistrationResponse([...registrationResponse, data]);
    });

    if (registrationNotificationStatus?.message) {
      dispatch(fetchEvents());
      dispatch(clearRegistrationNotificationStatus());
    }

    if (registrationResponseStatus?.message) {
      dispatch(fetchUserEvents(loggedUser.user._id));
      dispatch(clearRegistrationResponseStatus());
    }
  }, [
    socket,
    registrationNotification,
    registrationResponse,
    registrationNotificationStatus,
    registrationResponseStatus,
  ]);

  const loggedUser = useSelector(getLoggedUserData);

  const register = (id, title, eventId, description) => {
    const event = {
      id: eventId,
      userId: loggedUser.user._id,
      title: title,
      description: description,
    };

    dispatch(registerForEvent(event));

    socket.emit("sendRegistrationNotification", {
      senderId: loggedUser.user._id,
      receiverId: id,
      eventTitle: title,
    });
  };

  const removeNotification = (title, email) => {
    setRegistrationNotification([
      ...registrationNotification.filter(
        (data) => data.email !== email || data.title !== title
      ),
    ]);
  };

  const removeResponse = (title, email) => {
    setRegistrationResponse([
      ...registrationResponse.filter(
        (data) => data.email !== email || data.title !== title
      ),
    ]);
  };

  const approveRegistration = (email, title, userId) => {
    const id = registrationNotification.filter((item) => item.id === userId)[0]
      .id;

    let participantsArr = [];

    let participants = [
      ...userEvents.events.filter((item) => item.title === title)[0]
        .participants,
    ];

    const object = {
      ...participants.filter((item) => item.participant === id)[0],
    };

    object.status = "approved";

    participantsArr = [
      object,
      ...participants.filter((item) => item.participant !== userId),
    ];

    const event = {
      id: userEvents.events.filter((item) => item.title === title)[0]._id,
      participants: participantsArr,
    };

    dispatch(sendRegistrationResponse(event));

    socket.emit("sendRegistrationResponse", {
      senderId: loggedUser.user._id,
      receiverId: id,
      eventTitle: title,
      response: "approved",
    });
    setRegistrationNotification([
      ...registrationNotification.filter(
        (data) => data.email !== email || data.title !== title
      ),
    ]);
  };

  const rejectRegistration = (email, title, userId) => {
    const id = registrationNotification.filter((item) => item.id === userId)[0]
      .id;

    let participantsArr = [];

    let participants = [
      ...userEvents.events.filter((item) => item.title === title)[0]
        .participants,
    ];

    const object = {
      ...participants.filter((item) => item.participant === id)[0],
    };

    object.status = "rejected";

    participantsArr = [
      object,
      ...participants.filter((item) => item.participant !== userId),
    ];

    const event = {
      id: userEvents.events.filter((item) => item.title === title)[0]._id,
      participants: participantsArr,
    };

    dispatch(sendRegistrationResponse(event));

    socket.emit("sendRegistrationResponse", {
      senderId: loggedUser.user._id,
      receiverId: id,
      eventTitle: title,
      response: "rejected",
    });
    setRegistrationNotification([
      ...registrationNotification.filter(
        (data) => data.email !== email || data.title !== title
      ),
    ]);
  };

  return (
    <>
      <Grid container spacing={1} marginTop={2} justifyContent="space-evenly">
        <Grid item xs={12} md={12} lg={12} xl={12}>
          {(filter === "myEvents" || filter === "allEvents") && (
            <>
              <h1 style={{ marginLeft: "5%", marginBottom: "0" }}>My events</h1>
              <hr
                style={{
                  width: "95%",
                  borderWidth: "1px",
                  borderStyle: "solid",
                }}
              />
            </>
          )}
        </Grid>

        {Object.keys(events).length !== 0 &&
        (filter === "myEvents" || filter === "allEvents") ? (
          <Event
            events={events.events.filter(
              (item) => item.createdBy === loggedUser.user._id
            )}
            userEvents={true}
            register={register}
          />
        ) : null}

        <Grid item xs={12} md={12} lg={12} xl={12}>
          {(filter === "courses" || filter === "allEvents") && (
            <>
              <h1 style={{ marginLeft: "5%", marginBottom: "0" }}>Courses</h1>
              <hr
                style={{
                  width: "95%",
                  borderWidth: "1px",
                  borderStyle: "solid",
                }}
              />
            </>
          )}
        </Grid>
        {Object.keys(events).length !== 0 &&
        (filter === "courses" || filter === "allEvents") ? (
          <Event
            events={_.chain(
              events.events.filter(
                (item) =>
                  item.category === "courses" &&
                  item.createdBy !== loggedUser.user._id
              )
            )
              .orderBy(["participants"], ["desc"])
              .value()}
            register={register}
          />
        ) : null}

        <Grid item xs={12} md={12} lg={12} xl={12}>
          {(filter === "meetups" || filter === "allEvents") && (
            <>
              <h1 style={{ marginLeft: "5%", marginBottom: "0" }}>Meetups</h1>
              <hr
                style={{
                  width: "95%",
                  borderWidth: "1px",
                  borderStyle: "solid",
                }}
              />
            </>
          )}
        </Grid>
        {Object.keys(events).length !== 0 &&
        (filter === "meetups" || filter === "allEvents") ? (
          <Event
            events={_.chain(
              events.events.filter(
                (item) =>
                  item.category === "meetups" &&
                  item.createdBy !== loggedUser.user._id
              )
            )
              .orderBy(["participants"], ["desc"])
              .value()}
            register={register}
          />
        ) : null}
      </Grid>
      {Object.keys(registrationNotification).length !== 0 ? (
        <Notifications
          registrationArr={registrationNotification}
          approve={approveRegistration}
          remove={removeNotification}
          open={Object.keys(registrationNotification).length > 0 ? true : false}
          removeNotification={removeNotification}
          reject={rejectRegistration}
        />
      ) : null}
      {Object.keys(registrationResponse).length !== 0 ? (
        <Notifications
          registrationArr={registrationResponse}
          approve={approveRegistration}
          remove={removeNotification}
          open={Object.keys(registrationResponse).length > 0 ? true : false}
          removeResponse={removeResponse}
        />
      ) : null}
    </>
  );
};

export default Events;
