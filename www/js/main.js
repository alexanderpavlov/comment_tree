$(document).ready(function () {
    var $commentList = $('#comments'),
        $addCommentModal = $('#add-comment-modal'),
        commentCollection = new CommentCollection({
            view: $commentList
        });

    commentCollection.fetch(function () {
        setTimeout(function() { $('.comment.level0 .expand').click(); }, 100);
    });

    $commentList.on('click', '[data-action="reply"]', function (event) {
        var id = getId(event);
        showAddCommentModal(id);
    });

    $commentList.on('click', '[data-action="edit"]', function (event) {
        var id = getId(event);
        showEditCommentModal(id);
    });

    $commentList.on('click', '[data-action="delete"]', function (event) {
        var id = getId(event), parentComment = commentCollection.getParent(id);

        $.showConfirmModal('The comment will be deleted. Are you sure?', function () {
            commentCollection.delete(id, function () {
                if(parentComment && !commentCollection.getChildren(parentComment.getId()).length) {
                    hideExpandControl(parentComment.getView());
                }
            });
        });
    });

    $commentList.on('click', '[data-action="expand"]', function (event) {
        var id = getId(event),
            comment = commentCollection.find(id),
            children = commentCollection.getChildren(id),
            $commentView = $(event.target).closest('.comment'),
            closed = commentIsClosed($commentView);

        if(closed) {
            expandComment($commentView);
        }
        else {
            closeComment($commentView);
        }

        for (var i = 0; i < children.length; i++) {
            if(closed) {
                if(Number(comment.getAttribute('level')) + 1 == children[i].getAttribute('level')) {
                    children[i].getView().show(100);
                }

                closeComment(children[i].getView());
            }
            else {
                children[i].getView().hide(100);
            }
        }
    });

    $('#add-root-comment').click(function () {
        showAddCommentModal(0);
    });

    function showAddCommentModal(replyToId) {
        $addCommentModal.find('input').val('');
        $addCommentModal.find('textarea').val('');
        $addCommentModal.find('[name=reply_to]').val(replyToId);
        $addCommentModal.find('[name=id]').val(0);
        $addCommentModal.find('.modal-title').html('Add new comment');
        $addCommentModal.find('[data-action="add"]').html('Add comment');
        $addCommentModal.modal();
    }

    function showEditCommentModal(commentId) {
        var commentData = commentCollection.find(commentId).getAttributes();

        $addCommentModal.find('input').val('');
        $addCommentModal.find('[name="author"]').val(commentData.author);
        $addCommentModal.find('[name=body]').val(commentData.body);
        $addCommentModal.find('[name=reply_to]').val(0);
        $addCommentModal.find('[name=id]').val(commentId);
        $addCommentModal.find('.modal-title').html('Edit comment');
        $addCommentModal.find('[data-action="add"]').html('Edit comment');
        $addCommentModal.modal();
    }

    $addCommentModal.find('[data-action="add"]').click(function () {
        var comment,
            commentId = Number($addCommentModal.find('[name=id]').val()),
            data = {
                author: $addCommentModal.find('[name=author]').val(),
                body: $addCommentModal.find('[name=body]').val(),
                reply_to: $addCommentModal.find('[name=reply_to]').val()
            };

        if (commentId) {
            comment = commentCollection.find(commentId);
            delete data.reply_to;
            comment.setAttributes(data);
        }
        else {
            comment = new Comment(data);
        }

        comment.sync(function () {
            $.hideAllModals();

            if (!commentId) {
                commentCollection.add(comment, data['reply_to']);

                if(Number(data['reply_to'])) {
                    var replyToComment = commentCollection.find(data['reply_to']);

                    setTimeout(function() {
                        if(!replyToComment.getView().find('.expand').is(':visible')) {
                            showExpandControl(replyToComment.getView());
                            expandComment(replyToComment.getView());
                        }
                        else if(commentIsClosed(replyToComment.getView())) {
                            replyToComment.getView().find('.expand').click();
                        }
                    }, 50);
                }
            }
        });
    });

    function expandComment($commentView) {
        $commentView.find('.expand').removeClass('glyphicon-triangle-right');
        $commentView.find('.expand').addClass('glyphicon-triangle-bottom');
    }

    function closeComment($commentView) {
        $commentView.find('.expand').removeClass('glyphicon-triangle-bottom');
        $commentView.find('.expand').addClass('glyphicon-triangle-right');
    }

    function showExpandControl($commentView) {
        $commentView.find('.expand').show();
    }

    function hideExpandControl($commentView) {
        $commentView.find('.expand').hide();
    }

    function commentIsClosed($commentView) {
        return $commentView.find('.expand').hasClass('glyphicon-triangle-right');
    }

    function getId(event) {
        return $(event.target).closest('[data-id]').prop('data-id');
    }
});