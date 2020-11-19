import {
  call,
  put,
  takeLatest,
  select,
  delay,
} from 'redux-saga/effects';

import {
  listAllOrdersSuccess,
  listAllOrdersFail,
  addOrderSuccess,
  addOrderFail,
  deleteOrderSuccess,
  deleteOrderFail,
  updateOrderSuccess,
  updateOrderFail,
} from '../actions/orderActions';

import { getAllOrder, addOrderRequest, deleteOrderRequest, patchOrderRequest } from '../apis/order';
import { getToken } from '../apis/auth';

import * as orderTypes from '../constants/order';

import { STATUS_CODE, } from '../constants';

import { showLoading, hideLoading } from '../actions/ui';

import { hideModal } from '../actions/modal';

import { returnErrors } from '../actions/errorActions';


function* getAllOrderSaga() {
  yield put(showLoading());
  yield delay(2000);
  const token = yield call(getToken);
  const resp = yield call(getAllOrder, token);
  const { status, data } = resp;
  if (status === STATUS_CODE.SUCCESS) {
    yield put(listAllOrdersSuccess(data))
  } else {
    yield put(listAllOrdersFail(data))
    yield put(returnErrors(data, status, 'LIST_ALL_ORDERS_FAIL'))
  }
  yield put(hideLoading());
}

function* addOrderSaga({ payload }) {
  const token = yield call(getToken);
  yield put(showLoading());
  const resp = yield call(addOrderRequest, token, payload);
  const { data, status } = resp;
  if (status === STATUS_CODE.SUCCESS) {
    window.location = '/admin/tool/' + data._id
    // yield put(addOrderSuccess(data));
    // yield put(hideModal());
  } else {
    yield put(addOrderFail(data));
  }
  yield put(hideLoading());
}

function* deleteOrderSaga({ payload }) {
  const { _id } = payload;
  const token = yield call(getToken);
  yield put(showLoading());
  const resp = yield call(deleteOrderRequest, token, _id);
  const { data, status } = resp;
  if (status === STATUS_CODE.SUCCESS) {
    yield put(deleteOrderSuccess(_id));
  } else {
    yield put(deleteOrderFail(data));
  }
  yield put(hideLoading());
}

function* updateOrderSaga({ payload }) {
  const token = yield call(getToken);
  const orderEdited = payload;
  const orderEditting = yield select((state) => state.orders.orderEditting);
  const { _id } = orderEditting;
  const orderSendReducer = { _id, ...orderEdited }
  yield put(showLoading());
  const resp = yield call(
    patchOrderRequest,
    token, _id, orderEdited
  );
  const { data, status } = resp;
  if (status === STATUS_CODE.SUCCESS) {
    yield put(updateOrderSuccess(orderSendReducer));
    yield put(hideModal());
  } else {
    yield put(updateOrderFail(data));
  }
  yield put(hideLoading());
}

function* orderSaga() {
  yield takeLatest(orderTypes.GET_ALL_ORDERS, getAllOrderSaga);
  yield takeLatest(orderTypes.ADD_ORDER, addOrderSaga);
  yield takeLatest(orderTypes.DELETE_ORDER, deleteOrderSaga);
  yield takeLatest(orderTypes.UPDATE_ORDER, updateOrderSaga);
}

export default (orderSaga);
