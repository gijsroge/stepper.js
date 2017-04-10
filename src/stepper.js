(function ($) {
    $.fn.stepper = function (options) {

        const debounce = function(fun, mil){
            let timer;
            return function(){
                clearTimeout(timer);
                timer = setTimeout(function(){
                    fun();
                }, mil);
            };
        };

        /**
         * Init
         */
        const init = function () {

        };

        /**
         * bindEvents
         */
        const bindEvents = function () {
            $(this).closest('.js-spinner').find('[data-spin="up"]').on('click', () => {
                $.fn.number.increase.call(this);
            });
            $(this).closest('.js-spinner').find('[data-spin="down"]').on('click', () => {
                $.fn.number.decrease.call(this);
            });
        };

        /**
         * Increase
         */
        $.fn.number.increase = function() {
            const current = $(this).val();
            this.settings = $(this).data('settings');
            $(this).val(parseInt(current) + parseInt(this.settings.step));
            $(this).trigger('change');
        };

        /**
         * Decrease
         */
        $.fn.number.decrease = function() {
            const current = $(this).val();
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

                // Prepare element
                init.call(this);

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