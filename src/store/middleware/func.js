const func = ({dispatch, getState}) => next => action => {
    if(action.type === 'function')
        action(dispatch, getState);
    else next(action);
}

export default func;