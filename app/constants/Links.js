import UserView from '../components/user/UserView';
import TermsView from '../components/terms/Terms';

const ROOT_URL = 'https://futurice.github.io/futupolis-web/app';

const links = [
  // {
  //   title: 'My Berlin Photos',
  //   icon: 'photo-library',
  //   component: UserView,
  //   subtitle: 'All photos during trip',
  // },
  {
    title: 'Flight info',
    subtitle: 'When does my flight leave?',
    link: `https://docs.google.com/spreadsheets/d/1BKF4MswEIRff9gqnPR_KkoBZaQNrG1FMBXaRb1iOF6k/edit`,
    icon: 'flight',
    showInWebview: false,
  },
  {
    title: 'Transportation',
    subtitle: 'How to get to the hotel?',
    link: `https://docs.google.com/spreadsheets/d/1mcIz1x2rLFS7LBD7Sqc_tPNudrmU1gRYgc5D8vSLyxM/edit`,
    icon: 'directions-bus',
    showInWebview: false,
  },
  {
    title: 'Hotel info',
    subtitle: 'Where are we staying?',
    link: `https://futurice.github.io/futupolis-web/app/hotel.html`,
    icon: 'hotel',
    separatorAfter: false,
    showInWebview: true,
  },
  // {
  //   title: 'Roommates',
  //   subtitle: 'Who am I sharing room with?',
  //   link: `https://docs.google.com/spreadsheets/d/1QkvQoJIm4nGM_XPSXsd3exFB131NNOE9MPfjAgMLTbQ/edit`,
  //   icon: 'hotel',
  //   separatorAfter: false,
  //   showInWebview: false,
  // },
  {
    title: 'Venues',
    link: 'https://futurice.github.io/futupolis-web/app/venues.html',
    subtitle: 'Where are the main events?',
    icon: 'location-city',
    separatorAfter: false,
    showInWebview: true,
  },
];

const terms = [
  { title: 'Feedback', mailto: 'futubohemia@futurice.com', icon: 'send' },
  // { title: 'Feedback', mailto: 'futubohemia@futurice.com', subtitle: 'How could we do this better?', icon: 'send' },
  {
    title: 'Terms of Service',
    link: `${ROOT_URL}/terms.html`,
    icon: 'info-outline',
    component: TermsView,
    showInWebview: false,
  },
  { title: 'Privacy', link: `${ROOT_URL}/privacy.html`, icon: 'lock-outline', showInWebview: true},
  {
    title: 'Licenses',
    link: `${ROOT_URL}/licences.html`,
    icon: 'help-outline',
    showInWebview: true,
    last: true,
  },
];

export default {
  links,
  terms,
};
