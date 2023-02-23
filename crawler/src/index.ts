import axios from "axios";
import { z } from "zod";
import dayjs from "dayjs";
import fs from "fs";
import ical from "node-ical";

const TiteEvent = z.object({
  starts: z.string().datetime({ offset: true }),
  ends: z.string().datetime({ offset: true }),
  signup_starts: z.string().datetime({ offset: true }).nullable(),
  signup_ends: z.string().datetime({ offset: true }).nullable(),
  id: z.number(),
  name_fi: z.string(),
  name_en: z.string(),
  description_fi: z.string(),
  description_en: z.string().nullable(),
  location_fi: z.string(),
  location_en: z.string(),
  max_attendees: z.number(),
  reserve_spots: z.boolean(),
  group: z.string(),
  signup: z.boolean(),
  participants_public: z.boolean(),
  email: z.boolean(),
  email_required: z.boolean(),
  email_public: z.boolean(),
  phone: z.boolean(),
  phone_required: z.boolean(),
  phone_public: z.boolean(),
  created: z.string().optional(),
  modified: z.string().optional(),
});

interface Event {
  name: {
    fi: string;
    en?: string;
  };
  description: {
    fi?: string;
    en?: string;
  };
  starts: string;
  ends?: string;
  fullDay?: boolean;
  organizers: string[];
}

const events: Event[] = [];

const tite = axios
  .get("https://tietoteekkarikilta.fi/api/events")
  .then((response) => {
    // handle success

    const data: unknown[] = response.data;

    for (const ev of data) {
      const res = TiteEvent.safeParse(ev);

      if (res.success) {
        const event = res.data;

        if (dayjs(event.starts).isBefore(dayjs("2023-01-01T00:00:00.000Z"))) {
          continue;
        }

        const fullDay =
          (dayjs(event.starts).hour() === 0 &&
            dayjs(event.starts).minute() === 0 &&
            dayjs(event.ends).hour() === 0 &&
            dayjs(event.ends).hour() === 0) ||
          dayjs(event.ends).diff(dayjs(event.starts), "days", true) > 1;

        events.push({
          name: {
            fi: event.name_fi,
            en: event.name_en,
          },
          description: {
            fi: event.description_fi,
            en: event.description_en || undefined,
          },
          starts: event.starts,
          ends: event.ends,
          fullDay,
          organizers: ["TiTe"],
        });
      } else {
        console.log(res.error, ev);
      }
    }

    console.log(`Read and processed calendar for TiTe`);
  })
  .catch((reason) =>
    console.error(
      `Could not retreive calendar for TiTe:`,
      reason.response.status
    )
  );

const ics = [
  {
    organizer: "Skilta",
    url: "https://calendar.google.com/calendar/ical/tqt8i5n94ih0dagg5birn7d7vk%40group.calendar.google.com/public/basic.ics",
  },
  {
    organizer: "Indecs",
    url: "https://calendar.google.com/calendar/ical/sq52m06otthqjr8m5ah24l8590%40group.calendar.google.com/public/basic.ics",
  },
  {
    organizer: "Hiukkanen",
    url: "https://calendar.google.com/calendar/ical/hallitus.hiukkanen%40gmail.com/public/basic.ics",
  },
  {
    organizer: "TaSciEn",
    url: "https://calendar.google.com/calendar/ical/tascien.tut@gmail.com/public/basic.ics",
  },
  {
    organizer: "TARAKI",
    url: "https://calendar.google.com/calendar/ical/tampereenrakentajakilta@gmail.com/public/basic.ics",
    /*
      AA-kerhot <a2h68gm23qu987d4fkogrt4qpk@group.calendar.google.com>
    */
  },
  {
    organizer: "Urbanum",
    url: "https://www.urbanum.fi/events/list/?ical=1",
  },
  {
    organizer: "MIK",
    url: "https://calendar.google.com/calendar/ical/fb77e429c7dca0b5f6a33d73ec0711ea5cb96c291ada5a566c4d951558296568@group.calendar.google.com/public/basic.ics",
  },
  {
    organizer: "Bioner",
    // NOTE: Probably incorrect since this is completely empty (even tho this is from their website)
    url: "https://calendar.google.com/calendar/ical/bq9p6lc2rm4jfjcq43698hchuc%40group.calendar.google.com/public/basic.ics",
  },

  {
    organizer: "Luuppi",
    url: "https://luuppi.fi/service/ics/events.ics?lang=fin",
  },
  {
    organizer: "Reettorit",
    url: "https://calendar.google.com/calendar/ical/reettorihallitus@gmail.com/public/basic.ics",
  },
  {
    organizer: "Lexica",
    url: "https://calendar.google.com/calendar/ical/27fu9laon5s5gc9fm4hsbmebk0@group.calendar.google.com/public/basic.ics",
  },
  {
    organizer: "Kopula",
    url: "https://calendar.google.com/calendar/ical/80hvffjn4olkra53lb753uhi68@group.calendar.google.com/public/basic.ics",
  },
  {
    organizer: "Interaktio",
    url: "https://calendar.google.com/calendar/ical/interaktiory@gmail.com/public/basic.ics",
  },
  {
    organizer: "Iltakoulu",
    url: "https://calendar.google.com/calendar/ical/f0a62f9d93ae158e59fef3d8b52ecbfff0344a760e4ab64281525132982552c2@group.calendar.google.com/public/basic.ics",
  },
  {
    organizer: "Teema",
    url: "https://calendar.google.com/calendar/ical/ainejarjestoteema@gmail.com/public/basic.ics",
    /*
      Kokoukset <qjg0q3uo9arbkabc463094cllk@group.calendar.google.com>
      Kulttuuri <r1dnoqkfv81ns769436gs52p1o@group.calendar.google.com>
      Liikunta <ho6bbgprcqfgs2hqeku9kr0hhk@group.calendar.google.com>
      Muut <115m20mo09r055bjtasbb2gajc@group.calendar.google.com>
    */
  },
  {
    organizer: "Vostok",
    url: "https://calendar.google.com/calendar/ical/m9u22l5uvc2cv3d9c0tna585vo%40group.calendar.google.com/public/basic.ics",
  },
  {
    organizer: "UDK",
    url: "https://calendar.google.com/calendar/ical/c_cp5e64tgbc4i32bp77k9titmu8%40group.calendar.google.com/public/basic.ics",
  },
  {
    organizer: "Cortex",
    url: "https://calendar.google.com/calendar/ical/cortexry@gmail.com/public/basic.ics",
  },
  {
    organizer: "Tipsy",
    url: "https://calendar.google.com/calendar/ical/tipsyboard@gmail.com/public/basic.ics",
  },
  {
    organizer: "Complex",
    // NOTE: Calendar seem pretty empty. The last event on the calendar is from end of 2021.
    url: "https://calendar.google.com/calendar/ical/complex.tuni@gmail.com/public/basic.ics",
  },

  {
    organizer: "Pointer",
    url: "https://calendar.google.com/calendar/ical/jd679pacp90m6un5j10kiflo00@group.calendar.google.com/public/basic.ics",
  },
] as const;

/*

Missing guilds (Taken from https://trey.fi/jarjestot/ylioppilaskunnan-piirissa-toimivat-jarjestot):

- YKI (https://ymparistoteekkarikilta.fi)
  Front page has simcal but couldn't find the underlying google calendar. Events page has static descriptions of events and no feed.

- Man@ger (https://www.tietojohtajakilta.net/)
  Front page has empty events section with only a facebook link.

- Naty (https://www.tuni.fi/naty/)
  Could not find upcoming events. 

- ITU (https://www.itury.fi/yhdistys/tapahtumat-2/)
  Events seem to be communicated only on email, facebook and instagram

- Salus (https://salusry.fi/)
  Events page throws 404??

- SOS (https://www.sos-ry.com/tapahtumat)
  Events seem to be communicated only on email, facebook and instagram

- Utopia (https://ainejarjestoutopia.blogspot.com/)
  The site doesn't seem to have been up in the last 5 year. Do they still exist??

- OKA (https://www.okary.fi/)
  Front page has an empty events section. Facebook page at least has upcoming events.

- Ääni (https://aaniry.wordpress.com/tapahtumat/)
  Events page is empty

- Transla (https://transla.fi/tapahtumat/)
  Events seem to be communicated only on email, facebook and instagram

- Boomi (https://boomi.fi/tapahtumakalenteri/)
  Events page has static list of events

- Mentor (https://mentorblogi.wordpress.com/)
  Could not find events

- Patina (https://patinary.com/tapahtumat/)
  Events seem to be communicated only on emaila and "other" social medias

- Staabi (https://staabi.fi/)
  Has calendar on front page. Couldn't find ics link

- Aatos (https://sites.google.com/view/aatosfilosofia/toiminta-ja-tapahtumat?authuser=0)
  Has static text list of upcoming events. Event info is also distribtet through telegram, email and instagram. 

- Kandit (https://kandit.fi/)
  Could not find info about events

- TamArk (https://www.tamark.fi/)
  Events are on website as blog posts but could not find calendar

- PoTka (http://www.porinteekkarit.com/)
  Site doesn't work

- KoRK (https://koneenrakentajakilta.fi/index.php?p=events)
  Custom events page and api but couldn't find ics

- Biopsi (https://biopsi.fi/)
  Has simcal (completely empty :D) but could not find ics

- Autek (https://www.autek.fi/fi/#autek)
  Footer has events but could not find ics

*/

const cals = ics.map((cal) =>
  axios
    .get(cal.url)
    .then((response) => {
      const data = response.data;

      const evs = ical.parseICS(data);
      for (let k in evs) {
        if (evs.hasOwnProperty(k)) {
          const ev = evs[k];

          if (ev.type == "VEVENT") {
            const fullDay =
              (dayjs(ev.start).hour() === 0 &&
                dayjs(ev.start).minute() === 0 &&
                dayjs(ev.end).hour() === 0 &&
                dayjs(ev.end).hour() === 0) ||
              dayjs(ev.end).diff(dayjs(ev.start), "days", true) > 1;

            events.push({
              name: {
                fi: ev.summary,
              },
              description: {
                fi: ev.description,
              },
              starts: ev.start.toISOString(),
              ends: ev.end.toISOString(),
              fullDay,
              organizers: [cal.organizer],
            });
          }
        }
      }

      console.log(`Read and processed calendar for ${cal.organizer}`);
    })
    .catch((reason) =>
      console.error(
        `Could not retreive calendar for ${cal.organizer}:`,
        reason.response.status
      )
    )
);

Promise.all([tite, ...cals]).then(() => {
  fs.writeFile("events.json", JSON.stringify(events), function (err) {
    if (err) {
      return console.log(err);
    }
    console.log("The file was saved!");
  });
});
