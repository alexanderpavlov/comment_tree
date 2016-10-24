<div class="modal fade" tabindex="-1" role="dialog" id="add-comment-modal">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Add new comment</h4>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <input class="form-control" type="text" name="author" value="" placeholder="Your name">
                </div>
                <div class="form-group">
                    <textarea class="form-control" name="body" rows="5" placeholder="Comment"></textarea>
                </div>
                <input type="hidden" name="reply_to">
                <input type="hidden" name="id">
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
                <button type="button" class="btn btn-primary" data-action="add">Add comment</button>
            </div>
        </div>
    </div>
</div>