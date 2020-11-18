import AdminHomePage from '../containers/AdminHomePage';
import Taskboard from '../containers/Taskboard';
import LoginPage from '../containers/LoginPage';
import SignupPage from '../containers/SignupPage';
import PageNotFound from '../containers/PageNotFound';
import Orders from '../containers/Orders';
import Tools from '../containers/Tools';
import Customers from '../containers/Customers';
import OrderForm from '../containers/OrderForm';
import ToolForm from '../containers/ToolForm';
import CustomerForm from '../containers/CustomerForm';


import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import BallotIcon from '@material-ui/icons/Ballot';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
import PagesIcon from '@material-ui/icons/Pages';
import ChromeReaderModeIcon from '@material-ui/icons/ChromeReaderMode';
import DateRangeIcon from '@material-ui/icons/DateRange';
import FaceIcon from '@material-ui/icons/Face';
//export const API_ENDPOINT = 'https://api.yensaochampa.icu';
export const API_ENDPOINT = 'http://localhost:4000';
// export const API_ENDPOINT = 'http://128.199.82.173:4000';

export const STATUSES = [
  {
    value: 0,
    label: 'READY',
  },
  {
    value: 1,
    label: 'IN PROGRESS',
  },
  {
    value: 2,
    label: 'COMPLETE',
  },
];

export const STATUS_CODE = {
  SUCCESS: 200,
  CREATED: 201,
  UPDATED: 202,
};

export const ADMIN_ROUTES = [
  {
    path: '/admin/task-board',
    name: 'Quản lý công việc',
    exact: true,
    component: Taskboard,
    form: null,
    iconSidebar : BallotIcon,
  },
  {
    path: '/admin',
    name: 'Trang quản trị',
    exact: true,
    component: AdminHomePage,
    form: null,
    iconSidebar : SupervisorAccountIcon,
  },
  {
    path: '/',
    name: 'Trang chủ',
    exact: true,
    component: AdminHomePage,
    form: null,
    iconSidebar : PagesIcon,
  },
  {
    path: '/admin/order',
    name: 'Quản lý đơn hàng',
    exact: false,
    component: Orders,
    form: OrderForm,
    labelButtonAdd: 'ĐƠN HÀNG',
    iconSidebar : ChromeReaderModeIcon,
  },
  {
    path: '/admin/tool',
    name: 'Quản lý dụng cụ',
    exact: false,
    component: Tools,
    form: ToolForm,
    labelButtonAdd: 'CÔNG CỤ',
    iconSidebar : DateRangeIcon,
  },
  {
    path: '/admin/customer',
    name: 'Quản lý khách hàng',
    exact: false,
    component: Customers,
    form: CustomerForm,
    labelButtonAdd: 'KHÁCH HÀNG',
    iconSidebar : FaceIcon,
  },
];

export const ROUTES = [
  {
    name: 'Dang nhap',
    path: '/login',
    exact: true,
    component: LoginPage,
  },
  {
    name: 'Dang ky',
    path: '/signup',
    exact: true,
    component: SignupPage,
  },
  {
    name: 'Page Not Found',
    path: '',
    exact: false,
    component: PageNotFound,
  }
]

export const limitSizeImage = 10000000;