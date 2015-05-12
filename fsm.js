(function(context) {
    'use strict';

    function onTransition(cb, result) {

        var resultPromise, cbResult;

        if (!cb) {
            // if there is either no callback or result return, a fullfilled promise
            return Promise.resolve(result != null ? result : true);
        }

        cbResult = cb(result);

        if (cbResult.then) {
            resultPromise = cbResult;
        }
        // callback result is not a promise
        // wrap it into one!
        else {
            resultPromise = Promise.resolve(cbResult);
        }

        return resultPromise;        
    }

    function FSM() {

        this.supportedStates = [
            'idle'
        ];

        this._state = 'idle';
        
        // transition callbacks
        this._onBefore = null;
        this._onChange = null;
        this._onAfter = null;

    }

    FSM.prototype.getState = function getState() {
        return this._state;
    };

    FSM.prototype.addState = function(newState) {
        if (this.supportedStates.indexOf(newState) !== -1) {
            console.log('this state is already supported');
            return;
        }

        this.supportedStates.push(newState);
    };

    FSM.prototype.onBefore = function(cb) {
        this._onBefore = cb;
    };

    FSM.prototype.onChange = function(cb) {
        this._onChange = cb;
    };

    FSM.prototype.onAfter = function(cb) {
        this._onAfter = cb;
    };

    FSM.prototype.changeState = function(state) {

        var _this = this;

        if (_this.supportedStates.indexOf(state) === -1) {
            throw new RangeError(state + ' state is not a supported');
        }
        else if (state === _this._state) {
            console.log('the new state is the same as the current state - the state will not change');
            return onTransition(null, false);
        }

        return onTransition(_this._onBefore)
                .then(function onBeforeSuccess(result) {
                    console.log('onBeforeSuccess', result);
                    return onTransition(_this._onChange, result);
                })
                .then(function onuccess(result) {
                    _this._state = state;

                    console.log('onChangeSuccess', result);
                    return onTransition(_this._onAfter, result);
                })
                .then(function onAfterTransition(result) {
                    console.log('onAfterSuccess', result);

                    // reset callbacks
                    _this._onBefore = null;
                    _this._onChange = null;
                    _this._onAfter = null;

                    return result;
                })
                // capture all errors?
                .catch(function(err) {
                    console.error(err);

                    // return or rethrow?
                    return err;
                });
    };

    context.FSM = FSM;

})(this);