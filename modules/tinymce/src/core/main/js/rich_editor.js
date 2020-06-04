var RE = {}
RE.editor = document.getElementById('mytextarea');

RE.currentSelection = {
  "startContainer": 0,
  "startOffset": 0,
  "endContainer": 0,
  "endOffset": 0
};
// Initializations
RE.callback = function () {
  window.location.href = "re-callback://" + encodeURI(RE.getEditHtml());
}
RE.getEditHtml = function () {
  console.log(tinyMCE.activeEditor.getContent())
  return tinyMCE.activeEditor.getContent();
}

RE.setHtml = function (html) {
  html = decodeURIComponent(html.replace(/\+/g, '%20'))
  tinymce.DOM.setHTML('mytextarea', html);
}

RE.setContent = function (html) {
  tinymce.activeEditor.setContent(html);
}

RE.deleteContent = function(){
  tinymce.activeEditor.execCommand('Delete')
}

RE.blur = function () {
  // 编辑器blur掉光标
  $("#mytextarea_ifr").contents().find('#tinymce').blur()
}

RE.insertImage = function () {
  var html = '<p style="height: 15px;"></p>' +
    '<span class="qf_image" contenteditable="false"><img src="https://qiance.qianfanyun.com/20200428_1354_1588064712337.jpg" alt="" width="256" height="62" data-mce-src="https://qiance.qianfanyun.com/20200428_1354_1588064712337.jpg"><a class="qf_image_mark" href="javascirpt:void(0);" contenteditable="false">Caption</a></span>' +
    '<p style="height: 15px;"></p>'
  tinymce.activeEditor.execCommand('mceInsertContent', false, html)
  // tinymce.activeEditor.selection.setNode(tinymce.activeEditor.dom.create('img', {src: 'https://qiance.qianfanyun.com/20200428_1354_1588064712337.jpg', title: 'some title'}));
}

RE.getText = function () {
  var activeEditor = tinymce.activeEditor;
  // var editBody = activeEditor.getBody();
  // activeEditor.selection.select(editBody);
  var text = activeEditor.getContent({'format': 'text'});
  return text;
}


RE.getWordCount = function () {
  var wordcount = tinymce.activeEditor.plugins.wordcount;
  return wordcount.body.getCharacterCountWithoutSpaces();
}

RE.setPlaceholder = function (content) {

}

RE.getAllImageList = function () {
  let qf_insert_video = $("#mytextarea_ifr").contents().find('.qf_insert_video')
  let qf_image = $("#mytextarea_ifr").contents().find('.qf_image')

  // TODO: 需要修改
  var obj = []
  if (qf_image.length > 0) {
    qf_image.each((index, item) => {
      let re = {}
      re.type = 0
      re.url = item.children[0].getAttribute('src')
      re.origin_url = item.children[0].getAttribute('src')
      re.height = item.children[0].getAttribute('original-height')
      re.width = item.children[0].getAttribute('original-width')
      obj.push(re)
    })
  }
  if (qf_insert_video.length > 0) {
    qf_insert_video.each((index, item) => {
      console.log(item)
      let re = {}
      re.type = 2
      re.url = item.children[0].getAttribute('poster')
      re.origin_url = item.children[0].getAttribute('src')
      re.height = item.children[0].height
      re.width = item.children[0].width
      obj.push(re)
    })
  }
  return obj
}


RE.setHtml = function (html) {
  tinymce.activeEditor.setContent(html);
}
RE.insertVideo = function (video) {
  video = JSON.parse(video)
  var poster = video.host + video.poster
  console.log(poster)
  var origin_poster = video.poster
  var url = video.host + video.name
  var origin_url = video.name
  var w = ($('body').width());
  console.log(w)
  var h = w / 1.33;//设置宽高比例为1.33
  var source = `<source src="${url}" type="video/mp4" />`
  source = encodeURIComponent(source)
  var html = `<span data-mce-object="video" class="mceNonEditable qf_insert_video mce-preview-object mce-object-video" data-mce-p-data-mce-fragment="1" data-mce-p-controls="controls" data-mce-p-poster="${poster}" data-mce-html="${source}">
	<p style="height: 20px;"></p>
	<video data-qf-origin="${origin_url}" data-qf-poster-origin="${origin_poster}" src="${url}" poster="${poster}" width="${w}" height="${h}" frameborder="0"></video>
	<span class="mce-shim"></span><p style="height: 20px;"></p>
</span>`
// 	var html = `<span class="qf_insert_video mce-preview-object mce-object-video" contenteditable="false" data-mce-object="video" data-mce-p-allowfullscreen="allowfullscreen" data-mce-p-frameborder="no" data-mce-p-scrolling="no" data-mce-p-src=${url} data-mce-html="%20"
// ><video class="qf_video" data-qf-origin="${origin_url}" data-qf-poster-origin="${origin_poster}" controls="controls" poster="${poster}" width="${video.w}" height="${video.h}"></video></span>`

  // var html = `<img data-mce-p-data-mce-fragment="1" data-mce-p-controls="controls" data-mce-p-poster="${poster}" data-mce-html="${source}" width="${w}" height="${h}" src="${poster}" data-qf-origin="${origin_url}" data-qf-poster-origin="${origin_poster}"  data-mce-object="video" class="mce-object mce-object-video qf_insert_video">`
  tinymce.activeEditor.execCommand('mceInsertContent', false, html)
}


RE.videoSelected = function (currentNode) {
  // 加关闭按钮
  if ($('.closeImg').length > 0) {
    return false
  }

  let delHtml = document.createElement("span");
  delHtml.classList.add("closeImg")
  // delHtml.setAttribute('onclick', RE.deleteImg);
  // delHtml.setAttribute('contenteditable', false)
  currentNode.appendChild(delHtml);
  currentNode.style.position = 'relative'


  // // 关闭按钮加点击事件,删除视频
  delHtml.onclick = function (e) {
    e.stopPropagation()
    QFH5.listCoverImages(function (state, data) {
      if (data.attaches.length > 0) {

        let src = currentNode.children[0].getAttribute('src')

        let result = data.attaches.findIndex(res => res.origin_url === src)
        if (result >= 0) {
          QFH5.toast(3, '封面图不可删除', 1)
          return false
        }
      }
      currentNode.remove()
    })
  }

}

RE.setPadding = function (left, top, right, bottom) {
  document.body.style.paddingLeft = left
  document.body.style.paddingTop = top
  document.body.style.paddingRight = right
  document.body.style.paddingBottom = bottom
}
// 加粗
RE.setBold = function () {
  tinymce.activeEditor.execCommand('bold')
}

// 无序列表
RE.setBullets = function () {
  if (tinymce.activeEditor.selection.getNode().nodeName === 'LI') {
    tinymce.activeEditor.execCommand('RemoveList');
    return false
  }
  tinymce.activeEditor.execCommand('insertUnorderedList', false, {
    'list-style-type': 'disc',
    'list-attributes': {class: 'mylistclass'},
    'list-item-attributes': {class: 'mylistitemclass'},
  });
}

// 有序列表
RE.setNumbers = function () {
  if (tinymce.activeEditor.selection.getNode().nodeName === 'LI') {
    tinymce.activeEditor.execCommand('RemoveList');
    return false
  }
  tinymce.activeEditor.execCommand('insertOrderedList', false, {
    'list-style-type': 'decimal',
    'list-attributes': {class: 'mylistclass'},
    'list-item-attributes': {class: 'mylistitemclass'},
  });
}

// 斜体
RE.setItalic = function () {
  tinymce.activeEditor.execCommand('italic', false, null);
}

// 引用
RE.setQuota = function () {
  tinymce.activeEditor.execCommand('mceBlockQuote')
}
// 左对齐
RE.setJustifyLeft = function () {
  tinymce.activeEditor.execCommand('JustifyLeft')
}
//居中对齐
RE.setJustifyCenter = function () {
  tinymce.activeEditor.execCommand('JustifyCenter')
}
//右对齐
RE.setJustifyRight = function () {
  tinymce.activeEditor.execCommand('JustifyRight')
}

// 设置字体
RE.setFontSize = function (fontSize) {
  tinymce.activeEditor.execCommand('FontSize', false, fontSize)
}

//插入分割线
RE.insertSplitLine = function () {
  tinymce.activeEditor.execCommand('InsertHorizontalRule')
}
// 删除线
RE.setStrikeThrough = function () {
  tinymce.activeEditor.execCommand('Strikethrough')
}

// 下划线
RE.setUnderline = function () {
  tinymce.activeEditor.execCommand('Underline')
}

// 撤销
RE.undo = function () {
  tinymce.activeEditor.execCommand('Undo')
}

// 恢复
RE.redo = function () {
  tinymce.activeEditor.execCommand('Redo')
}

// 插入h标签
RE.setHeading = function (heading) {
  document.execCommand('formatBlock', false, '<h' + heading + '>');
}

// 获取选取内容
RE.getSelectedRangeText = function () {
  let selected_text = tinymce.activeEditor.selection.getContent({format: 'text'})
  if (selected_text.length > 0) {
    return selected_text;
  }
  return '';
}

// 插入链接
RE.insertLink = function (url, title) {
  // tinymce.activeEditor.execCommand('mceLink', false, title);

  var html = `<a class="qf_insert_link" data-mce-href="${url}" href="${url}">${title}</a>&nbsp;`
  tinymce.activeEditor.execCommand('mceInsertContent', false, html)
  RE.clickLink();
  RE.callback();
}


// 链接点击事件
RE.clickLink = function () {
  $("#mytextarea_ifr").contents().find('.qf_insert_link').on('click', function (e) {
    RE.jumpEditLink(e.target)
  });
}

// 图片备注点击
RE.clickImage = function(e){
  var innerHtml = e.innerText
  window.markNode = e
  QFH5.showImageRemarkLayer(innerHtml, function (state,data) {
    if(state === 1)
      window.markNode.innerText = data.remark
  })
}
// @人
RE.insertAt = function (uid, name) {
  var html = '<a class="qf_at" href="javascript:void(0)" contenteditable="false" data-uid="' + uid + '">@' + name + '</a>&nbsp;'
  tinymce.activeEditor.execCommand('mceInsertContent', false, html);
}

// 插入话题
RE.insertTopic = function (topic_id, name) {
  var html = '<a class="qf_topic" href="javascript:void(0)" contenteditable="false" data-topic-id="' + topic_id + '">#' + name + '#</a>&nbsp;'
  tinymce.activeEditor.execCommand('mceInsertContent', false, html);
}

// 插入表情
RE.insertExpression = function (url, smile, smileid, width, height) {
  var html = '<img src="' + url + '" data-smile="' + smile + '" smilieid="' + smileid + '" width="' + width + '" height="' + height + '">';
  tinymce.activeEditor.execCommand('mceInsertContent', false, html);
}
// 编辑链接
RE.jumpEditLink = function (self) {
  // Stores a bookmark of the current selection
  window.bm = tinymce.activeEditor.selection.getBookmark();
  // Restore the selection bookmark
  var text = self.innerText
  var href = self.getAttribute('href')
  window.linkNode = self
  // var id = bm.id+'_start'
  // var b = window.linkNode.childNodes;
  // bbq:
  // for(i=0;i<b.length;i++){
  // 	if(b[i].nodeType === 1 && b[i].id === id){
  // 		window.bm_id = id
  // 		break bbq;
  // 	}
  // }
  $("#mytextarea_ifr").contents().find('#tinymce').blur()
  QFH5.jumpEditLink(text, href, function (state, data) {
    if (state == 1) {
      window.linkNode.innerHTML = data.text
      window.linkNode.setAttribute('href', data.link)
    }
  })
}




// 编辑图片备注
RE.jumpEditImageMark = function(self){
  var text = self.innerText
  var href = self.getAttribute('href')
  window.linkNode = self
}
RE.enabledEditingItems = function (e) {
  var items = [];
  if (tinymce.activeEditor.queryCommandValue('formatBlock')) {
    var formatBlock = document.queryCommandValue('formatBlock');
    if (formatBlock == 'div') {
      items.push('formatQuota');
    }
  }
  if (tinymce.activeEditor.queryCommandState('bold')) {
    items.push('bold');
  }
  if (tinymce.activeEditor.queryCommandState('italic')) {
    items.push('italic');
  }
  if (tinymce.activeEditor.queryCommandState('subscript')) {
    items.push('subscript');
  }
  if (tinymce.activeEditor.queryCommandState('superscript')) {
    items.push('superscript');
  }
  if (tinymce.activeEditor.queryCommandState('strikeThrough')) {
    items.push('strikeThrough');
  }
  if (tinymce.activeEditor.queryCommandState('underline')) {
    items.push('underline');
  }
  if (tinymce.activeEditor.queryCommandState('insertOrderedList')) {
    items.push('orderedList');
  }
  if (tinymce.activeEditor.queryCommandState('insertUnorderedList')) {
    items.push('unorderedList');
  }
  if (tinymce.activeEditor.queryCommandState('justifyCenter')) {
    items.push('justifyCenter');
  }
  if (tinymce.activeEditor.queryCommandState('justifyFull')) {
    items.push('justifyFull');
  }
  if (tinymce.activeEditor.queryCommandState('justifyLeft')) {
    items.push('justifyLeft');
  }
  if (tinymce.activeEditor.queryCommandState('justifyRight')) {
    items.push('justifyRight');
  }
  if (tinymce.activeEditor.queryCommandState('insertHorizontalRule')) {
    items.push('horizontalRule');
  }
  var formatBlock = tinymce.activeEditor.queryCommandValue('formatBlock');
  if (formatBlock.length > 0) {
    items.push(formatBlock);
  }

  window.location.href = "re-state://" + encodeURI(items.join(','));
}

