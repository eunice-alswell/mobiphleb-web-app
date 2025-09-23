import {lazy} from 'react';


const Home = lazy(() => import('./Home'));
const About = lazy(() => import('./About'));
const IndividualBooking = lazy(() => import('./IndividualBooking'));
const CorporateServices = lazy(() => import('./CorporateServices'));
const Contact = lazy(() => import('./Contact'));
const NotFound = lazy(() => import('./NotFound'));


const Pages = {
    Home,
    About,
    IndividualBooking,
    CorporateServices,
    Contact,
    NotFound
}

export default Pages;