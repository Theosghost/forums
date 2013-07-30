/*
 * XenForo attachment_editor.min.js
 * Copyright 2010-2013 XenForo Ltd.
 * Released under the XenForo License Agreement: http://xenforo.com/license-agreement
 */
(function(e,m,k){var i=XenForo.speed.normal,h=XenForo.speed.fast;XenForo.AttachmentUploader=function(b){var f=e(b.data("trigger"));b.closest("form");var a=e(b.data("placeholder")),c={},d=null,j=null,g=b.data("maxfilesize");b.data("maxuploads");var h=b.data("extensions"),i=b.data("uniquekey");b.show();var l=XenForo.canonicalizeUrl(b.data("flashurl")||"js/swfupload/Flash/swfupload.swf");console.info("flash url: %s",l);typeof SWFUpload=="function"&&(d=new SWFUpload({upload_url:b.data("action"),file_post_name:b.data("postname"),
file_types:"*."+(h.toLowerCase()+","+h.toUpperCase()).replace(/,/g,";*."),post_params:e.extend({_xfToken:XenForo._csrfToken,_xfNoRedirect:1,_xfResponseType:"json"},c),button_placeholder_id:a.attr("id"),button_width:1,button_height:1,button_window_mode:SWFUpload.WINDOW_MODE.TRANSPARENT,button_cursor:SWFUpload.CURSOR.HAND,flash_url:l,prevent_swf_caching:!1,swfupload_loaded_handler:function(){console.info("SWFUpload successfully initialized (%s)",this.movieName);this.setButtonDimensions(f.outerWidth(),
f.outerHeight());b.find(".HiddenInput").each(function(a,b){d.addPostParam(e(b).data("name"),e(b).data("value"))});e(k).bind("CSRFRefresh",function(b){b.ajaxData&&(d.addPostParam("_xfToken",b.ajaxData.csrfToken),d.addPostParam("_xfSessionId",b.ajaxData.sessionId))})},file_dialog_complete_handler:function(){try{this.getStats().files_queued>0&&this.startUpload(this.getFile(0).ID)}catch(b){this.debug(b)}},file_queued_handler:function(a){var c;switch(a.name.substr(a.name.lastIndexOf(".")).toLowerCase()){case ".jpg":case ".jpeg":case ".jpe":case ".png":case ".gif":c=
!0;break;default:c=!1}var d=e.Event("AttachmentQueueValidation");d.file=a;d.swfUpload=this;d.isImage=c;b.trigger(d);if(!d.isDefaultPrevented())a.size>g&&!c?(this.cancelUpload(a.id,!1),typeof this.settings.file_queue_error_handler=="function"&&this.settings.file_queue_error_handler.call(this,a,SWFUpload.QUEUE_ERROR.FILE_EXCEEDS_SIZE_LIMIT,"The uploaded file is too large.")):(d=e.Event("AttachmentQueued"),d.file=a,d.swfUpload=this,d.isImage=c,b.trigger(d))},file_queue_error_handler:function(a,c,d){var f=
e.Event("AttachmentQueueError");f.file=a;f.errorCode=c;f.message=d;f.swfUpload=this;b.trigger(f);f.isDefaultPrevented()||j(a,c,d)},upload_start_handler:function(a){console.log("Uploading %s",a.name)},upload_progress_handler:function(a,c){b.trigger({type:"AttachmentUploadProgress",file:a,bytes:c,swfUpload:this})},upload_success_handler:function(a,c){try{var d=e.parseJSON(c)}catch(f){console.warn(f);return}d.error?b.trigger({type:"AttachmentUploadError",file:a,ajaxData:d,swfUpload:this}):b.trigger({type:"AttachmentUploaded",
file:a,ajaxData:d,swfUpload:this})},upload_error_handler:function(a,c,d){console.warn("Upload failed: %o",arguments);b.trigger({type:"AttachmentUploadError",file:a,errorCode:c,message:d,ajaxData:{error:[b.data("err-unknown")]},swfUpload:this})},upload_complete_handler:function(){try{this.getStats().files_queued>0?this.startUpload(this.getFile(0).ID):console.info("All files uploaded.")}catch(a){this.debug(a)}}}),j=function(a,c,d){c=b.data("err"+c)||d;a?XenForo.alert(c+"<br /><br />"+a.name):XenForo.alert(c)});
e(k).bind("AutoInlineUploadComplete",function(a){if(i&&a.ajaxData&&i!==a.ajaxData.key)return!1;if(e(a.target).is("form.AttachmentUploadForm"))return f.overlay()&&f.overlay().close(),b.trigger({type:"AttachmentUploaded",ajaxData:a.ajaxData}),!1});return{getSwfUploader:function(){return d},swfAlert:j}};XenForo.AttachmentEditor=function(b){this.setVisibility=function(a){var c=b.closest(".ctrlUnit"),d=b.find(".AttachmentInsertAll"),f=b.find(".AttachedFile:not(#AttachedFileTemplate)"),e=f.filter(".AttachedImage");
console.info("Attachments changed, total files: %d, images: %d",f.length,e.length);c.length==0&&(c=b);a===!0?f.length?(e.length>1?d.show():d.hide(),c.show()):c.hide():f.length?(e.length>1?c.is(":hidden")?d.show():d.xfFadeDown(XenForo.speed.fast):c.is(":hidden")?d.hide():d.xfFadeUp(XenForo.speed.fast,!1,XenForo.speed.fast,"swing"),c.xfFadeDown(XenForo.speed.normal)):(d.slideUp(XenForo.speed.fast),c.xfFadeUp(XenForo.speed.normal,!1,!1,"swing"))};this.setVisibility(!0);e("#AttachmentUploader").bind({AttachmentQueued:function(a){console.info("Queued file %s (%d bytes).",
a.file.name,a.file.size);var c=e("#AttachedFileTemplate").clone().attr("id",a.file.id);c.find(".Filename").text(a.file.name);c.find(".ProgressCounter").text("0%");c.find(".ProgressGraphic span").css("width","0%");a.isImage&&c.addClass("AttachedImage");c.xfInsert("appendTo",".AttachmentList.New",null,i);c.find(".AttachmentCanceller").css("display","block").click(function(){a.swfUpload.cancelUpload(a.file.id);c.xfRemove(null,null,h,"swing")});b.trigger("AttachmentsChanged")},AttachmentUploadProgress:function(a){console.log("Uploaded %d/%d bytes.",
a.bytes,a.file.size);var c=Math.min(100,Math.ceil(a.bytes*100/a.file.size)),b=c+"%",a=e("#"+a.file.id),f=a.find(".ProgressCounter"),g=a.find(".ProgressGraphic");f.text(b);g.css("width",b);c>=100&&a.find(".AttachmentCanceller").attr("disabled",!0).addClass("disabled");g.width()>f.outerWidth()&&f.appendTo(g)},AttachmentUploadError:function(a){var c="";e.each(a.ajaxData.error,function(a,b){c+=b+"\n"});XenForo.alert(c+"<br /><br />"+a.file.name);e("#"+a.file.id).xfRemove();console.warn("AttachmentUploadError: %o",
a)},AttachmentUploaded:function(a){if(a.file){var c=e("#"+a.file.id),d=c.find(".AttachmentText"),f=e(a.ajaxData.templateHtml),g;d.fadeOut(XenForo.speed.fast,function(){f.find(".AttachmentText").xfInsert("insertBefore",d,"fadeIn",XenForo.speed.fast);g=c.find(".Thumbnail");g.html(f.find(".Thumbnail").html());d.xfRemove();c.attr("id","attachment"+a.ajaxData.attachment_id)})}else c=e("#attachment"+a.ajaxData.attachment_id),c.length||(c=e(a.ajaxData.templateHtml).xfInsert("appendTo",b.find(".AttachmentList.New"),
null,i));b.trigger("AttachmentsChanged")}});var f=e.context(this,"setVisibility");e("#QuickReply").bind("QuickReplyComplete",function(){b.find(".AttachmentList.New li:not(#AttachedFileTemplate)").xfRemove(null,f)});b.bind("AttachmentsChanged",f)};XenForo.AttachmentInserter=function(b){b.click(function(f){var a=b.closest(".AttachedFile").find(".Thumbnail a"),c=a.data("attachmentId"),d,e=a.find("img").attr("src"),a=a.attr("href");f.preventDefault();b.attr("name")=="thumb"?(f="[ATTACH]"+c+"[/ATTACH] ",
c='<img src="'+e+'" class="attachThumb bbCodeImage" alt="attachThumb'+c+'" /> '):(f="[ATTACH=full]"+c+"[/ATTACH] ",c='<img src="'+a+'" class="attachFull bbCodeImage" alt="attachFull'+c+'" /> ');if(d=XenForo.getEditorInForm(b.closest("form")))d.execCommand?(d.execCommand("mceInsertContent",!1,c),setTimeout(function(){d.execCommand("xenForoElastic")},250),setTimeout(function(){d.execCommand("xenForoElastic")},1E3)):d.val(d.val()+f)})};XenForo.AttachmentDeleter=function(b){b.css("display","block").click(function(b){var b=
e(b.target),a=b.attr("href")||b.data("href"),c=b.closest(".AttachedFile");if(a)return c.xfFadeUp(XenForo.speed.normal,null,h,"swing"),XenForo.ajax(a,"",function(a){if(XenForo.hasResponseError(a))return c.xfFadeDown(XenForo.speed.normal),!1;var b=c.closest(".AttachmentEditor");c.xfRemove(null,function(){b.trigger("AttachmentsChanged")},h,"swing")}),!1;console.warn("Unable to locate href for attachment deletion from %o",b)})};XenForo.AttachmentInsertAll=function(b){b.click(function(){e(".AttachmentInserter[name="+
b.attr("name")+"]").each(function(b,a){e(a).trigger("click")})})};XenForo.AttachmentDeleteAll=function(b){b.click(function(){e(".AttachmentDeleter").each(function(b,a){e(a).trigger("click")})})};XenForo.register(".AttachmentUploader","XenForo.AttachmentUploader");XenForo.register(".AttachmentEditor","XenForo.AttachmentEditor");XenForo.register(".AttachmentInserter","XenForo.AttachmentInserter");XenForo.register(".AttachmentDeleter","XenForo.AttachmentDeleter");XenForo.register(".AttachmentInsertAll",
"XenForo.AttachmentInsertAll");XenForo.register(".AttachmentDeleteAll","XenForo.AttachmentDeleteAll")})(jQuery,this,document);