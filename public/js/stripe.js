import axios from "axios";
import { showAlert } from "./alerts";
const stripe = Stripe(
  "pk_test_51H2bBxFisqQ7pCd3XbPrcAMlyyu7PQeVt51EgUYnmhAOaJZLHket1TzBl3OPoV1OEFvlyuHSJNJpVxzcjWNJ5gHa00BPigpvTC"
);

export const bookTour = async (tourId) => {
  try {
    const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);

    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    console.log(err);
    showAlert("error", err);
  }
};
