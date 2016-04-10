/*
author: Claire Wu 20160410 
mail: hzwufenfen@corp.netease.com
desc: this is a module for a temp dialog 
all params below is optional
params: title          string    the title 
params: content        string    the content that shows
params: okBtnTxt       string    the text shows on the ok button
params: okBtnFunc      function  function binded to the ok button
params: isShowCancel   boolean   if show the cancel button
params: cancelBtnTxt   string    the text shows on the cancel button
params: cancelBtnFunc  function  function binded to the cancel button
 */
function Dialog() {
    var dialogFrame = document.createElement('div');
    dialogFrame.className = "background";
    dialogFrame.id = "dialog";
    var dialogHTML = '<div class="dialog"> \
            <div class="header"> \
                <span id="title">系统提示</span> \
                <span class="text-right"> ×</span> \
            </div> \
            <div class="content" id="content"> \
                我是弹窗的内容，这个内容是可以被配置的。标题也是同样的。 \
            </div> \
            <div class="footer"> \
                <button type="button" id="cancel">取消</button> \
                <button type="button" id="ok">确认</button> \
            </div> \
        </div>';
    dialogFrame.innerHTML = dialogHTML;
    document.body.appendChild(dialogFrame);
    this.open = function(options) {
        var okBtn = document.getElementById("ok");
        var cancelBtn = document.getElementById("cancel");
        var dialog = document.getElementById("dialog");

        if (options.title) {
            document.getElementById("title").innerText = options.title;
        }
        if (options.content) {
            document.getElementById("content").innerText = options.content;
        }
        if (options.okBtnTxt) {
            okBtn.innerText = options.okBtnTxt;
        }
        if (options.cancelBtnTxt) {
            cancelBtn.innerText = options.cancelBtnTxt;
        }
        if (!options.isShowCancel){
            cancelBtn.style.display = 'none';          
        } 

        if(options.okBtnFunc && typeof options.okBtnFunc =="function"){
            okBtn.addEventListener('click', function() {
                options.okBtnFunc();
                document.body.removeChild(dialog); 
            });
        }
        else{
            okBtn.addEventListener('click', function() {
                document.body.removeChild(dialog); 
            });
        }
         
        if(options.cancelBtnFunc && typeof options.cancelBtnFunc =="function"){
            cancelBtn.addEventListener('click', function() {
                options.cancelBtnFunc();
                document.body.removeChild(dialog); 
            });
        }
        else{
            cancelBtn.addEventListener('click', function() {
                document.body.removeChild(dialog); 
            });
        }  
    }
}
