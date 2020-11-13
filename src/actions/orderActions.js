import * as orderConstants from '../constants/order';

export const listAllOrders = (params = {}) => {
   return {
       type: orderConstants.GET_ALL_ORDERS,
       payload: {params,}
   }
}
export const listAllOrdersSuccess = (data) => {
   return {
       type: orderConstants.GET_ALL_ORDERS_SUCCESS,
       payload: data,
   }
}
export const listAllOrdersFail = (error) => {
   return {
       type: orderConstants.GET_ALL_ORDERS_FAIL,
       payload: {error,}
   }
}
export const addOrder = (payload) => {
    return {
      type: orderConstants.ADD_ORDER,
      payload,
    };
  };
  
  export const addOrderSuccess = (payload) => {
    return {
      type: orderConstants.ADD_ORDER_SUCCESS,
      payload,
    };
  };
  
  export const addOrderFail = (payload) => {
    return {
      type: orderConstants.ADD_ORDER_FAIL,
      payload,
    };
  };

export const deleteOrder = (payload) => {
    return {
      type: orderConstants.DELETE_ORDER,
      payload,
    };
  };
  
  export const deleteOrderSuccess = (payload) => {
    return {
      type: orderConstants.DELETE_ORDER_SUCCESS,
      payload,
    };
  };
  
  export const deleteOrderFail = (payload) => {
    return {
      type: orderConstants.DELETE_ORDER_FAIL,
      payload,
    };
  };

  export const updateOrder = (payload) => {
    return {
      type: orderConstants.UPDATE_ORDER,
      payload,
    };
  };
  export const updateOrderSuccess = (payload) => {
    return {
      type: orderConstants.UPDATE_ORDER_SUCCESS,
      payload,
    };
  };
  
  export const updateOrderFail = (payload) => {
    return {
      type: orderConstants.UPDATE_ORDER_FAIL,
      payload,
    };
  };


  export const setOrderEditing = (order) => ({
    type: orderConstants.SET_ORDER_EDITING,
    payload: {
      order,
    },
  });
  






