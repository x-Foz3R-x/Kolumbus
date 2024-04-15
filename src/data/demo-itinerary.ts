import { add } from "date-fns";

import { formatDate } from "@/lib/utils";
import { Itinerary } from "@/types";

export default function DemoItinerary(): Itinerary {
  return [
    {
      id: "1",
      date: formatDate(add(new Date(), { days: -1 })),
      events: [
        {
          id: "ACTIVITY-1",
          tripId: "trip-1",
          placeId: "place-1",
          name: "Warsaw",
          address: "Warsaw, Poland",
          phoneNumber: null,
          cost: 0,
          currency: "USD",
          website: "http://www.um.warszawa.pl/",
          url: "https://maps.google.com/?q=Warsaw,+Poland&ftid=0x471ecc669a869f01:0x72f0be2a88ead3fc",
          note: null,
          openingHours: {},
          photo:
            "AWU5eFgaD6KV7jk0Opv1E3hcyFqVq1MstecRDcie0v6oifKWR7ShZgY0AdQTxy5-JnFYzot9HmlLenXcF8oNo6JVDb5fjE2FFvm6MxVz-xV7_PPejY_tH3hxMWnMD4ngBvIGaa1WW64y2pZEOQtjPXIaSX1EE0DWtwdck7_QdOOHmS1iBiNa",
          date: formatDate(add(new Date(), { days: -1 })),
          position: 0,
          updatedAt: "2024-03-17",
          createdAt: "2024-03-17",
          createdBy: "KolumbGuy",
        },
      ],
    },
    {
      id: "2",
      date: formatDate(new Date()),
      events: [
        {
          id: "ACTIVITY-2",
          tripId: "trip-1",
          placeId: "place-2",
          name: "Royal Baths Park",
          // name: "Łazienki Królewskie",
          address: "Warsaw, Poland",
          phoneNumber: "+48 504 243 783",
          cost: 0,
          currency: "USD",
          website: "https://www.lazienki-krolewskie.pl/",
          url: "https://maps.google.com/?cid=10112470542589209201",
          note: null,
          openingHours: {},
          photo:
            "ATplDJb7g0HVir04gfSE8khV1pr0WGupZQxlEPld0gqwTIv__5DA7HfO0lWEhabw1C30J-DPYbU1azR8mR1detgn_May2mfVH8MKUi7heJ4cNziM-SV8fqcV86PgX0NbKDq_QUW4g0QBZ49Qbabja15uWGEd0Ad2jPE-WR_LK_acFsoxJcS2",
          date: formatDate(new Date()),
          position: 0,
          updatedAt: "2024-03-17",
          createdAt: "2024-03-17",
          createdBy: "KolumbGuy",
        },
        {
          id: "FOOD_AND_DRINKS-1",
          tripId: "trip-1",
          placeId: "place-3",
          name: "Pizzeria Dworska",
          address: "Majorki 48, 03-020 Warszawa, Poland",
          phoneNumber: "+48 519 140 120",
          cost: 0,
          currency: "USD",
          website: "http://pizzeria-dworska.pl/",
          url: "https://maps.google.com/?cid=14114721647506581274",
          note: null,
          openingHours: {},
          photo:
            "ATplDJZeNdOF3Z9tEpibHKLhJRcn5MUVF_3P90_XDlXaI9tD-ZwiXtufEXOg3Jyd_7RcBg2i6AojvgC9mDY0ZTJGRx7m_WF4eAvzBEld8r2QH-3JN35wPWtoMGiB7lwTwJ0Vv4NGs1jnDo4iohWzTi-IAPnS5tmzUIKE70Zx_7OO5X6-wq5Q",
          date: formatDate(new Date()),
          position: 1,
          updatedAt: "2024-03-17",
          createdAt: "2024-03-17",
          createdBy: "KolumbGuy",
        },
      ],
    },
    {
      id: "3",
      date: formatDate(add(new Date(), { days: 1 })),
      events: [],
    },
  ];
}
