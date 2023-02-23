import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import fiLocale from "@fullcalendar/core/locales/fi";
import timeGridPlugin from "@fullcalendar/timegrid";

import events from "../../crawler/events.json";
import { useState } from "react";
import dayjs from "dayjs";

const stringToColour = (str: string) => {
  var hash = 0;
  for (var i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  const hue = ((hash >> 5) % 180) + 180;
  console.log(str, hue);
  return `hsl(${hue}, 100%, 30%)`;
};

const sanitize = (str: string) => {
  str = str.replaceAll(
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script *>/gi,
    ""
  );

  return str;
};

const Calendar = () => {
  const [openEventIndex, setOpenEventIndex] = useState<number>();

  const openEvent = openEventIndex ? events[openEventIndex] : undefined;

  return (
    <div style={{ padding: "2rem", height: "100%", boxSizing: "border-box" }}>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin]}
        initialView="dayGridMonth"
        weekends={false}
        locale={fiLocale}
        height="100%"
        headerToolbar={{
          left: "prev,next,today",
          center: "title",
          right: "dayGridMonth,timeGridWeek",
        }}
        events={events.map((e, i) => ({
          title:
            e.organizers.map((o: string) => `[${o}]`).join(" ") +
            " " +
            e.name.fi,
          start: e.starts,
          end: e.ends,
          allDay: e.fullDay,
          color: stringToColour(e.organizers.join("")),
          id: i.toString(),
        }))}
        eventClick={(info) => {
          setOpenEventIndex(Number(info.event.id));
        }}
      />

      <div
        style={{
          position: "absolute",
          top: "10%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "100%",
          maxWidth: "500px",
          backgroundColor: "white",
          zIndex: 100,
          padding: "20px",
          display: openEvent ? "block" : "none",
          overflow: "scroll",
          border: "1px solid gray",
        }}
      >
        <button
          style={{
            float: "right",
            padding: "10px 15px",
          }}
          onClick={() => setOpenEventIndex(undefined)}
        >
          X
        </button>
        <h2>{openEvent?.name.fi}</h2>
        <p style={{ color: "gray" }}>
          {dayjs(openEvent?.starts).format("DD.MM.YYYY HH:mm")} -{" "}
          {dayjs(openEvent?.ends).format("DD.MM.YYYY HH:mm")}
        </p>
        <p
          dangerouslySetInnerHTML={{
            __html: sanitize(openEvent?.description.fi || ""),
          }}
        ></p>
      </div>
    </div>
  );
};

export default Calendar;
