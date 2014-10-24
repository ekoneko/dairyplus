module.exports = function () {
    'use strict';

     this.get = {
        /**
         * admin index
         */
        index : function () {
            this.res.render('admin/index/index.hbs');
        }
    };
};