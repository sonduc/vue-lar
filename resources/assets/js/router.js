import Vue from 'vue'
import VueRouter from 'vue-router'
import AuthService from './services/auth'

/*
 |--------------------------------------------------------------------------
 | Admin Views
 |--------------------------------------------------------------------------|
 */

//  Dashboard
import Basic from './views/admin/dashboard/Basic.vue'

//  Layouts
import LayoutBasic from './views/layouts/LayoutBasic.vue'
import LayoutLogin from './views/layouts/LayoutLogin.vue'
import LayoutFront from './views/layouts/LayoutFront.vue'

//  Users
import Admin from './views/admin/users/Admin.vue'
import Merchant from './views/admin/users/Merchant.vue'
import Customer from './views/admin/users/Customer.vue'
import Profile from './views/admin/users/Profile.vue'
import EditUser from './views/admin/users/EditUser.vue'
//  Settings
import Settings from './views/admin/Settings.vue'
//  Bookings
import BookingList from './views/admin/bookings/BookingList.vue'
import BookingCreate from './views/admin/bookings/BookingCreate.vue'
import BookingUpdate from './views/admin/bookings/BookingUpdate.vue'
//  Roles
import RoleList from './views/admin/roles/RoleList.vue'
import RoleCreate from './views/admin/roles/RoleCreate.vue'
import RoleUpdate from './views/admin/roles/RoleUpdate.vue'
// Rooms
import RoomList from './views/admin/rooms/RoomList.vue'
import RoomDetail from './views/admin/rooms/RoomDetail.vue'
import RoomUpdate from './views/admin/rooms/RoomUpdate.vue'
import RoomCreate from './views/admin/rooms/RoomCreate.vue'
import RoomCalendar from './views/admin/rooms/RoomCalendar.vue'
import RoomGoogleMap from './views/admin/rooms/RoomGoogleMap.vue'
import RoomGuideBook from './views/admin/rooms/RoomGuideBook.vue'

// Promotions
import PromotionList from './views/admin/promotions/PromotionList.vue'
import PromotionUpdate from './views/admin/promotions/PromotionUpdate.vue'
import PromotionCreate from './views/admin/promotions/PromotionCreate.vue'
import PromotionDetail from './views/admin/promotions/PromotionDetail.vue'

// Coupons
import CouponUpdate from './views/admin/coupons/CouponUpdate.vue'
import CouponCreate from './views/admin/coupons/CouponCreate.vue'
import CouponList from './views/admin/coupons/CouponList.vue'

// Blogs
import BlogList from './views/admin/blogs/BlogList.vue'
import BlogDetail from './views/admin/blogs/BlogDetail.vue'
import BlogCreate from './views/admin/blogs/BlogCreate.vue'
import BlogUpdate from './views/admin/blogs/BlogUpdate.vue'

// Collection
import CollectionList from './views/admin/collections/CollectionList.vue'
import CollectionCreate from './views/admin/collections/CollectionCreate.vue'
import CollectionUpdate from './views/admin/collections/CollectionUpdate.vue'
import CollectionDetail from './views/admin/collections/CollectionDetail.vue'

/*
 |--------------------------------------------------------------------------
 | Other
 |--------------------------------------------------------------------------|
 */

//  Auth
import Login from './views/auth/Login.vue'
import Register from './views/auth/Register.vue'

import NotFoundPage from './views/errors/404.vue'
import PermissionForbidden from './views/errors/403.vue'

/*
 |--------------------------------------------------------------------------
 | Frontend Views
 |--------------------------------------------------------------------------|
 */

import Home from './views/front/Home.vue'

Vue.use(VueRouter)

const routes = [
  /*
   |--------------------------------------------------------------------------
   | Layout Routes for DEMO
   |--------------------------------------------------------------------------|
   */

  {
    path: '/admin/layouts',
    component: LayoutBasic,
    children: [{
      path: 'sidebar',
      component: Basic
    }]
  },

  /*
   |--------------------------------------------------------------------------
   | Frontend Routes
   |--------------------------------------------------------------------------|
   */

  {
    path: '/',
    component: LayoutLogin,
    children: [
      {
        path: 'login',
        component: Login,
        name: 'login'
      }
    ]
  },

  {
    path: '/',
    component: LayoutFront,
    children: [{
      path: '/',
      component: Home,
      name: 'home'
    }]
  },

  /*
   |--------------------------------------------------------------------------
   | Admin Backend Routes
   |--------------------------------------------------------------------------|
   */
  {
    path: '/admin',
    component: LayoutBasic, //  Change the desired Layout here
    meta: {
      requiresAuth: true
    },
    children: [
      //  Dashboard
      {
        path: 'dashboard/basic',
        component: Basic,
        name: 'dashboard'
      },

      //  Users
      {
        path: 'users/profile/:userId',
        name: 'user.profile',
        component: Profile
      },
      {
        path: 'users/edit/:userId',
        name: 'user.edit',
        component: EditUser
      },
      {
        path: 'users/customers',
        name: 'user.customer',
        component: Customer
      },
      {
        path: 'users/merchants',
        name: 'user.merchant',
        component: Merchant
      },
      {
        path: 'users/admins',
        name: 'user.admin',
        component: Admin
      },

      // Bookings
      {
        path: 'bookings/list',
        name: 'booking.list',
        component: BookingList
      },
      {
        path: 'bookings/create/room/:roomId',
        name: 'booking.create',
        component: BookingCreate
      },
      {
        path: 'bookings/update/:bookingId',
        name: 'booking.update',
        component: BookingUpdate
      },

      // Roles
      {
        path: 'roles/list',
        name: 'role.list',
        component: RoleList
      },
      {
        path: 'roles/create',
        name: 'role.create',
        component: RoleCreate
      },
      {
        path: 'roles/update/:roleId',
        name: 'role.update',
        component: RoleUpdate
      },
      // Collection
      {
        path: 'collections/list',
        name: 'collections.list',
        component: CollectionList
      },
      {
        path: 'collections/detail/:collectionId',
        name: 'collection.detail',
        component: CollectionDetail
      },
      {
        path: 'collections/create',
        name: 'collection.create',
        component: CollectionCreate
      },
      {
        path: 'collections/update/:collectionId',
        name: 'collection.update',
        component: CollectionUpdate
      },

      // Rooms
      {
        path: 'rooms/list',
        name: 'room.list',
        component: RoomList
      },
      {
        path: 'rooms/detail/:roomId',
        name: 'room.detail',
        component: RoomDetail
      },
      {
        path: 'rooms/update/:roomId',
        name: 'room.update',
        component: RoomUpdate
      },
      {
        path: 'rooms/create',
        name: 'room.create',
        component: RoomCreate
      },
      {
        path: 'rooms/calendar/:roomId',
        name: 'room.calendar',
        component: RoomCalendar
      },
      {
        path: 'rooms/googlemap',
        name: 'room.googlemap',
        component: RoomGoogleMap
      },
      {
        path: 'rooms/guidebook/:roomId',
        name: 'room.guidebook',
        component: RoomGuideBook
      },

      // Promotions
      {
        path: 'promotions/list',
        name: 'promotion.list',
        component: PromotionList
      },
      {
        path: 'promotions/update/:promotionId',
        name: 'promotion.update',
        component: PromotionUpdate
      },
      {
        path: 'promotions/create',
        name: 'promotion.create',
        component: PromotionCreate
      },
      {
        path: 'promotions/detail/:promotionId',
        name: 'promotion.detail',
        component: PromotionDetail
      },

      // Coupons
      {
        path: 'coupons/update/:couponId',
        name: 'coupon.update',
        component: CouponUpdate
      },
      {
        path: 'coupons/create',
        name: 'coupon.create',
        component: CouponCreate
      },
      {
        path: 'coupons/list',
        name: 'coupon.list',
        component: CouponList
      },

      // Blogs
      {
        path: 'blogs/list',
        name: 'blog.list',
        component: BlogList
      },
      {
        path: 'blogs/detail/:blogId',
        name: 'blog.detail',
        component: BlogDetail
      },
      {
        path: 'blogs/create',
        name: 'blog.create',
        component: BlogCreate
      },
      {
        path: 'blogs/update/:blogId',
        name: 'blog.update',
        component: BlogUpdate
      },

      //  Settings
      {
        path: 'settings',
        component: Settings
      }
    ]
  },

  /*
   |--------------------------------------------------------------------------
   | Auth & Registration Routes
   |--------------------------------------------------------------------------|
   */

  // {
  //   path: '/',
  //   component: LayoutLogin,
  //   children: [{
  //       path: 'login',
  //       component: Login,
  //       name: 'login'
  //     },
  //     {
  //       path: 'register',
  //       component: Register,
  //       name: 'register'
  //     }
  //   ]
  // },

  //   DEFAULT ROUTE
  {
    path: '*',
    component: NotFoundPage
  },
  {
    path: '/permission-denied-403',
    component: PermissionForbidden
  }
]

const router = new VueRouter({
  routes,
  mode: 'history',
  linkActiveClass: 'active'
})

router.beforeEach((to, from, next) => {
  //   If the next route is requires user to be Logged IN
  if (to.matched.some(m => m.meta.requiresAuth)) {
    return AuthService.check().then(authenticated => {
      if (!authenticated) {
        return next({
          path: '/login'
        })
      }

      return next()
    })
  }

  return next()
})

export default router
