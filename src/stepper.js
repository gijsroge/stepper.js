(function ($) {
    $.fn.stepper = function (options) {

        /**
         * Debounce
         *
         * @param fun
         * @param mil
         * @returns {Function}
         */
        const debounce = function (fun, mil) {
            let timer;
            return function () {
                clearTimeout(timer);
                timer = setTimeout(function () {
                    fun();
                }, mil);
            };
        };

        /**
         * Get current value
         *
         * @returns {number}
         */
        const getValue = function () {
            return $(this).val() === '' ? 0 : $(this).val();
        };

        let timeout;

        /**
         * bindEvents
         */
        const bindEvents = function () {
            const spinner = $(this).closest('.js-spinner');

            spinner.mousedown(function(e) {
                clearTimeout(this.downTimer);
                this.downTimer = setTimeout(function() {
                    // do your thing
                }, 2000);
            }).mouseup(function(e) {
                clearTimeout(this.downTimer);
            });

            spinner.find('[spinner-up]').on('click mousedown', () => {
                timeout = setInterval(() => {
                    $.fn.stepper.increase.call(this);
                    return false;
                }, 20);

            });

            spinner.find('[spinner-down]').on('click mousedown', () => {
                timeout = setInterval(() => {
                    $.fn.stepper.decrease.call(this);
                    return false;
                }, 20);
            });

            spinner.find('[spinner-up], [spinner-down]').on('mouseup', () => {
                clearInterval(timeout);
                return false;
            })
        };

        /**
         * Increase
         */
        $.fn.stepper.increase = function () {
            let current = getValue.call(this);
            this.settings = $(this).data('settings');
            $(this).val(parseInt(current) + parseInt(this.settings.step));
            $(this).trigger('change');
        };

        /**
         * Decrease
         */
        $.fn.stepper.decrease = function () {
            let current = getValue.call(this);
            this.settings = $(this).data('settings');
            $(this).val(parseInt(current) - parseInt(this.settings.step));
            $(this).trigger('change');
        };

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
                step: $(this).is('[step]') ? $(this).attr('step') : 1,
                min: $(this).is('[min]') ? $(this).attr('min') : undefined,
                max: $(this).is('[max]') ? $(this).attr('max') : undefined,
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