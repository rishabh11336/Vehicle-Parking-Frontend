import { createRouter, createWebHistory } from 'vue-router'
import HelloWorldVue from '../components/HelloWorld.vue'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Signup from '../views/Signup.vue'
import UserDashboard from '../views/UserDashboard.vue'
// import Export from '../views/Export.vue'
import AdminDashboard from '../views/AdminDashboard.vue'
import AddLots from '../views/AddLots.vue'
import UpdateLots from '../views/AddLots.vue'
// import Reports from '../views/Reports.vue'
// import NotFound from '../views/NotFound.vue'
import EditProfile from '../views/EditProfile.vue'
import About from '../views/About.vue'
import Parking from '../views/Parking.vue'
import Search from '../views/Search.vue'
import ParkingBooking from '../views/ParkingBooking.vue'
import UserSummary from '../views/UserSummary.vue'
import BookingDetails from '../views/BookingDetails.vue'
// import LotsDetails from '../views/LotDetails.vue'
import Users from '../views/Users.vue'
import AdminSummary from '../views/AdminSummary.vue'
import DummyPayment from '../views/DummyPayment.vue'
import LotDetails from '../views/LotDetails.vue'
// import UpdateLots from '../views/UpdateLots.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/hello',
            name: 'hello',
            component: HelloWorldVue
        },
        {
            path: '/',
            name: 'home',
            component: Home
        },
        {
            path: '/login',
            name: 'login',
            component: Login
        },
        {
            path: '/signup',
            name: 'signup',
            component: Signup
        },
        {
            path: '/user/dashboard',
            name: 'userdashboard',
            component: UserDashboard,
            meta: { requiresAuth: true } // Optional if you plan to protect routes
        },
        {
            path: '/user/edit-profile',
            name: 'editprofile',
            component: EditProfile,
            meta: { requiresAuth: true, role: 'user' }
        },
        {
            path: '/admin/dashboard',
            name: 'admindashboard',
            component: AdminDashboard,
            meta: { requiresAuth: true, role: 'admin' }
        },
        {
            path: '/admin/add_lots',
            name: 'addlots',
            component: AddLots,
            meta: { requiresAuth: true, role: 'admin' }
        },
        {
            path: '/admin/lot_details/:id',
            name: 'lotdetails',
            component: LotDetails,
            meta: { requiresAuth: true, role: 'admin' }
        },
        {
            path: '//admin/update_lots/:id',
            name: 'updatelots',
            component: UpdateLots,
            meta: { requiresAuth: true, role: 'admin' }
        },
        
        {
            path: '/admin/users',
            name: 'users',
            component: Users,
            meta: { requiresAuth: true, role: 'admin' }
        },
        {
            path: '/admin/summary',
            name: 'adminsummary',
            component: AdminSummary,
            meta: { requiresAuth: true, role: 'admin' }
        },
        {
            path: '/user/payment',
            name: 'dummypayment',
            component: DummyPayment,
            meta: { requiresAuth: true }
        },
        {
            path: '/user/about',
            name: 'about',
            component: About,
            meta: { requiresAuth: true }
        },
        {
            path: '/user/parking',
            name: 'parking',
            component: Parking,
            meta: { requiresAuth: true }
        },
        {
            path: '/user/search',
            name: 'search',
            component: Search,
            meta: { requiresAuth: true }
        },
        {
            path: '/user/booking/:id',
            name: 'parkingbooking',
            component: ParkingBooking,
            meta: { requiresAuth: true }
        },
        {
            path: '/user/summary',
            name: 'usersummary',
            component: UserSummary,
            meta: { requiresAuth: true }
        },
        {
            path: '/user/booking-details/:id',
            name: 'bookingdetails',
            component: BookingDetails,
            meta: { requiresAuth: true }
        },
        // {
        //     path: '/:pathMatch(.*)*',
        //     name: 'notfound',
        //     component: NotFound
        // }

    ]
})

export default router