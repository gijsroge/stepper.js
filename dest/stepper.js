"use strict";

/*jshint esversion: 6 */
(function ($) {

    "use strict";

    $.fn.stepper = function (options) {

        var timeout = void 0;

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
        var debounce = function debounce(func, wait, immediate) {
            var timeout = void 0;
            return function () {
                var context = this,
                    args = arguments;
                var later = function later() {
                    timeout = null;
                    if (!immediate) func.apply(context, args);
                };
                var callNow = immediate && !timeout;
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
                if (callNow) func.apply(context, args);
            };
        };

        /**
         * Check if its a touch base device
         *
         * @returns {boolean}
         */
        var is_touch_device = function is_touch_device() {
            try {
                document.createEvent("TouchEvent");
                return true;
            } catch (e) {
                return false;
            }
        };

        /**
         * Find the amount of decimals in a number
         *
         * @param num
         * @returns {Number}
         *
         * Source: http://stackoverflow.com/a/10454534
         */
        var findDecimals = function findDecimals(num) {
            return (num.split('.')[1] || []).length;
        };

        /**
         * Get current value
         *
         * @returns {number}
         */
        var getValue = function getValue() {
            return $(this).val() === '' ? 0 : $(this).val();
        };

        /**
         * bindEvents
         */
        var bindEvents = function bindEvents() {
            var spinner = $(this).closest('.js-spinner');
            var events = is_touch_device() ? 'touchstart' : 'mousedown';
            var _this = this;

            spinner.find('[spinner-button]').on(events, function () {
                var type = $(this).attr('spinner-button');
                if (type === 'up') {
                    $.fn.stepper.increase.call(_this);
                } else {
                    $.fn.stepper.decrease.call(_this);
                }
            }).on('mousedown', function () {
                var type = $(this).attr('spinner-button');
                $(this).data('timer', setTimeout(function () {
                    timeout = setInterval(function () {
                        if (type === 'up') {
                            $.fn.stepper.increase.call(_this);
                        } else {
                            $.fn.stepper.decrease.call(_this);
                        }
                    }, 60);
                }, _this.settings.debounce));
            }).on('mouseup', function () {
                clearTimeout($(this).data('timer'));
            });

            $(document).mouseup(function () {
                clearInterval(timeout);
            });
        };

        /**
         * Increase
         */
        $.fn.stepper.increase = function () {
            var current = parseFloat(getValue.call(this));
            this.settings = $(this).data('settings');
            var decimals = findDecimals(this.settings.step);
            var newValue = (current + parseFloat(this.settings.step)).toFixed(decimals);
            var currentValue = $(this).val();
            updateValue.call(this, newValue, currentValue);
        };

        /**
         * Decrease
         */
        $.fn.stepper.decrease = function () {
            var current = parseFloat(getValue.call(this));
            this.settings = $(this).data('settings');
            var decimals = findDecimals(this.settings.step);
            var newValue = (current - parseFloat(this.settings.step)).toFixed(decimals);
            var currentValue = $(this).val();
            updateValue.call(this, newValue, currentValue);
        };

        /**
         * Update stepper element
         * @param newValue
         * @param currentValue
         */
        var updateValue = function updateValue(newValue, currentValue) {
            if ((newValue <= this.settings.max || typeof this.settings.max === "undefined") && (newValue >= this.settings.min || typeof this.settings.min === "undefined")) {
                if (!is_touch_device()) {
                    $(this).val(newValue).focus();
                } else {
                    $(this).val(newValue);
                }
                triggerChange.call(this);
            } else if (currentValue > this.settings.max) {
                $(this).val(this.settings.max);
            } else if (currentValue < this.settings.min) {
                $(this).val(this.settings.min);
            }
        };

        /**
         * Trigger change event on number field for third party hooks
         *
         * @type {Function}
         */
        var triggerChange = debounce(function () {
            $(this).trigger('change');
        }, 400);

        /**
         * Loop every instance
         */
        return this.each(function () {
            var _this2 = this;

            /**
             * Default settings merged with user settings
             * Can be set trough data attributes or as parameter.
             * @type {*}
             */
            this.settings = $.extend({
                step: $(this).is('[step]') ? $(this).attr('step') : '1',
                min: $(this).is('[min]') ? parseFloat($(this).attr('min')) : undefined,
                max: $(this).is('[max]') ? parseFloat($(this).attr('max')) : undefined,
                debounce: $(this).is('[data-stepper-debounce]') ? parseInt($(this).attr('data-stepper-debounce')) : 400
            }, options);

            this.init = function () {
                // Store settings
                $(_this2).data('settings', _this2.settings);

                // Bind events
                bindEvents.call(_this2);
            };

            // Init
            this.init();
        });
    };

    /**
     * Auto load
     */
    $('input[type="number"]').stepper();
})(jQuery);
//# sourceMappingURL=stepper.js.map
