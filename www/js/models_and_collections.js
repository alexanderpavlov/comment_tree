/* Models */
function Model(url, attributes, settings) {
    this.attributes = attributes;
    this.tpl = settings.tpl;
    this.url = url;
    this.$view = null;

    this.synchronized = Boolean(this.getId());
}

Model.prototype.constructor = Model;

Model.prototype.sync = function (callback) {
    var that = this;

    if (this.synchronized) {
        return;
    }

    if (!this.getId()) {
        $.restAdd(this.url, this.getAttributes(), function (data) {
            that.attributes = data.result;
            that.synchronized = true;

            if (callback) {
                callback();
            }
        });
    }
    else {
        $.restUpdate(this.url, this.getId(), this.unsyncAttributes, function () {
            for (var key in that.unsyncAttributes) {
                that.attributes[key] = that.unsyncAttributes[key];
            }

            that.unsyncAttributes = {};
            that.synchronized = true;

            that.render();

            if (callback) {
                callback();
            }
        });
    }
};

Model.prototype.get = function () {

};

Model.prototype.delete = function (soft, callback) {
    if (this.getId()) {
        var that = this;

        if (soft) {
            this.attributes = null;
            that.$view.remove();
        }
        else {
            $.restDelete(this.url, this.attributes.id, function () {
                that.$view.remove();

                if(callback) {
                    callback();
                }
            });
        }
    }
};

Model.prototype.getAttributes = function () {
    return jQuery.extend({}, this.attributes);
};

Model.prototype.getAttribute = function (attribute) {
    return this.attributes[attribute];
};

Model.prototype.setAttributes = function (data) {
    if (!this.unsyncAttributes) {
        this.unsyncAttributes = {};
    }

    for (var key in data) {
        this.unsyncAttributes[key] = data[key];
    }

    this.synchronized = false;
};

Model.prototype.getId = function () {
    return this.getAttribute('id');
};

function Comment(attributes, settings) {
    settings = settings || {};
    settings.tpl = '#comment-tpl';
    Model.apply(this, ['/rest/comment', attributes, settings]);
}

Comment.prototype = Object.create(Model.prototype);
Comment.prototype.constructor = Comment;

Comment.prototype.render = function () {
    var attributes = this.getAttributes();

    if (!this.$view) {
        this.$view = $(this.tpl).clone();
        this.$view.removeClass('hideme').removeProp('id');
    }

    this.$view.prop('data-id', attributes.id);
    this.$view.prop('data-level', attributes.level);
    this.$view.addClass('level' + attributes.level);
    this.$view.find('.author').html($.escapeHtml(attributes.author));
    this.$view.find('.date').html($.dateFormat(attributes.created_at));
    this.$view.find('.comment-body').html($.escapeHtml(attributes.body));
    this.$view.css('margin-left', 20 * attributes.level + 'px');

    if(attributes.right_key - attributes.left_key > 1) {
        this.$view.find('.expand').show();
    }

    return this.$view;
};

Comment.prototype.getView = function () {
    return this.$view;
};

/* Collections */
function Collection(url, settings) {
    this.url = url;
    this.modelClass = settings.modelClass;
    this.view = settings.view;
    this.collection = [];
}

Collection.prototype.constructor = Collection;

Collection.prototype.fetch = function (callback) {
    var that = this;
    $.restGetCollection(this.url, function (data) {
        var result = data.result;

        that.collection = [];

        for (var i = 0; i < result.length; i++) {
            that.collection.push(new that.modelClass(result[i]));
        }

        that.render();

        if (callback) {
            callback();
        }
    });
};

Collection.prototype.render = function () {
    this.view.html('');

    for (var i = 0; i < this.collection.length; i++) {
        this.view.append(this.collection[i].render());
    }
};

Collection.prototype.find = function (id) {
    for (var i = 0; i < this.collection.length; i++) {
        if (this.collection[i].getId() == id) {
            return this.collection[i];
        }
    }

    return null;
};

Collection.prototype.find = function (id) {
    for (var i = 0; i < this.collection.length; i++) {
        if (this.collection[i].getId() == id) {
            return this.collection[i];
        }
    }

    return null;
};

Collection.prototype.findPosition = function (id) {
    for (var i = 0; i < this.collection.length; i++) {
        if (this.collection[i].getId() == id) {
            return i;
        }
    }

    return -1;
};

function CommentCollection(settings) {
    settings.modelClass = Comment;
    Collection.apply(this, ['/rest/comment', settings]);
}

CommentCollection.prototype = Object.create(Collection.prototype);
CommentCollection.prototype.constructor = CommentCollection;

CommentCollection.prototype.getChildren = function (id) {
    var position = this.findPosition(id),
        comment = this.collection[position],
        children = [];

    for (var i = position + 1; i < this.collection.length; i++) {
        if (comment.getAttribute('level') < this.collection[i].getAttribute('level')) {
            children.push(this.collection[i]);
        }
        else {
            break;
        }
    }

    return children;
};

CommentCollection.prototype.getParent = function(id) {
    var position = this.findPosition(id),
        comment = this.collection[position];

    if(!Number(comment.getAttribute('level'))) {
        return null;
    }

    for(var i = position - 1; i > 0; i++) {
        if(this.collection[i].getAttribute('level') < comment.getAttribute('level')) {
            return this.collection[i];
        }
    }

    return null;
};

CommentCollection.prototype.add = function (comment, replyTo) {
    var position, replyToComment;

    if (Number(replyTo)) {
        replyToComment = this.find(replyTo);

        for (var i = 0; i < this.collection.length; i++) {
            if (position) {
                if (this.collection[i].getAttribute('level') > replyToComment.getAttribute('level')) {
                    position = i;
                }
                else {
                    break;
                }
            }

            if (!position && this.collection[i].getId() == replyTo) {
                position = i;
            }
        }

        this.collection.splice(position + 1, 0, comment);
        this.view.find('.comment:eq(' + position + ')').after(comment.render());
    }
    else {
        this.collection.push(comment);
        this.view.append(comment.render());
    }
};

CommentCollection.prototype.delete = function (id, callback) {
    var position = this.findPosition(id),
        comment = this.collection[position],
        childrenCommentsTotal = 0;

    for (var i = position + 1; i < this.collection.length; i++) {
        if (comment.getAttribute('level') < this.collection[i].getAttribute('level')) {
            childrenCommentsTotal++;
            this.collection[i].delete(true);
        }
        else {
            break;
        }
    }

    this.collection.splice(position, 1 + childrenCommentsTotal);
    comment.delete(null, callback);
};