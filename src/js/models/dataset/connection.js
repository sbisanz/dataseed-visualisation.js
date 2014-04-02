define(['backbone', 'underscore'],
        function(Backbone, _) {
    'use strict';

    var Connection = Backbone.Model.extend({

        url: function() {
            var url = '/api/datasets/' + this.dataset.get('id') + '/' + this.get('type') + '/' + this.get('dimension'),
                params = _.extend({}, this.get('cut'), {
                    'measure': this.get('measure'),
                    'aggregation': this.get('aggregation')
                });

            // Bucket dimensions
            var bucket = this.get('bucket');
            if (this.get('type') == 'dimensions' && !_.isUndefined(bucket) && !_.isNull(bucket)) {
                params['bucket'] = bucket;
            }

            // Add cut to query parameters
            var urlParams = _.map(params, function (value, key, cut) { return key + '=' + value; });

            // Add query parameters to URL
            url += '?' + urlParams.join('&');

            return url;
        },

        /**
         * Init
         */
        initialize: function(options) {
            // Set dataset model
            this.dataset = options['dataset'];

            // Fetch
            this.fetch();
        },

        /**
         * Check if data has loaded
         */
        isLoaded: function() {
            return (!_.isUndefined(this.getData()));
        },

        /**
         * Get data
         */
        getData: function() {
            return this.get(this.get('dimension'));
        },

        /**
         * Get the specified value
         */
        getValue: function(k) {
            return this.getData()[k];
        },

        /**
         * Sum the values for this dimension
         */
        getTotal: function() {
            var dimension = this.get('dimension'),
                currentCut = null;
            if (this.dataset.isCut(dimension)) {
                currentCut = this.dataset.getCut(dimension);
            }
            return _.reduce(this.getData(), function(m, v) {
                if (currentCut === null || currentCut === v.id) {
                    return m + v.total;
                }
                return m;
            }, 0);
        }

    });

    return Connection;

});