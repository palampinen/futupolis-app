import UserView from '../components/user/UserView';
import TermsView from '../components/terms/Terms';
import HotelInfoPage from '../containers/HotelInfoPage';
import VenueInfoPage from '../containers/VenueInfoPage';

const ROOT_URL = 'https://futurice.github.io/futupolis-web/app';

const links = [
  {
    title: 'Flight info',
    subtitle: 'When does my flight leave?',
    link: `https://docs.google.com/spreadsheets/d/1BKF4MswEIRff9gqnPR_KkoBZaQNrG1FMBXaRb1iOF6k/edit`,
    icon: 'flight',
    showInWebview: false,
  },
  {
    title: 'Transportation',
    subtitle: 'How to get to the hotel and venue?',
    link: `https://docs.google.com/spreadsheets/d/1mcIz1x2rLFS7LBD7Sqc_tPNudrmU1gRYgc5D8vSLyxM/edit`,
    icon: 'directions-bus',
    showInWebview: false,
  },
  {
    title: 'Hotel info',
    subtitle: 'Where are we staying?',
    component: HotelInfoPage,
    icon: 'hotel',
    separatorAfter: false,
    showInWebview: true,
  },
  {
    title: 'Venues',
    component: VenueInfoPage,
    subtitle: 'Where are the main events?',
    icon: 'location-city',
    separatorAfter: false,
    showInWebview: true,
  },
];

const terms = [
  { id: 'feedback', title: 'Feedback', mailto: 'futupolisapp@gmail.com', icon: 'send' },
  {
    id: 'website',
    title: 'Website',
    link: 'https://futupolis.com',
    icon: 'link',
    showInWebview: false,
  },
  {
    id: 'tos',
    title: 'Terms of Service',
    link: `${ROOT_URL}/terms.html`,
    icon: 'info-outline',
    component: TermsView,
    showInWebview: false,
  },
  {
    id: 'privacy',
    title: 'Privacy',
    link: `${ROOT_URL}/privacy.html`,
    icon: 'lock-outline',
    showInWebview: true,
  },
  {
    id: 'licenses',
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
