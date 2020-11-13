import { getWithToken, postWithToken, deleteWithToken, patchWithToken } from '../commons/utils/apiCaller';

export const getAllOrder = (token) => {
    return getWithToken('api/orders', token).then(res => {
        return res;
    }).catch(err => { return err.response });
}

export const addOrderRequest = (token, data) => {
    return postWithToken('api/orders', token, data).then(res => {
        return res;
    }).catch(err => { return err.response });
}

export const deleteOrderRequest = (token, id) => {
    return deleteWithToken('api/orders', token, id).then(res => {
        return res;
    }).catch(err => {
        return err.response
    });
}
export const patchOrderRequest = (token, id, orderEditting) => {
    return patchWithToken('api/orders', token, id, orderEditting).then(res => {
        return res;
    }).catch(err => {
        return err.response
    });
}




