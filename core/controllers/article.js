module.exports = function () {
    'use strict';

    var self = this;

     this.get = {
        
    };

    this.post = {
        /**
         * add article
         */
        add: function () {
            require("date-format-lite");
            var path = require('path'),
                fs = require('fs'),
                now,
                dataPath = path.join(__dirname, '../../', 'public/site/data'),
                contentFile, content, timeIndex, timeIndexPath,
                tagFile,
                tagsIndex, tagsIndexPath,
                tags = (self.req.body.tags||'').split(','),
                yearExists = false,
                i, data;
            
            tags = tags.map(function (r) {
                return (r || '' ).trim();
            }).filter(function (r) {
                return !!r;
            })
            self.req.body.date ?
                    now = new Date(self.req.body.date)
                :
                    now = new Date();
            // save data
            data = {
                title: self.req.body.title,
                date: now.toString(),
                type: self.req.body.type,
                content: self.req.body.content,
                tags: self.req.body.tags
            };
            contentFile = path.join(dataPath, 'content', now.format('YYYY-MM') + '.json');
            if (fs.existsSync(contentFile)) {
                content = require(contentFile);
            } else {
                content = [];
            }
            content.unshift(data);
            fs.writeFile(contentFile, JSON.stringify(content), {
                flag: 'w+'
            }, function (err) {
                if (err) {
                    self.res.send({
                        state: false,
                        errno: err.errno,
                        message: 'write ' + contentFile + ' failed'
                    });
                    return;
                }

                // save index
                timeIndexPath = path.join(dataPath, 'index', 'time.json');
                if (fs.existsSync(timeIndexPath)) {
                    timeIndex = require(timeIndexPath);
                } else {
                    timeIndex = [];
                }
                for (i in timeIndex) {
                    if (timeIndex[i].year === now.getFullYear()) {
                        yearExists = true;
                        if (timeIndex[i].month.indexOf(now.getMonth() + 1) === -1) {
                            timeIndex[i].month.unshift(now.getMonth() + 1);
                        }
                    }
                }
                if (!yearExists) {
                    timeIndex.unshift({
                        year: now.getFullYear(),
                        month: [now.getMonth() + 1]
                    });
                }
                timeIndex && fs.writeFileSync(timeIndexPath, JSON.stringify(timeIndex));


                tagsIndexPath = path.join(dataPath, 'index', 'tag.json');
                if (fs.existsSync(tagsIndexPath)) {
                    tagsIndex = require(tagsIndexPath);
                } else {
                    tagsIndex = {};
                }
                for (i in tags) {
                    if (!tags[i]) {
                        continue;
                    }
                    if (typeof tagsIndex[tags[i]] === 'object') {
                        tagsIndex[tags[i]].count += 1;
                    } else {
                        tagsIndex[tags[i]] = {
                            count: 1
                        };
                    }
                    tagFile = path.join(dataPath, 'tags', tags[i] + '.json');
                    if (fs.existsSync(tagFile)) {
                        content = require(tagFile);
                    } else {
                        content = [];
                    }
                    content.unshift(data);
                    fs.writeFile(tagFile, JSON.stringify(content));
                }
                fs.writeFile(tagsIndexPath, JSON.stringify(tagsIndex));
                self.res.send({state: true});
            });
        }
    };
};