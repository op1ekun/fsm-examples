(function(context) {
    'use strict';

    function onTransition(cb, result) {

        // always wrap the callback in a promise
        return Promise.resolve()
            // will capture throws
            .then(function() { 
                return  cb ?     
                        cb(result) :
                        // if the cb is not present resolve Promise
                        // with either the result or true 
                        (result != null ? result : true);
            });
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
                    return onTransition(_this._onChange, result);
                })
                .then(function onSuccess(result) {
                    _this._state = state;

                    return onTransition(_this._onAfter, result);
                })
                .then(function onAfterTransition(result) {

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