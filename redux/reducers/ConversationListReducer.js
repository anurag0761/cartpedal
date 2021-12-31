import {  CONVERSION_LIST_START,CONVERSION_LIST_SUCCESS,CONVERSION_LIST_ERROR } from '../actions/index.actions';

const initialState = {
    isLoading: false,
    success: false,
    error: false,
    data: {},
    errorMessage: ''
}
export default function(state = initialState, action) {
    switch (action.type) {
        case CONVERSION_LIST_START:
            return {
                ...state,
                isLoading: true
            };
        case CONVERSION_LIST_SUCCESS:
            return {
                ...state,
                data: action.payload,
                isLoading: false,
                success: true,
                error:false
            }
        case CONVERSION_LIST_ERROR:
            return {
                ...state,
                errorMessage: action.payload.message,
                isLoading: false,
                error: true
            }
        default:
            return state
    }
}