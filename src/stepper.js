/*jshint esversion: 6 */
(function ($) {

    "use strict";


    $.fn.stepper = function (options) {

        let timeout;

        /**
         * Debounce
         *
         * @returns {Function}
         * @param func
         * @param wait
         * @param immediate
         *
         * Source: https://davidwalsh.name/javascript-debounce-function
         */
        const debounce = function (func, wait, immediate) {
            let timeout;
            return function () {
                let context = this, args = arguments;
                let later = function () {
                    timeout = null;
                    if (!immediate) func.apply(context, args);
                };
                let callNow = immediate && !timeout;
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
                if (callNow) func.apply(context, args);
            };
        };


        /**
         * Find the amount of decimals in a number
         *
         * @param num
         * @returns {Number}
         *
         * Source: http://stackoverflow.com/a/10454534
         */
        const findDecimals = function(num) {
            return (num.split('.')[1] || []).length;
        };

        /**
         * Get current value
         *
         * @returns {number}
         */
        const getValue = function () {
            return $(this).val() === '' ? 0 : $(this).val();
        };

        /**
         * bindEvents
         */
        const bindEvents = function () {
            const spinner = $(this).closest('.js-spinner');
            var _this = this;

            spinner.find('[spinner-button]').on({
                click: function() {
                    const type = $(this).attr('spinner-button');
                    if (type === 'up'){
                        $.fn.stepper.increase.call(_this);
                    }else{
                        $.fn.stepper.decrease.call(_this);
                    }
                },
                mousedown: function(){
                    $(this).data('timer', setTimeout(() => {
                        timeout = setInterval(() => {
                            const type = $(this).attr('spinner-button');
                            if (type === 'up'){
                                $.fn.stepper.increase.call(_this);
                            }else{
                                $.fn.stepper.decrease.call(_this);
                            }
                        }, 60);
                    }, _this.settings.debounce));
                },
                mouseup: function() {
                    clearTimeout($(this).data('timer'));
                }
            });

            $(document).mouseup(function () {
                clearInterval(timeout);
            });
        };

        /**
         * Increase
         */
        $.fn.stepper.increase = function () {
            let current = parseFloat(getValue.call(this));
            this.settings = $(this).data('settings');
            const decimals = findDecimals(this.settings.step);
            const newValue = (current + parseFloat(this.settings.step)).toFixed(decimals);
            updateValue.call(this, newValue);
        };

        /**
         * Decrease
         */
        $.fn.stepper.decrease = function () {
            let current = parseFloat(getValue.call(this));
            this.settings = $(this).data('settings');
            const decimals = findDecimals(this.settings.step);
            const newValue = (current - parseFloat(this.settings.step)).toFixed(decimals);
            updateValue.call(this, newValue);
        };

        /**
         * Update stepper element
         * @param newValue
         */
        const updateValue = function (newValue) {
            if ((newValue <= this.settings.max || typeof this.settings.max === "undefined") && (newValue >= this.settings.min || typeof this.settings.min === "undefined")) {
                $(this).val(newValue).focus();
                triggerChange.call(this);
            }
        };

        /**
         * Trigger change event on number field for third party hooks
         *
         * @type {Function}
         */
        const triggerChange = debounce(function () {
            $(this).trigger('change');
        }, 400);

        /**
         * Loop every instance
         */
        return this.each(function () {

            /**
             * Default settings merged with user settings
             * Can be set trough data attributes or as parameter.
             * @type {*}
             */
            this.settings = $.extend({
                step: $(this).is('[step]') ? $(this).attr('step') : '1',
                min: $(this).is('[min]') ? parseFloat($(this).attr('min')) : undefined,
                max: $(this).is('[max]') ? parseFloat($(this).attr('max')) : undefined,
                debounce: $(this).is('[data-stepper-debounce]') ? parseInt($(this).attr('data-stepper-debounce')) : 400,
            }, options);


            this.init = () => {
                // Store settings
                $(this).data('settings', this.settings);

                // Bind events
                bindEvents.call(this);
            };

            // Init
            this.init();

        });
    };

    /**
     * Auto load
     */
    $('input[type="number"]').stepper();

}(jQuery));